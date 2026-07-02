# Supabase review setup

1. Create a free project at supabase.com.
2. In SQL Editor, run `supabase.sql`.
3. Copy `.env.example` to `.env.local`.
4. Add Project URL and anon/public key from Project Settings > API.
5. Restart `npm run dev`.
6. The SQL also creates the public `review-photos` Storage bucket (all image MIME types, maximum 5 MB) and upload/read policies.
7. In Table Editor > reviews, set `approved` to `true` to publish. Uploaded photos remain public, so remove rejected photos manually in Storage when appropriate.

For Vercel, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Environment Variables, then redeploy. Never expose the `service_role` key.
