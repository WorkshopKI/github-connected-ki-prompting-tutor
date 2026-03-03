

## Plan: Improve error message in `saveUserKey`

### What's already done
- Both edge functions (`llm-proxy` and `save-user-key`) already use `getUser()` — no changes needed there.

### Remaining change
**`src/services/llmService.ts` line 104**: The `saveUserKey` error handler currently falls back to `"Verbindungsfehler"`. It should try to extract the actual error message from the response body first, since `supabase.functions.invoke` may include the server error in the response.

Change:
```typescript
// Before
const msg = error instanceof Error ? error.message : "Verbindungsfehler";

// After  
const msg = (error as any)?.message || (error instanceof Error ? error.message : "Verbindungsfehler");
```

Actually, `supabase.functions.invoke` returns `{ data, error }` where `error` is a `FunctionsHttpError` / `FunctionsRelayError` / `FunctionsFetchError`. The `.message` property already contains the actual error. The current code already handles `error instanceof Error` which should work. However, if the edge function returns an error in the response body (non-2xx), the SDK puts the error details in `error.message`. The fallback string `"Verbindungsfehler"` only triggers if `error` is not an Error instance, which is unlikely.

A more robust approach: also try to parse the response context from the error object to surface the server's actual error text.

### Single file change
- **`src/services/llmService.ts`**: Update the `saveUserKey` catch block to better surface the real error message from the edge function response.

