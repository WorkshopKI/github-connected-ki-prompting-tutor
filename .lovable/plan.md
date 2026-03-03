

## Problem

The `save-user-key` edge function fails with `"Invalid key length"` when trying to encrypt the OpenRouter API key. This happens at the AES-256-GCM key import step, meaning the `ENCRYPTION_KEY` secret is not exactly 64 hex characters (32 bytes).

## Root Cause

The `ENCRYPTION_KEY` secret stored in your backend is not the correct length for AES-256-GCM encryption. It must be exactly 64 hexadecimal characters (representing 32 bytes).

## Fix

1. **Generate a valid 256-bit hex key** and update the `ENCRYPTION_KEY` secret. A valid key looks like: `a]1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b` (64 hex chars).

2. **Add a validation guard** in the edge function so that if the key is misconfigured, the error message is clear instead of a generic crypto error.

### Changes

**`supabase/functions/save-user-key/index.ts`**: Add a length check after reading `ENCRYPTION_KEY`:
```typescript
const encKey = Deno.env.get("ENCRYPTION_KEY");
if (!encKey || encKey.length !== 64) {
  return jsonRes({ error: "Server encryption key misconfigured (expected 64 hex chars)" }, 500);
}
```

Also add the same guard in **`supabase/functions/llm-proxy/index.ts`** if it uses the same encrypt/decrypt pattern.

**Secret update**: Re-set the `ENCRYPTION_KEY` secret to a valid 64-character hex string.

