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

## Row Level Security (RLS) design

### General policy
- RLS must be enabled on profiles, rounds,
  training_sessions and golf_dna.
- No anonymous access to private account records.
- The authenticated user identity comes from auth.uid().
- Frontend filters are not security boundaries.
- No unrestricted policies for public or authenticated roles.

### Profiles
- SELECT: id = auth.uid()
- INSERT: id = auth.uid()
- UPDATE: USING id = auth.uid()
  and WITH CHECK id = auth.uid()
- DELETE: id = auth.uid(), with account deletion
  handled by a controlled workflow.

### Rounds
- SELECT: user_id = auth.uid()
- INSERT: WITH CHECK user_id = auth.uid()
- UPDATE: USING user_id = auth.uid()
  and WITH CHECK user_id = auth.uid()
- DELETE: USING user_id = auth.uid()

### Training sessions
- SELECT: user_id = auth.uid()
- INSERT: WITH CHECK user_id = auth.uid()
- UPDATE: USING user_id = auth.uid()
  and WITH CHECK user_id = auth.uid()
- DELETE: USING user_id = auth.uid()

### Golf DNA
- SELECT: user_id = auth.uid()
- INSERT: WITH CHECK user_id = auth.uid()
- UPDATE: USING user_id = auth.uid()
  and WITH CHECK user_id = auth.uid()
- DELETE: USING user_id = auth.uid()

### Required database constraints
- profiles.id references auth.users(id).
- All private user_id fields reference profiles(id).
- Private owner IDs must be NOT NULL.
- golf_dna.user_id must be UNIQUE.
- Foreign keys and deletion behavior require review
  before production migration.

### Security validation
- User A cannot read User B's records.
- User A cannot insert records owned by User B.
- User A cannot change ownership to User B.
- User A cannot update or delete User B's records.
- Unauthenticated requests cannot access private data.
- RLS must be tested against the actual database
  during AF-06A.4.

## Guest data migration and backup strategy

### Before migration
- Identify the authenticated destination account.
- Verify that the guest dataset is readable.
- Create and preserve a local guest backup.
- Check whether the destination account has data.
- Show a summary of what will be imported.
- Require explicit user confirmation.

### Migration process
- Never overwrite existing account records.
- Assign imported records to the verified account.
- Use stable source IDs to detect duplicate imports.
- Record migration progress and results.
- Import related records without losing relationships.
- Treat interrupted migrations as recoverable.
- Never trust a client-supplied owner ID alone.

### After migration
- Verify imported record counts and relationships.
- Verify ownership of all imported records.
- Preserve the guest backup after import.
- Mark migration complete only after verification.
- Do not automatically delete local guest history.

### Failure handling
- Failed imports must not erase guest data.
- Retrying must not create duplicate records.
- Partial imports must be detected and recoverable.
- Existing account data must remain unchanged.
- Display a clear failure message to the user.

### Required migration tests
- Import into an empty account.
- Import into an account with existing history.
- Interrupted import followed by retry.
- Duplicate import attempt.
- Invalid destination account.
- Missing or corrupted guest data.
- Verification failure after import.
- Account switch during an unfinished import.

## Acceptance criteria
- Ownership rules documented for every table.
- RLS policies designed and reviewed.
- Guest migration and backup strategy documented.
- Export and deletion flows documented.
- Security tests specified before implementation.

## Scope
AF-06A.3: Database and security design.
AF-06A.4: Supabase implementation.
