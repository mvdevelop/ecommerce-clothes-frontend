const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({ noCors: false });

server.use(middlewares);
server.use(jsonServer.bodyParser);

/* ---------- In-memory stores ---------- */
let users = [{ email: "test@test.com", password: "123456", username: "Test User" }];
const carts = {};
const tokens = {};
const addresses = {};
const orders = {};
const coupons = {
  BEMVINDO10: { type: "percentage", value: 10, minValue: 100 },
  FRETE25: { type: "free_shipping", value: 0, minValue: 200 },
  BLAZE50: { type: "fixed", value: 50, minValue: 300 },
};

const shippingTable = {
  "01000-000": 15.90,
  "20000-000": 25.50,
  "30000-000": 19.90,
  "40000-000": 12.00,
  "50000-000": 29.90,
  "60000-000": 22.00,
  "70000-000": 35.00,
  "80000-000": 18.50,
  "90000-000": 45.00,
};

/* ---------- Helpers ---------- */
const getUser = (req) => {
  const token = req.headers["auth-token"];
  const email = tokens[token];
  return email ? { email, data: users.find((u) => u.email === email) } : null;
};

const requireAuth = (req, res) => {
  const user = getUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return user;
};

const generateId = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

/* ========== AUTH ========== */
server.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, errors: "Email and password required" });
  }
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.json({ success: false, errors: "Email already registered" });
  }
  const newUser = { username: username || email.split("@")[0], email, password };
  users.push(newUser);
  const token = "mock-token-" + Date.now();
  tokens[token] = email;
  carts[email] = {};
  addresses[email] = [];
  orders[email] = [];
  res.json({ success: true, token, user: { name: newUser.username, email } });
});

server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.json({ success: false, errors: "Invalid credentials" });
  }
  const token = "mock-token-" + Date.now();
  tokens[token] = email;
  if (!carts[email]) carts[email] = {};
  if (!addresses[email]) addresses[email] = [];
  if (!orders[email]) orders[email] = [];
  res.json({ success: true, token, user: { name: user.username, email } });
});

/* ========== CART ========== */
server.post("/getcart", (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  if (!carts[user.email]) carts[user.email] = {};
  res.json(carts[user.email]);
});

server.post("/addtocart", (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const { itemId } = req.body;
  if (!carts[user.email]) carts[user.email] = {};
  carts[user.email][itemId] = (carts[user.email][itemId] || 0) + 1;
  res.json({ success: true });
});

server.post("/removefromcart", (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const { itemId } = req.body;
  if (carts[user.email] && carts[user.email][itemId] > 0) {
    carts[user.email][itemId]--;
  }
  res.json({ success: true });
});

/* ========== ADDRESSES ========== */
server.get("/addresses", (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  if (!addresses[user.email]) addresses[user.email] = [];
  res.json(addresses[user.email]);
});

server.post("/addresses", (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const addr = { ...req.body, id: generateId("addr") };
  if (!addresses[user.email]) addresses[user.email] = [];
  if (addr.isDefault) {
    addresses[user.email].forEach((a) => (a.isDefault = false));
  }
  if (addresses[user.email].length === 0) addr.isDefault = true;
  addresses[user.email].push(addr);
  res.json(addr);
});

server.put("/addresses/:id", (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const list = addresses[user.email] || [];
  const idx = list.findIndex((a) => a.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: "Address not found" });
  if (req.body.isDefault) {
    list.forEach((a) => (a.isDefault = false));
  }
  list[idx] = { ...list[idx], ...req.body, id: req.params.id };
  res.json(list[idx]);
});

server.delete("/addresses/:id", (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const list = addresses[user.email] || [];
  addresses[user.email] = list.filter((a) => a.id !== req.params.id);
  res.json({ success: true });
});

/* ========== ORDERS ========== */
server.get("/orders", (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  if (!orders[user.email]) orders[user.email] = [];
  const sorted = [...orders[user.email]].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(sorted);
});

server.get("/orders/:id", (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const found = (orders[user.email] || []).find((o) => o.id === req.params.id);
  if (!found) return res.status(404).json({ error: "Order not found" });
  res.json(found);
});

server.post("/orders", (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const { items, subtotal, shipping, discount, total, addressId, paymentMethod } = req.body;

  // Find address
  const addr = (addresses[user.email] || []).find((a) => a.id === addressId);
  if (!addr) return res.status(400).json({ error: "Address not found" });

  const order = {
    id: generateId("ORD"),
    userId: user.email,
    items,
    subtotal,
    shipping,
    discount,
    total,
    status: "confirmed",
    address: addr,
    paymentMethod: paymentMethod || "credit_card",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!orders[user.email]) orders[user.email] = [];
  orders[user.email].push(order);

  // Clear cart
  carts[user.email] = {};

  res.json(order);
});

/* ========== COUPONS ========== */
server.post("/coupons/validate", (req, res) => {
  const { code, subtotal } = req.body;
  const coupon = coupons[code?.toUpperCase()];
  if (!coupon) {
    return res.json({ valid: false, message: "Coupon not found" });
  }
  if (subtotal < coupon.minValue) {
    return res.json({
      valid: false,
      message: `Minimum order value R$ ${coupon.minValue.toFixed(2)}`,
    });
  }
  let discount = 0;
  if (coupon.type === "percentage") {
    discount = subtotal * (coupon.value / 100);
  } else if (coupon.type === "fixed") {
    discount = coupon.value;
  }
  res.json({
    valid: true,
    coupon: { code: code.toUpperCase(), type: coupon.type, value: coupon.value, minValue: coupon.minValue },
    discount: Math.round(discount * 100) / 100,
  });
});

/* ========== SHIPPING ========== */
server.post("/shipping/calculate", (req, res) => {
  const { zipCode } = req.body;
  const normalizedZip = zipCode?.replace(/\D/g, "");
  // Match first 5 digits
  const prefix = normalizedZip?.slice(0, 5);
  let cost = 19.90;
  for (const [cep, price] of Object.entries(shippingTable)) {
    if (cep.startsWith(prefix?.slice(0, 3) || "")) {
      cost = price;
      break;
    }
  }
  res.json({ cost, days: Math.floor(Math.random() * 5) + 3 });
});

/* ========== USER PROFILE ========== */
server.get("/me", (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  res.json({ name: user.data?.username || "User", email: user.email });
});

/* ========== JSON-SERVER ROUTES ========== */
server.use(router);

server.listen(4000, () => {
  console.log("Mock Server is running on http://localhost:4000");
});
