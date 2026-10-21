# Private inquiry dashboard setup

The portfolio sends inquiry emails through EmailJS and saves a complete copy of each successful inquiry to Supabase. The private dashboard is at `/admin/inquiries`; it is not linked from the public site. Sign-in and server-side admin authorization protect the records, so an undisclosed URL alone is not the security control.

The dashboard shows inquiry totals, searchable/filterable requests, client and project details, and a saved five-step progress checklist. Once every item is checked, the inquiry is marked completed. The dashboard stores the full description, including long briefs that are shortened in the email preview.

## 1. Create the Supabase database

1. Create a Supabase project.
2. Open **SQL Editor** and run [`supabase/project-inquiries.sql`](supabase/project-inquiries.sql).
3. In **Authentication → Users**, create the owner account with an email and password. Disable public sign-ups in the Auth settings; dashboard accounts should be created by the owner only.
4. Copy the user's UUID from the Auth users list, then run this in SQL Editor, replacing the placeholder with that UUID:

   ```sql
   insert into public.portfolio_admins (user_id)
   values ('PASTE_OWNER_AUTH_USER_UUID_HERE');
   ```

Only users in `portfolio_admins` can view or update inquiries through the API. The data tables have RLS enabled and no browser roles granted direct access. The Vercel function checks the signed-in user against the admin table before returning or changing private data.

## 2. Add environment variables

Get the project URL and publishable key from **Project Settings → API Keys**. Create a server-only secret key there as well. Add these values to the Vercel project's **Settings → Environment Variables** for Production (and Preview if you use it):

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_PUBLIC_KEY
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_PUBLIC_KEY
SUPABASE_SECRET_KEY=sb_secret_YOUR_PRIVATE_KEY
```

The secret key is server-only. Never name it with a `VITE_` prefix or put it in browser code. The browser uses only the publishable key to sign in; private database operations run in `api/inquiries.js`. The code also supports the legacy `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` environment variables if your Supabase project has not moved to the newer key format.

For local environment setup, add the same values to `.env.local` (keep the secret key out of Git). Restart Vite after changing environment variables.

## 3. Deploy and open the dashboard

Redeploy the Vercel project after adding the environment variables and SQL schema. Open:

```text
https://YOUR_PORTFOLIO_DOMAIN/admin/inquiries
```

Sign in with the Supabase owner account created above. No public link or sign-up form is provided. Vercel serves the `/api/inquiries` serverless function used by the form and dashboard. The Vite development server alone does not run Vercel functions; use the Vercel local development command to exercise the complete local API flow.

## Inquiry form behavior

After EmailJS accepts an inquiry email, the form posts the complete inquiry to `/api/inquiries`. If the email succeeds but the dashboard save fails, the user sees a clear notice that the inquiry was emailed but not added to the dashboard. The API validates submitted values and limits each source IP to five dashboard submissions per hour using a hashed IP value.

The dashboard checklist is saved in the database and can be changed at any time. The API returns up to the latest 200 inquiries.

## Security notes

- Keep `SUPABASE_SECRET_KEY` (or legacy `SUPABASE_SERVICE_ROLE_KEY`) only in Vercel's server environment and local `.env.local`.
- Do not add a public sign-up route or add more rows to `portfolio_admins` unless another person should access client inquiries.
- The dashboard path is unlisted, but its protection comes from sign-in, admin membership checks, and server-side authorization.
- Supabase RLS is enabled on all dashboard tables; the server function is the only app path allowed to access them.
