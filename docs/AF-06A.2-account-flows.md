# AF-06A.2 – Account Flows

Status: Specification
Implementation: Not started

## Goal
Allow golfers to use guest mode, register, sign in,
sign out and recover account access without losing
existing golf history.

## Required flows

1. Guest mode
- A stable local guest identity.
- Rounds and training remain available locally.
- Guest data is not automatically synced.

2. Registration
- Preserve existing guest data.
- Never overwrite an existing account.
- Require explicit confirmation before importing data.

3. Sign in
- Authenticate the account.
- Detect existing local guest data.
- Never silently merge or discard histories.

4. Sign out
- End the authenticated session.
- Prevent another user from accessing private account data.
- Never delete unsynced data without explicit confirmation.

5. Account recovery
- Support secure recovery through the auth provider.
- Never store passwords in localStorage.

## Acceptance criteria
- No silent data loss.
- No automatic account merging.
- No cross-account data exposure.
- All identity transitions must be tested.
- Existing round-saving tests must continue passing.

## Scope
AF-06A.2: Specify and test account flows.
AF-06A.3: Data protection and database design.
AF-06A.4: Supabase Free implementation.
