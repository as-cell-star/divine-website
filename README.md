# Divine Birth Midwifery Centre

Public website, online booking, and staff desk for Divine Birth Midwifery Centre, Kahawa Wendani, Nairobi.

## Booking pipeline

When a family submits a booking or inquiry:

1. The row is saved in Postgres (staff see it immediately under `/admin`).
2. A booking card is uploaded to Cloudinary in `divine-birth/bookings`, with the filled fields stored as Cloudinary **context** (the Smartech pattern).
3. Cloudinary can POST to `/api/webhooks/cloudinary` when the upload completes.
4. The filled request is emailed to:
   - `info@divinebirthmidwifery.org`
   - `divinebirthmidwiferycenter@gmail.com`

Email uses SMTP or Resend when those keys are set. Otherwise it uses FormSubmit so the midwives still receive the request without extra setup. The first FormSubmit delivery asks the clinic to confirm the inbox once.

## Environment (set on the host, never commit secrets)

```
DATABASE_URL

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLOUDINARY_UPLOAD_PRESET          # optional unsigned preset
CLOUDINARY_BOOKINGS_FOLDER=divine-birth/bookings

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
NOTIFY_EMAIL=info@divinebirthmidwifery.org
RESEND_API_KEY=                    # optional instead of SMTP
MAIL_FROM=
FRONTEND_URL=
```

Staff login is at `/admin`. Auth is email + password via the built-in gate.

## Local / deploy

```
npm install
npm run dev
```

The site serves on port 8080. `npm run build` also runs database migrations.
