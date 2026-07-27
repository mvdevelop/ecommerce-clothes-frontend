// secure-mock-server.js - Security enhanced version of mock server

const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const crypto = require('crypto');
const validator = require('validator');
const { body, query, param, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 4000 || 4001; // Default to 4000, but can be overridden

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://picsum.photos"],
      scriptSrc: ["'self'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for auth endpoints during testing
  skip: (req) => {
    return req.path.includes('/login') || req.path.includes('/signup') ||
           (process.env.NODE_ENV === 'development');
  },
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory stores (in production, use Redis or database)
let users = [];
const carts = {};
const tokens = {};
const addresses = {};
const orders = {};

// Security configuration
const SECURITY_CONFIG = {
  passwordMinLength: 8,
  passwordComplexity: {
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  tokenLength: 32,
  passwordHashRounds: 12,
};

// Helper functions
function generateSecureToken() {
  return crypto.randomBytes(SECURITY_CONFIG.tokenLength).toString('hex');
}

function hashPassword(password) {
  return crypto
    .pbkdf2Sync(
      password,
      'e-commerce-clothes-frontend-salt',
      SECURITY_CONFIG.passwordHashRounds,
      64,
      'sha512'
    )
    .toString('hex');
}

function validatePassword(password) {
  if (password.length < SECURITY_CONFIG.passwordMinLength) {
    return `Password must be at least ${SECURITY_CONFIG.passwordMinLength} characters long`;\n  }
  const complexity = SECURITY_CONFIG.passwordComplexity;
  if (complexity.requireLowercase && !/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (complexity.requireUppercase && !/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (complexity.requireNumbers && !/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (complexity.requireSpecialChars && !/[!@#$%^&*(),.?":{}|&<>]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return null;
}

function validateEmail(email) {
  if (!email) return 'Email is required';
  if (!validator.isEmail(email)) return 'Invalid email format';
  return null;
}

function validateName(name) {
  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.length > 100) {
    return 'Name must be less than 100 characters';
  }
  return null;
}

function sanitizeInput(input) {
  return validator.escape(input.trim());
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

function getUser(req) {
  const token = req.headers['auth-token'] || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const email = tokens[token];
  if (!email) return null;
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  return { email, data: user };
}

// Validation middleware
const validateSignup = [
  body('username').custom((_, { req }) => {
    const error = validateName(req.body.username);
    if (error) throw new Error(error);
    return true;
  }),
  body('email').custom((_, { req }) => {
    const error = validateEmail(req.body.email);
    if (error) throw new Error(error);
    return true;
  }),
  body('password').custom((_, { req }) => {
    const error = validatePassword(req.body.password);
    if (error) throw new Error(error);
    return true;
  }),
];

const validateLogin = [
  body('email').custom((_, { req }) => {
    const error = validateEmail(req.body.email);
    if (error) throw new Error(error);
    return true;
  }),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateAddress = [
  body('label').custom((_, { req }) => {
    const error = validateName(req.body.label);
    if (error) throw new Error(error);
    return true;
  }),
  body('recipient').custom((_, { req }) => {
    const error = validateName(req.body.recipient);
    if (error) throw new Error(error);
    return true;
  }),
  body('phone').custom((_, { req }) => {
    if (!req.body.phone) return true;
    if (!validator.isMobilePhone(req.body.phone, 'any')) {
      return 'Invalid phone number';
    }
    return true;
  }),
  body('street').notEmpty().withMessage('Street address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('zipCode').custom((_, { req }) => {
    if (!req.body.zipCode) return true;
    if (!validator.isPostalCode(req.body.zipCode, 'any')) {
      return 'Invalid postal code';
    }
    return true;
  }),
];

const validateOrder = [
  body('items').isArray().notEmpty(),
  body('items.*.productId').isInt({ min: 1 }),
  body('items.*.quantity').isInt({ min: 1, max: 10 }),
  body('addressId').notEmpty().isString(),
  body('paymentMethod').isIn(['credit_card', 'pix', 'boleto']),
];

const validateCoupon = [
  body('code').custom((_, { req }) => {
    if (!req.body.code || req.body.code.trim().length < 3) {
      return 'Coupon code must be at least 3 characters';
    }
    return true;
  }),
];

const validateShipping = [
  body('zipCode').custom((_, { req }) => {
    if (!req.body.zipCode) {
      return 'Zip code is required';
    }
    if (!validator.isPostalCode(req.body.zipCode, 'any')) {
      return 'Invalid postal code';
    }
    return true;
  }),
];

// Custom error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => err.msg),
    });
  }
  next();
};

/* ========== AUTH ========== */
app.post('/signup', validateSignup, handleValidationErrors, (req, res) => {
  const { username, email, password } = req.body;

  // Sanitize inputs
  const sanitizedUsername = sanitizeInput(username);
  const sanitizedEmail = sanitizeInput(email.toLowerCase());

  const emailError = validateEmail(sanitizedEmail);
  if (emailError) {
    return res.json({ success: false, errors: [emailError] });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.json({ success: false, errors: [passwordError] });
  }

  const existing = users.find((u) => u.email === sanitizedEmail);
  if (existing) {
    return res.json({ success: false, errors: ['Email already registered'] });
  }

  const hashedPassword = hashPassword(password);
  const newUser = {
    id: generateId('USER'),
    username: sanitizedUsername,
    email: sanitizedEmail,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  const token = generateSecureToken();
  tokens[token] = sanitizedEmail;
  carts[sanitizedEmail] = {};
  addresses[sanitizedEmail] = [];
  orders[sanitizedEmail] = [];

  res.json({
    success: true,
    token,
    user: { name: sanitizedUsername, email: sanitizedEmail },
  });
});

app.post('/login', validateLogin, handleValidationErrors, (req, res) => {
  const { email, password } = req.body;
  const sanitizedEmail = sanitizeInput(email.toLowerCase());

  const user = users.find((u) => u.email === sanitizedEmail);
  if (!user) {
    return res.json({ success: false, errors: ['Invalid credentials'] });
  }

  const hashedInputPassword = hashPassword(password);
  if (hashedInputPassword !== user.password) {
    return res.json({ success: false, errors: ['Invalid credentials'] });
  }

  const token = generateSecureToken();
  tokens[token] = sanitizedEmail;
  if (!carts[sanitizedEmail]) carts[sanitizedEmail] = {};
  if (!addresses[sanitizedEmail]) addresses[sanitizedEmail] = [];
  if (!orders[sanitizedEmail]) orders[sanitizedEmail] = [];

  res.json({
    success: true,
    token,
    user: { name: user.username, email: user.email },
  });
});

/* ========== CART ========== */
const requireAuthCart = (req, res, next) => {
  const user = getUser(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
};

app.post('/getcart', requireAuthCart, (req, res) => {
  const { email } = req.user;
  if (!carts[email]) carts[email] = {};
  res.json(carts[email]);
});

app.post('/addtocart', requireAuthCart, (req, res) => {
  const { email } = req.user;
  const { itemId } = req.body;
  if (!itemId) {
    return res.status(400).json({ error: 'Item ID is required' });
  }
  if (!carts[email]) carts[email] = {};
  carts[email][itemId] = (carts[email][itemId] || 0) + 1;
  res.json({ success: true });
});

app.post('/removefromcart', requireAuthCart, (req, res) => {
  const { email } = req.user;
  const { itemId } = req.body;
  if (!itemId || !carts[email] || carts[email][itemId] <= 0) {
    return res.json({ success: false, error: 'Item not found in cart' });
  }
  if (carts[email][itemId] > 0) {
    carts[email][itemId]--;
    if (carts[email][itemId] === 0) {
      delete carts[email][itemId];
    }
  }
  res.json({ success: true });
});

/* ========== ADDRESSES ========== */
app.get('/addresses', requireAuthCart, (req, res) => {
  const { email } = req.user;
  if (!addresses[email]) addresses[email] = [];
  res.json(addresses[email]);
});

app.post('/addresses', requireAuthCart, validateAddress, handleValidationErrors, (req, res) => {
  const { email } = req.user;
  if (!addresses[email]) addresses[email] = [];

  const addr = {
    ...req.body,
    id: generateId('ADDR'),
    createdAt: new Date().toISOString(),
  };

  if (addr.isDefault) {
    addresses[email].forEach((a) => (a.isDefault = false));
  }
  if (addresses[email].length === 0) addr.isDefault = true;
  addresses[email].push(addr);
  res.json(addr);
});

app.put('/addresses/:id', requireAuthCart, validateAddress, handleValidationErrors, (req, res) => {
  const { email } = req.user;
  const { id } = req.params;
  const updates = req.body;

  const list = addresses[email] || [];
  const idx = list.findIndex((a) => a.id === id);
  if (idx < 0) {
    return res.status(404).json({ error: 'Address not found' });
  }

  if (updates.isDefault && list[idx].isDefault !== true) {
    list.forEach((a) => (a.isDefault = false));
  }

  list[idx] = { ...list[idx], ...updates, id: id };
  addresses[email][idx] = list[idx];

  res.json(list[idx]);
});

app.delete('/addresses/:id', requireAuthCart, (req, res) => {
  const { email } = req.user;
  const { id } = req.params;
  const list = addresses[email] || [];
  addresses[email] = list.filter((a) => a.id !== id);
  res.json({ success: true });
});

/* ========== ORDERS ========== */
app.get('/orders', requireAuthCart, (req, res) => {
  const { email } = req.user;
  if (!orders[email]) orders[email] = [];
  const sorted = [...orders[email]].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(sorted);
});

app.get('/orders/:id', requireAuthCart, (req, res) => {
  const { email } = req.user;
  const { id } = req.params;
  const found = (orders[email] || []).find((o) => o.id === id);
  if (!found) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(found);
});

app.post('/orders', requireAuthCart, validateOrder, handleValidationErrors, (req, res) => {
  const { email } = req.user;
  const { items, subtotal, shipping, discount, total, addressId, paymentMethod } = req.body;

  const addr = (addresses[email] || []).find((a) => a.id === addressId);
  if (!addr) {
    return res.status(400).json({ error: 'Address not found' });
  }

  if (addressId !== addr.id) {
    addr.isDefault = false;
    addresses[email].find(a => a.id === addressId)!.isDefault = true;
  }

  const order = {
    id: generateId('ORD'),
    userId: email,
    items,
    subtotal,
    shipping,
    discount,
    total,
    status: 'confirmed',
    address: addr,
    paymentMethod: paymentMethod || 'credit_card',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!orders[email]) orders[email] = [];
  orders[email].push(order);

  carts[email] = {};

  res.json(order);
});

/* ========== COUPONS ========== */
app.post('/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;

  if (!code) {
    return res.json({ valid: false, message: 'Coupon code is required' });
  }

  const upperCode = code.toUpperCase().trim();
  const coupon = {
    BEMVINDO10: { type: 'percentage', value: 10, minValue: 100 },
    FRETE25: { type: 'free_shipping', value: 0, minValue: 200 },
    BLAZE50: { type: 'fixed', value: 50, minValue: 300 },
    [upperCode]: null,
  };

  const selectedCoupon = coupon[upperCode];
  if (!selectedCoupon) {
    return res.json({ valid: false, message: 'Coupon not found' });
  }

  if (subtotal < selectedCoupon.minValue) {
    return res.json({
      valid: false,
      message: `Minimum order value R$ ${selectedCoupon.minValue.toFixed(2)}`,
    });
  }

  let discount = 0;
  if (selectedCoupon.type === 'percentage') {
    discount = subtotal * (selectedCoupon.value / 100);
  } else if (selectedCoupon.type === 'fixed') {
    discount = selectedCoupon.value;
 }

  res.json({
    valid: true,
    coupon: { code: upperCode, type: selectedCoupon.type, value: selectedCoupon.value, minValue: selectedCoupon.minValue },
    discount: Math.round(discount * 100) / 100,
  });
});

/* ========== SHIPPING ========== */
const shippingTable = {
  '01000-000': 15.90,
  '20000-000': 25.50,
  '30000-000': 19.90,
  '40000-000': 12.00,
  '50000-000': 29.90,
  '60000-000': 22.00,
  '70000-000': 35.00,
  '80000-000': 18.50,
  '90000-000': 45.00,
};

app.post('/shipping/calculate', validateShipping, handleValidationErrors, (req, res) => {
  const { zipCode } = req.body;
  const normalizedZip = zipCode?.replace(/\D/g, '');
  const prefix = normalizedZip?.slice(0, 5);
  let cost = 19.90;

  for (const [cep, price] of Object.entries(shippingTable)) {
    if (cep.startsWith(prefix?.slice(0, 3) || '')) {
      cost = price;
      break;
    }
  }

  res.json({ cost, days: Math.floor(Math.random() * 5) + 3 });
});

/* ========== USER PROFILE ========== */
app.get('/me', requireAuthCart, (req, res) => {
  const { email } = req.user;
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ name: user.username, email: user.email });
});

/* ========== JSON-SERVER ROUTES (backward compatibility) ========== */
// Original mock server endpoints for backward compatibility
app.use('/', require('json-server').router('db.json'));

app.listen(PORT, () => {
  console.log(`Secure Mock Server is running on http://localhost:${PORT}`);
  console.log('Security features enabled:')
  console.log('  - Helmet CSP (Content Security Policy)')
  console.log('  - Rate limiting (100 requests/15min)')
  console.log('  - Input validation and sanitization')
  console.log('  - Password hashing (PBKDF2)')
  console.log('  - Secure token generation (crypto.randomBytes)')
  console.log('  - Email validation and sanitization')
});