# Switching on the guest book and the newsletter

Both work in "preview" mode until you connect them:

- **Guest book (message wall):** notes are only saved in each visitor's own browser, so nobody sees anyone else's.
- **Newsletter sign-up (footer):** the form says sign-ups open soon.

Each needs one free account and a couple of settings. Do the guest book first if you're doing both; the last step (adding the settings to GitHub) is shared.

---

## 1. Guest book: Supabase

Supabase is the database that stores the notes. The site talks to it with a public key, and the rules in
`supabase/message_wall.sql` make sure visitors can only read notes, add notes, and edit or remove their own.

1. **Create a project.** Sign up at [supabase.com](https://supabase.com) and click **New project**.
   - Name: `portfolio`
   - Region: one close to you (for example *East US (Ohio)*)
   - Database password: anything strong. You won't need it for the site.

2. **Create the wall's table.** In the project, open **SQL Editor → New query**. Paste the whole of
   `supabase/message_wall.sql` from this repo and click **Run**. You should see *Success. No rows returned*.

3. **Copy the two settings.** Open **Project Settings → API Keys**.
   - **Project URL**, for example `https://abcdefghijkl.supabase.co`. It's also under **Project Settings → Data API**.
   - The **anon public** key, on the **Legacy API keys** tab. It's a long string starting `eyJ…`. Use this one rather than the newer `sb_publishable_…` key: the wall sends it the classic way.

   Both are safe to put in a public website. Never use the **service_role** or **secret** key.

4. **Try it on your computer.** In the project folder, copy the example settings file:

   ```bash
   cp .env.example .env
   ```

   Open `.env` and fill in the two values:

   ```
   PUBLIC_SUPABASE_URL=https://abcdefghijkl.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

   Restart the dev server so it picks them up:

   ```bash
   astro dev stop
   ```

   ```bash
   astro dev --background
   ```

   Open the message wall, write a note, then open the wall in a different browser (or a private window). If the note is there, it's working.

5. **Put it on the live site.** See [step 3](#3-adding-the-settings-to-the-live-site) below.

**Looking after the wall:** in Supabase, open **Table Editor → wall_notes**. To hide a note, untick **approved** on its row, or delete the row. Visitors can't remove anyone else's notes; only you can, from here.

---

## 2. Newsletter: Buttondown

Buttondown is a small newsletter service. It stores your subscribers, sends each new sign-up an email to confirm, adds the unsubscribe links the law requires, and is where you write and send each quarterly issue. It's free up to 100 subscribers.

1. **Create an account** at [buttondown.com](https://buttondown.com). Your **username** becomes part of your newsletter's address (`buttondown.com/yourname`), and it's the one setting the site needs.

2. **Set it up** under **Settings**:
   - Newsletter name, for example *Maya Tomarchio*, plus a one-line description.
   - Under **Subscribing**, keep **double opt-in** on. New sign-ups get a confirmation email, which keeps out fake addresses.

3. **Try it on your computer.** Add your username to `.env`:

   ```
   PUBLIC_BUTTONDOWN_USERNAME=yourname
   ```

   Restart the dev server (the two `astro dev` commands above). Sign up in the footer with your own email, click the link in the confirmation email, and check that you appear under **Subscribers** in Buttondown.

4. **Put it on the live site.** See step 3 below.

**Sending an issue:** in Buttondown, open **Emails → New email**, write it, and send. Each sign-up is tagged with the language of the page it came from (`en`, `es` or `it`). To send a Spanish or Italian version, filter by that tag. A calendar reminder every three months (for example the first week of January, April, July and October) keeps it quarterly.

---

## 3. Adding the settings to the live site

The live site is built on GitHub, so it needs the same settings there. Your `.env` file stays on your computer and is never uploaded.

1. On GitHub, open the **portfolio** repo → **Settings → Secrets and variables → Actions** → the **Variables** tab → **New repository variable**.
2. Add each one you're using, with exactly these names:

   | Name | Value |
   |---|---|
   | `PUBLIC_SUPABASE_URL` | your Supabase project URL |
   | `PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon public key |
   | `PUBLIC_BUTTONDOWN_USERNAME` | your Buttondown username |

3. Rebuild the site: open **Actions → Deploy to GitHub Pages → Run workflow** (or just push any change). When it finishes, try the wall and the sign-up on [mayatomarchio.com](https://mayatomarchio.com).

You can add the Supabase pair and the Buttondown username at different times; each part switches on as soon as its settings are there and the site has rebuilt.
