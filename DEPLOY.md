# Divine Birth — Deployment Guide

**Read this first.** Right now the booking form does **not** send anywhere.
That is deliberate — it is safer than pretending to work. Until you do
Step 1, the form tells mothers to phone the clinic instead.

---

## Step 1 — Switch the booking form on (5 minutes) ⚠️ REQUIRED

Without this, **no booking or inquiry will ever reach you.**

1. Go to **https://web3forms.com**
2. Type the clinic email: `info@divinebirthmidwifery.org`
3. Click **Create Access Key**. They email you a key.
4. Open **`js/config.js`** and paste it in:

   ```js
   WEB3FORMS_KEY: 'paste-the-key-here',
   ```

5. Save. Done — bookings now arrive in the clinic inbox.

Free tier: 250 submissions/month. That is plenty for a clinic this size.

### How to check it worked
Open the site, press **F12** (browser console).
- If you see a purple warning "forms are NOT configured" → the key is missing.
- If you see nothing → it is working. Now submit a test booking yourself
  and confirm the email arrives.

**Do not launch without doing this test.** Submit one real booking and
watch it land in the inbox.

---

## Step 2 — Put the site online (10 minutes)

### Easiest: Netlify (free)
1. Go to **https://app.netlify.com/drop**
2. Drag this whole folder onto the page.
3. It gives you a live URL immediately.
4. To use your own domain: **Site settings → Domain management → Add
   custom domain** → `divinebirthmidwifery.org`, then point your
   domain's DNS to Netlify (they show you exactly how).

`netlify.toml` is already included — security headers and caching are
configured for you.

### Alternative: any web host
This is a plain static site. Upload the folder by FTP to any host
(cPanel, Hostinger, Truehost). No build step, no Node needed.

---

## Step 3 — SMS notifications (OPTIONAL)

Only do this if you want an **SMS to the clinic phone** the moment
someone books. Step 1 already gets you email; this adds SMS.

1. Deploy the `backend/` folder to **Render.com** (free tier):
   - New → Web Service → connect your repo → point at `/backend`
   - `render.yaml` is included, so most settings are pre-filled.
2. Set these environment variables in Render:

   | Variable | What it is |
   |---|---|
   | `FRONTEND_URL` | Your Netlify URL (no trailing slash) |
   | `SMTP_USER` | Clinic Gmail address |
   | `SMTP_PASS` | Gmail **App Password** (not your normal password) |
   | `NOTIFY_EMAIL` | Where bookings should land |
   | `AT_API_KEY` | From africastalking.com (free sandbox to test) |
   | `AT_USERNAME` | From africastalking.com |
   | `CLINIC_PHONE` | `+254794444141` |

3. Render gives you a URL. Put it in **`js/config.js`**:

   ```js
   BACKEND_URL: 'https://divine-birth-api.onrender.com',
   ```

   If `BACKEND_URL` is set, it is used *instead of* Web3Forms.

> **Gmail App Password:** Google Account → Security → 2-Step Verification
> → App Passwords. Your normal Gmail password will **not** work.

> **Note on Render's free tier:** the server sleeps after 15 minutes idle
> and takes ~30s to wake. For a booking form that is usually fine, but if
> a booking feels slow, that is why. Web3Forms (Step 1) has no such delay.

---

## What has been tested

| Thing | Status |
|---|---|
| Booking form submits | ✅ fires and POSTs |
| Inquiry form submits | ✅ fixed (was silently broken) |
| Past dates blocked | ✅ cannot book yesterday |
| Sundays blocked | ✅ |
| Time slots load | ✅ 9 per day |
| Fails safely when unconfigured | ✅ tells mother to phone |
| Backend boots | ✅ `/api/health` returns ok |
| JS console errors | ✅ none |
| Mobile responsive | ✅ |

### Bugs that were fixed
- **Booking form never submitted.** The JS looked for a button class
  `.form-submit` that does not exist in the HTML (`.form-btn`). Every
  booking silently died. Fixed.
- **Inquiry form always rejected you.** It read fields `fname`/`lname`,
  but the real ids are `ifname`/`ilname` — so the name always read as
  empty and it complained "Please enter your name" forever. Fixed.
- **`CFG is not defined`** JavaScript crash. Fixed.
- **Silent failure.** Forms now tell the visitor to call the clinic
  rather than swallowing the request.

---

## Before you go live — checklist

- [ ] `js/config.js` has a real `WEB3FORMS_KEY`
- [ ] You submitted a **test booking** and the email arrived
- [ ] You submitted a **test inquiry** and the email arrived
- [ ] Phone numbers on the site are correct
- [ ] Opened the site on a phone and checked it looks right
- [ ] `sitemap.xml` / `robots.txt` updated if your domain differs
- [ ] Someone at the clinic knows to **check that inbox daily**

That last one matters most. A booking form nobody reads is the same as a
booking form that does not work.
