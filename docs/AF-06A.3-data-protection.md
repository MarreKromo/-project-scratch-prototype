# AF-06A.3 – Data Protection & Database Design

Status: Draft
Implementation: Design only

## Goal
Protect each golfer's private data and prepare
Project Scratch for Supabase integration.

## Core principles
1. Every account owns its private data.
2. Users must never access another user's private data.
3. Guest data remains local until explicitly imported.
4. No silent deletion, merging or overwriting.
5. Database access must enforce ownership, not just the UI.

## Planned data entities

### Profiles
- id
- display_name
- created_at

### Rounds
- id
- user_id
- course_name
- played_at
- round_data
- created_at

### Training sessions
- id
- user_id
- activity_type
- duration_minutes
- performed_at
- created_at

### Golf DNA
- id
- user_id
- profile_data
- updated_at

## Security requirements
- Supabase Auth manages authenticated identities.
- Row Level Security (RLS) protects private tables.
- Every private record has a verified owner.
- No service-role keys in frontend code.
- Users can export and request deletion of their data.
- Unsynced guest data must not be silently deleted.

## Data ownership rules

### Identity
- Supabase Auth user ID is the canonical account identity.
- Profiles.id must match the authenticated user's ID.
- Rounds.user_id references Profiles.id.
- Training sessions.user_id references Profiles.id.
- Golf DNA.user_id references Profiles.id.
- Client-supplied owner IDs must never grant access.

### Private data access
- SELECT: Only the authenticated owner.
- INSERT: Only when the owner ID matches auth.uid().
- UPDATE: Only the owner; ownership cannot be transferred.
- DELETE: Only the owner, subject to deletion safeguards.
- Unauthenticated users have no access to account data.

### Profiles
- Each account has at most one profile.
- Users may access and edit only their own profile.
- Public profile visibility requires a separate future design.

### Rounds and training
- Every record must belong to exactly one account.
- Records must not be reassigned between accounts.
- Guest records remain separate until verified import.

### Golf DNA
- Golf DNA is private by default.
- Each account has at most one Golf DNA profile.
- Badges and rewards must not expose private statistics.
- Friend visibility and leaderboards require separate
  consent and access rules before implementation.

### Database enforcement
- Enable RLS on every private table.
- Apply ownership checks to all database operations.
- Use database constraints to protect ownership.
- Test cross-account access denial before release.

## Acceptance criteria
- Ownership rules documented for every table.
- RLS policies designed and reviewed.
- Guest migration and backup strategy documented.
- Export and deletion flows documented.
- Security tests specified before implementation.

## Scope
AF-06A.3: Database and security design.
AF-06A.4: Supabase implementation.
