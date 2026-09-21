# Divine Birth Midwifery Centre

Public website, online booking, and staff desk for Divine Birth Midwifery Centre, Kahawa Wendani, Nairobi.

## Replace the GitHub repo (Codespaces)

Upload `dbmc.zip` to the repo root, then:

```bash
git pull origin main --no-edit
unzip -o dbmc.zip
rm -f dbmc.zip index.html
rm -rf css js assets backend
git add -A
git commit -m "Divine Birth: Neon-safe Vercel deploy"
git push
```

Then in **Vercel → Storage → Create Database → Neon**, copy the **pooled** URI, add `DATABASE_URL`, add `FRONTEND_URL=https://www.divinebirthmidwiferycenter.com`, and **Redeploy**.

## Booking pipeline

When a family submits a booking or inquiry:

1. The row is saved in Postgres (staff see it immediately under `/admin`).
2. A booking card is uploaded to Cloudinary in `divine-birth/bookings`, with the filled fields stored as Cloudinary **context**.
3. Cloudinary can POST to `/api/webhooks/cloudinary` when the upload completes.
4. The filled request is emailed to `info@divinebirthmidwifery.org` and `divinebirthmidwiferycenter@gmail.com`.

If Postgres is not configured yet, the public site still loads and bookings still email the clinic.

## Environment (Vercel, never commit secrets)

```
DATABASE_URL                          # Neon pooled string — required for /admin persistence
FRONTEND_URL=https://www.divinebirthmidwiferycenter.com
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Staff login is `/admin` (email + password).
