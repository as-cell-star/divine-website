# Divine Birth Midwifery Centre — Backend API

Node.js / Express API server for form submissions.

---

## Endpoints

| Method | Path              | Description                        |
|--------|-------------------|------------------------------------|
| POST   | /api/appointment  | Book an appointment                |
| POST   | /api/inquiry      | Send a general inquiry             |
| GET    | /api/health       | Health / uptime check              |

### POST /api/appointment

```json
{
  "firstname": "Grace",
  "lastname": "Wanjiru",
  "phone": "0712345678",
  "service": "Antenatal Care",
  "date": "Monday, 15 July 2025",
  "time": "10:00",
  "notes": "Second trimester, 22 weeks"
}
```

### POST /api/inquiry

```json
{
  "firstname": "Grace",
  "lastname": "Wanjiru",
  "phone": "0712345678",
  "email": "grace@example.com",
  "service": "Postnatal Clinic",
  "message": "I delivered 2 weeks ago and would like a check-up."
}
```

Both endpoints trigger:
1. Notification email → clinic inbox
2. SMS → clinic phone (Africa's Talking)
3. Confirmation email → patient (inquiry only, if email provided)

---

## Quick Start

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your real SMTP and Africa's Talking credentials

# 3. Start
npm start        # production
npm run dev      # development with auto-reload (nodemon)
```

---

## Environment Variables

See `.env.example` for full documentation. Key variables:

| Variable       | Description                                           |
|---------------|-------------------------------------------------------|
| PORT           | Port to listen on (default: 3001)                    |
| FRONTEND_URL   | Your frontend domain for CORS                        |
| SMTP_HOST      | SMTP server (e.g. smtp.gmail.com)                    |
| SMTP_USER      | SMTP username / Gmail address                        |
| SMTP_PASS      | SMTP password / Gmail App Password                   |
| NOTIFY_EMAIL   | Email that receives clinic notifications             |
| AT_API_KEY     | Africa's Talking API key (free sandbox available)    |
| AT_USERNAME    | Africa's Talking username                            |
| CLINIC_PHONE   | Clinic phone for SMS notifications (+254...)         |

---

## Getting Africa's Talking credentials (Free sandbox)

1. Sign up at https://africastalking.com
2. In the dashboard select "Sandbox" — free to use for testing
3. Copy your **API Key** and **Username** from the sandbox settings
4. Put them in `.env` as `AT_API_KEY` and `AT_USERNAME`
5. For **production** create a live account and fund the SMS balance

---

## Getting Gmail App Password (SMTP)

1. Enable 2-Step Verification on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Create a new App Password → select "Mail"
4. Paste the generated 16-character password as `SMTP_PASS`

---

## Deploy to Render (free tier)

1. Push the `backend/` folder to a GitHub repo
2. Go to https://render.com → New → Web Service
3. Connect the repo, set:
   - Build command: `npm install`
   - Start command: `npm start`
4. Add all environment variables in Render's "Environment" tab
5. Your API URL: `https://your-service.onrender.com`

Then in `js/calendar.js` set:
```js
var BACKEND_URL = 'https://your-service.onrender.com';
```

And in `js/main.js`, the inquiry form already hits `BACKEND_URL + '/api/inquiry'`.

---

## Deploy to Railway (free tier)

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

Set env variables via Railway dashboard.
