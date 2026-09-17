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

This is a Vercel Node app, not the old static HTML site.

If you are replacing the previous repo, keep the hidden `.git` folder and copy these files over the old ones. A leftover `index.html` / `css/` from the old site will make Vercel show unstyled text — the build now deletes those automatically.

```
npm install
npm run build
```

On Vercel: build command is `npm run build`. Add `DATABASE_URL` (Neon), Cloudinary keys, and `FRONTEND_URL=https://www.divinebirthmidwiferycenter.com`.
