// ============================================================
//  Shivi Industries - Express Backend (server.js)
//  Beginner-friendly. Run: npm start  -> http://localhost:3000
// ============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const config = require("./config/config");

const app = express();
const PORT = config.port;

// ---------- Middleware ----------
app.use(express.json());                       // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form bodies

// Serve frontend (HTML/CSS/JS/images) from /public
app.use(express.static(path.join(__dirname, "public")));

// Rate limit contact form (prevent spam): 5 requests / 15 min per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many requests. Please try again later." }
});

// ---------- Helpers ----------
const DATA_FILE = path.join(__dirname, "data", "inquiries.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

function readInquiries() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveInquiry(inquiry) {
  const list = readInquiries();
  list.push(inquiry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
}

// Simple input validators (beginner-friendly)
function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
}
function isPhone(v) {
  // allows digits, +, spaces, dashes; length 7-15 digits
  const digits = String(v).replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
function clean(v) {
  return String(v || "").trim().replace(/<[^>]*>/g, ""); // strip simple tags
}

// ---------- Routes ----------

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// About page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

// Expose only NON-sensitive config to frontend (WhatsApp number etc.)
// NOTE: never expose inquiries here.
app.get("/api/config", (req, res) => {
  res.json({
    whatsappNumber: config.whatsappNumber,
    businessName: config.businessName,
    tagline: config.tagline
  });
});

// Contact form submission
app.post("/api/contact", contactLimiter, (req, res) => {
  const name = clean(req.body.name);
  const email = clean(req.body.email);
  const phone = clean(req.body.phone);
  const message = clean(req.body.message);

  const errors = [];
  if (!name || name.length < 2) errors.push("Name must be at least 2 characters.");
  if (!isEmail(email)) errors.push("Please enter a valid email address.");
  if (!isPhone(phone)) errors.push("Please enter a valid phone number.");
  if (!message || message.length < config.minMessageLength)
    errors.push(`Message must be at least ${config.minMessageLength} characters.`);
  if (message.length > config.maxMessageLength)
    errors.push(`Message must be under ${config.maxMessageLength} characters.`);

  if (errors.length) {
    return res.status(400).json({ success: false, errors });
  }

  const inquiry = {
    id: Date.now(),
    name,
    email,
    phone,
    message,
    createdAt: new Date().toISOString(),
    ip: req.ip
  };

  try {
    saveInquiry(inquiry);
    return res.json({ success: true, message: "Thank you! We will contact you soon." });
  } catch (err) {
    console.error("Save error:", err);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// PRIVATE admin route (optional, for learning only).
// Protected by token in header: x-admin-token
// Returns inquiries ONLY if token matches. Not linked anywhere public.
app.get("/api/admin/inquiries", (req, res) => {
  const token = req.headers["x-admin-token"];
  if (!token || token !== config.adminToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  return res.json({ success: true, data: readInquiries() });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`\n✅ Shivi Industries server running at http://localhost:${PORT}`);
  console.log(`   Home:   http://localhost:${PORT}/`);
  console.log(`   About:  http://localhost:${PORT}/about`);
  console.log(`   Config: http://localhost:${PORT}/api/config\n`);
});
