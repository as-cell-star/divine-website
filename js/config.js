/* ================================================================
   DIVINE BIRTH — SITE CONFIGURATION
   ----------------------------------------------------------------
   This is the ONLY file you need to edit to make the booking and
   inquiry forms work. Set ONE of the two options below.
================================================================ */

window.DIVINE_CONFIG = {

  /* ── OPTION A — Web3Forms (easiest, no server needed) ─────────
     1. Go to https://web3forms.com
     2. Enter the clinic email: info@divinebirthmidwifery.org
     3. They email you an Access Key — paste it below.
     4. Done. Form submissions arrive in that inbox.
     Free tier: 250 submissions/month.                            */

  WEB3FORMS_KEY: '',   /* 90932bcb-75f7-43a9-b016-a3aafb8f5854 */


  /* ── OPTION B — Your own backend (SMS + email) ────────────────
     Only needed if you want automatic SMS to the clinic.
     Deploy the /backend folder, then put its URL here.
     If this is set, it is used INSTEAD of Web3Forms.             */

  BACKEND_URL: '',     /* e.g. 'https://divine-birth-api.onrender.com' */


  /* ── Clinic contact (used in error messages & fallbacks) ───── */

  CLINIC_PHONE:    '+254794444141',
  CLINIC_WHATSAPP: '254794444141',
  CLINIC_EMAIL:    'info@divinebirthmidwifery.org',

};

/* ----------------------------------------------------------------
   Startup check. If nothing is configured, the forms cannot send
   anywhere — so we warn loudly in the console and the forms will
   tell the visitor to phone instead of failing silently.
---------------------------------------------------------------- */
(function () {
  var c = window.DIVINE_CONFIG;
  c.IS_CONFIGURED = !!(c.BACKEND_URL || (c.WEB3FORMS_KEY && c.WEB3FORMS_KEY.indexOf('YOUR_') !== 0));
  if (!c.IS_CONFIGURED) {
    console.warn(
      '%c⚠ DIVINE BIRTH: forms are NOT configured.',
      'background:#3e1f33;color:#fff;padding:4px 8px;border-radius:3px;font-weight:bold',
      '\nBooking and inquiry submissions will NOT be delivered to anyone.' +
      '\nFix: open js/config.js and set WEB3FORMS_KEY (see instructions in that file).'
    );
  }
})();
