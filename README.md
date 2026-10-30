# Shivi Industries - Solar Energy Website

Beginner-friendly full-stack project: HTML/CSS/JS frontend + Node.js/Express backend.

## Folder Structure
```
shivi indurstries3/
├── package.json
├── server.js
├── config/config.js          (⭐ WhatsApp number & settings - edit here)
├── data/inquiries.json       (auto-created, private customer inquiries)
├── public/                   (frontend)
│   ├── index.html, about.html
│   ├── css/style.css
│   └── js/main.js, config.js
└── README.md
```

## Install Dependencies (Windows)
Open PowerShell in project folder:
```
cd "c:\Users\Lenovo\Desktop\shivi indurstries3"
npm install
```

## Run Locally
```
npm start
```
Then open: http://localhost:3000
- Home: http://localhost:3000/
- About: http://localhost:3000/about

## Edit WhatsApp Number
Open `config/config.js` and change:
```
whatsappNumber: "919876543210"
```
Restart server after change.

## Contact Form
Submissions are validated on backend and stored in `data/inquiries.json` (private, gitignored).
No public API exposes inquiries. Optional private admin route:
```
GET /api/admin/inquiries  with header  x-admin-token: <your token>
```

## Test
1. Open site, check both pages and mobile view (DevTools).
2. Submit contact form with valid data -> success message + new entry in data/inquiries.json.
3. Submit invalid data -> error messages shown.
4. Click WhatsApp button -> opens wa.me chat.
5. API smoke test (PowerShell):
```
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/contact -ContentType "application/json" -Body '{"name":"Test User","email":"test@test.com","phone":"9876543210","message":"Hello solar"}'
```

## Deploy (guide only - not published yet)
Option A (single app): Render / Railway / Cyclic - deploy Node app, static files served by Express.
- Build command: npm install
- Start command: npm start
- Set env vars: PORT, ADMIN_TOKEN
Option B (split): Frontend on Netlify/Vercel, Backend on Render. Update fetch URLs to backend URL.

## Notes
- No fake experience/customer counts/awards are claimed.
- Sample products/services are editable.
- Customer inquiries kept private.
