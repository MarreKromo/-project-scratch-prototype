# AF-06A.2 – Account Flows


Status: Decision logic implemented and tested
Implementation: Pure logic only; not connected to app authentication or storage

## Verified progress
- Guest and account transition decisions defined.
- Registration, sign-in and recovery decisions defined.
- Guest data transfer requires explicit confirmation.
- Guest import completion requires verified import, backup and ownership.
- Sign-out completion requires private data isolation and unsynced data protection.
- Account switching requires verified isolation.
- Account-specific and guest-specific storage key helpers defined.
- Automated test suite: 74 passing tests.
- GitHub Actions tests and build passed.

## Deferred implementation
- Real authentication and account recovery via Supabase.
- Actual per-user data isolation and database policies.
- Real guest data migration, backup and recovery.
- Connecting account flows to the app interface.
- End-to-end security and account transition tests.

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
