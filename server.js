const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({ noCors: false });

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Store for auth tokens and carts (in-memory mock)
const users = [{ email: "test@test.com", password: "123456", username: "test" }];
const carts = {};
const tokens = {};

// Auth: Signup
server.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.json({ success: false, errors: "Email already registered" });
  }
  const newUser = { username, email, password };
  users.push(newUser);
  const token = "mock-token-" + Date.now();
  tokens[token] = email;
  carts[email] = {};
  res.json({ success: true, token });
});

// Auth: Login
server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.json({ success: false, errors: "Invalid credentials" });
  }
  const token = "mock-token-" + Date.now();
  tokens[token] = email;
  if (!carts[email]) carts[email] = {};
  res.json({ success: true, token });
});

// Cart: Get cart items
server.post("/getcart", (req, res) => {
  const token = req.headers["auth-token"];
  const email = tokens[token];
  if (!email) return res.json({});
  if (!carts[email]) carts[email] = {};
  res.json(carts[email]);
});

// Cart: Add item
server.post("/addtocart", (req, res) => {
  const token = req.headers["auth-token"];
  const email = tokens[token];
  if (!email) return res.status(401).json({ error: "Unauthorized" });
  const { itemId } = req.body;
  if (!carts[email]) carts[email] = {};
  carts[email][itemId] = (carts[email][itemId] || 0) + 1;
  res.json({ success: true });
});

// Cart: Remove item
server.post("/removefromcart", (req, res) => {
  const token = req.headers["auth-token"];
  const email = tokens[token];
  if (!email) return res.status(401).json({ error: "Unauthorized" });
  const { itemId } = req.body;
  if (carts[email] && carts[email][itemId] > 0) {
    carts[email][itemId]--;
  }
  res.json({ success: true });
});

// Use json-server default router for GET endpoints
server.use(router);

server.listen(4000, () => {
  console.log("Mock Server is running on http://localhost:4000");
});
