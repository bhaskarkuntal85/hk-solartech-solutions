// ============================================================
//  main.js - Shivi Industries frontend logic
//  - WhatsApp button (number from backend config)
//  - Contact form submit + validation messages
//  - Mobile menu, animations, year
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile hamburger menu
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }

  // Scroll reveal animations
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => io.observe(el));

  // Product "Enquire" buttons -> prefill message
  document.querySelectorAll("[data-product]").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = btn.getAttribute("data-product");
      const msgField = document.getElementById("message");
      if (msgField) {
        msgField.value = "I am interested in: " + product + ". Please share details and price.";
        msgField.focus();
        const contact = document.getElementById("contact");
        if (contact) contact.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Fetch config from backend (WhatsApp number etc.)
  let whatsappNumber = "91XXXXXXXXXX";
  fetch("/api/config")
    .then(r => r.json())
    .then(cfg => {
      if (cfg && cfg.whatsappNumber) whatsappNumber = cfg.whatsappNumber;
      setupWhatsApp(whatsappNumber);
    })
    .catch(() => setupWhatsApp(whatsappNumber));
});

function setupWhatsApp(number) {
  const clean = String(number).replace(/\D/g, "");
  const url = "https://wa.me/" + clean + "?text=" + encodeURIComponent("Hello Shivi Industries, I would like to know more about your solar solutions.");
  ["waFloat", "waContactBtn"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = url;
  });
}

// Contact form handling
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("formStatus");
    const btn = document.getElementById("submitBtn");
    status.className = "form-status";
    status.textContent = "";

    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      message: document.getElementById("message").value.trim()
    };

    // Basic client-side check (backend validates too)
    if (!data.name || !data.email || !data.phone || !data.message) {
      status.className = "form-status error";
      status.textContent = "Please fill all required fields.";
      return;
    }

    btn.disabled = true;
    btn.textContent = "Sending...";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        status.className = "form-status success";
        status.textContent = json.message || "Thank you! We will contact you soon.";
        form.reset();
      } else {
        status.className = "form-status error";
        const errs = json.errors ? json.errors.join(" ") : (json.message || "Something went wrong.");
        status.textContent = errs;
      }
    } catch (err) {
      status.className = "form-status error";
      status.textContent = "Network error. Please try again.";
    } finally {
      btn.disabled = false;
      btn.textContent = "Send Inquiry";
    }
  });
}
