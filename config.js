// ============================================================
//  CONFIGURATION FILE - Easy to edit
//  Yahan apna WhatsApp number aur settings change karo.
//  Format: country code + number, bina + aur spaces ke.
//  Example India: "919876543210"
// ============================================================
module.exports = {
  // ⭐ YAHAN APNA REAL WHATSAPP NUMBER DALO (placeholder hai abhi)
  whatsappNumber: "+919690904045",
  mailId: "hksolartechsolutions@gmail.com",

  // Business details (editable)
  businessName: "Shivi Industries",
  tagline: "Clean Solar Energy for a Brighter Tomorrow",

  // Server settings
  port: process.env.PORT || 3000,

  // Private admin token to view inquiries (optional learning feature).
  // Set via environment variable ADMIN_TOKEN in production.
  adminToken: process.env.ADMIN_TOKEN || "change-me-in-production",

  // Contact form limits
  maxMessageLength: 1000,
  minMessageLength: 10
};
