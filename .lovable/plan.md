

## Plan: Full Course Management Platform

This is a large-scale transformation of the app into a course management platform with enrollment, guest auth, LLM proxy, admin panel, and sync. I'll break it into implementation phases.

### Security Note

Your schema puts `is_admin` on `user_profiles`. Per security best practices, admin roles should be in a **separate `user_roles` table** with a `SECURITY DEFINER` function to check roles — this prevents privilege escalation. The plan below uses this pattern instead.

### Phase 1: Database Schema (Migration)

Create all tables in a single migration:

- **courses** — course management with enrollment settings
- **enrollment_whitelist** — email whitelist per course
- **user_profiles** — replaces existing `profiles` table (id = auth.users.id, with `auth_method`, `course_id`)
- **user_roles** — separate table for admin role (security best practice)
- **guest_tokens** — guest login tokens with expiry
- **user_progress** — lesson/quiz/challenge tracking (arrays + JSONB)
- **user_projects** — user ML projects with pipeline config
- **user_api_keys** — encrypted API key storage
- Drop existing `profiles` and `exercise_progress` tables (replaced by new schema)
- Update `handle_new_user` trigger to insert into `user_profiles` + `user_progress`
- RLS policies using `has_role()` security definer function for admin checks

### Phase 2: Edge Functions (5 functions)

1. **check-enrollment** — validates course code, checks capacity, adds to whitelist
2. **guest-login** — creates auth user for guest token, generates session
3. **llm-proxy** — decrypts user API key, proxies to OpenRouter, handles budget exhaustion
4. **save-user-key** — validates and encrypts custom OpenRouter key
5. **provision-key** — (optional) assigns pre-provisioned key to user

All use CORS headers, `verify_jwt = false` in config.toml, and service role key for privileged operations. Will need `ENCRYPTION_KEY` secret for AES-256.

### Phase 3: Auth Context & Provider

- New `src/contexts/AuthContext.tsx` with `signInWithOTP`, `verifyOTP`, `signInWithGuestToken`, `signOut`, `upgradeGuestToEmail`
- Profile auto-loading on auth state change
- Wrap app in `AuthProvider` in `App.tsx`

### Phase 4: Login Page (`/login`)

- Two pill-tabs: "Mit E-Mail anmelden" (OTP flow with course code) and "Mit Gast-Code anmelden"
- OTP input using 6-digit component (reuse `input-otp`)
- Orange design theme (#F97316), German text
- Error messages for invalid course/OTP/guest codes
- Post-login redirect to `/`, guest banner if not upgraded

### Phase 5: Sync Provider

- `src/contexts/SyncContext.tsx` — LocalStorage-first, cloud sync when logged in
- Merge logic using `updated_at` timestamps
- Existing `useProgress`-style hooks internally delegate to SyncContext
- Sync status indicator in sidebar

### Phase 6: Navigation & Sidebar Updates

- User menu at bottom of nav: email/guest display, sign out, admin link
- Guest upgrade prompt
- Sync status icon

### Phase 7: Admin Page (`/admin/teilnehmer`)

- Course selector dropdown
- Invite emails / create guest tokens with copy button
- Participants table with status badges and budget info
- Budget overview card
- Protected route (redirect non-admins)

### Phase 8: LLM Service & Budget Dialog

- `src/services/llmService.ts` — calls `llm-proxy` edge function
- Budget-exhausted modal with accordion for custom key input
- Calls `save-user-key` edge function

### Phase 9: Profile Page (`/profil`)

- Display name editing, course info, progress summary, LLM status
- Guest upgrade flow with OTP verification
- Orange highlight section for guest users

### Files to Create

- `supabase/functions/check-enrollment/index.ts`
- `supabase/functions/guest-login/index.ts`
- `supabase/functions/llm-proxy/index.ts`
- `supabase/functions/save-user-key/index.ts`
- `supabase/functions/provision-key/index.ts`
- `src/contexts/AuthContext.tsx`
- `src/contexts/SyncContext.tsx`
- `src/pages/Login.tsx`
- `src/pages/Profile.tsx`
- `src/pages/AdminParticipants.tsx`
- `src/components/BudgetDialog.tsx`
- `src/components/GuestBanner.tsx`
- `src/components/OTPInput.tsx`
- `src/components/UserMenu.tsx`
- `src/services/llmService.ts`

### Files to Modify

- `src/App.tsx` — add AuthProvider, SyncProvider, new routes
- `src/components/Navigation.tsx` — add user menu
- `supabase/config.toml` — add new edge functions
- `src/hooks/useExerciseProgress.ts` — adapt to new schema
- `src/components/PracticeArea.tsx` — use new auth context
- `src/components/ExerciseCard.tsx` — use new auth context

### Implementation Order

Given the size, I recommend implementing in this order across multiple messages:
1. Database migration (schema + RLS + trigger) + request `ENCRYPTION_KEY` secret
2. Auth context + login page
3. Edge functions (check-enrollment, guest-login)
4. Edge functions (llm-proxy, save-user-key)
5. Sync provider + existing hook refactoring
6. Admin page + profile page + budget dialog

