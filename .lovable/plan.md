

## Plan: Add Lovable Cloud with AI Feedback, Progress Tracking & API Integration

### Step 1: Enable Lovable Cloud
Set up Lovable Cloud to get database, auth, and edge functions.

### Step 2: Database Schema
Create tables:
- **profiles** — user id, display name, created_at
- **exercise_progress** — user id, exercise id, user prompt, score (0-3), completed_at

### Step 3: Authentication
Add a simple login/signup flow (email-based) so progress can be tied to users. Add auth state management and a login button in the Navigation.

### Step 4: AI-Powered Prompt Evaluation Edge Function
Create `supabase/functions/evaluate-prompt/index.ts` that:
- Receives the user's prompt + the exercise context (bad prompt, good example, hints)
- Calls Lovable AI (Gemini) with a system prompt instructing it to evaluate the user's prompt on context, specificity, and constraints
- Returns structured feedback using tool calling (score per criterion + textual feedback)
- Replaces the current keyword-based heuristic in ExerciseCard

### Step 5: Save Progress
After evaluation, store the result in `exercise_progress`. Show completed exercises with scores on the UI (checkmarks on exercise cards, optional progress summary).

### Step 6: Frontend Integration
- Update `ExerciseCard` to call the edge function instead of local `evaluatePrompt()`
- Show AI-generated feedback text alongside the criteria checkmarks
- Add loading state during AI evaluation
- Display saved progress when user is logged in

### Technical Details

**Edge function config** (`supabase/config.toml`):
```toml
[functions.evaluate-prompt]
verify_jwt = false
```

**AI call** uses `google/gemini-3-flash-preview` with tool calling to return structured JSON:
```json
{
  "hasContext": true,
  "isSpecific": false,
  "hasConstraints": true,
  "feedback": "Your prompt provides good context about dietary needs, but could be more specific about..."
}
```

**Files to create:**
- `supabase/functions/evaluate-prompt/index.ts`
- `src/components/AuthDialog.tsx` (login/signup modal)
- `src/hooks/useAuth.ts`
- `src/hooks/useExerciseProgress.ts`
- Database migration for profiles + exercise_progress tables

**Files to modify:**
- `src/components/ExerciseCard.tsx` — replace local eval with edge function call
- `src/components/Navigation.tsx` — add login/profile button
- `src/components/PracticeArea.tsx` — show progress indicators
- `supabase/config.toml` — add function config

