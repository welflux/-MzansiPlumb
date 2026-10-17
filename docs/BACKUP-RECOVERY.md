# Backup and recovery

Database rows, uploaded evidence, job activity, quote revisions, password hashes and sessions live in the same SQLite database. Back up this database using SQLite's consistent backup API; copying only a live `.sqlite` file can lose WAL changes. Filesystem permissions are not disk encryption.

## Encrypted backup

Provide BACKUP_ENCRYPTION_KEY securely to the backup process: a randomly generated 32-byte key encoded as base64, kept in a secret manager separately from backups. Never commit or send the key in chat. There is no hardcoded key. Loss of the key makes these backups unrecoverable. Protect and test access to the key as part of your recovery procedure.

With DATABASE_PATH and BACKUP_ENCRYPTION_KEY set in that process:

```sh
node --env-file-if-exists=.env scripts/backup.mjs /secure/backup-path/mzansiplumb-YYYYMMDD.mpbackup
```

The command creates a consistent snapshot, encrypts it with AES-256-GCM and a random nonce, writes with mode 0600, refuses to overwrite an existing file, and removes its temporary plaintext copy. It does not upload or schedule anything. Ensure the temporary directory is on encrypted storage and sufficient memory/disk are available for the complete snapshot. The current encryption implementation reads the snapshot into memory; large databases require capacity review or a future streaming implementation.

Suggested starting policy, requiring business approval: daily encrypted off-machine backups retained for 30 days, weekly recovery verification, RPO 24 hours, RTO four hours. These are proposed targets, not currently achieved guarantees. Confirm legal retention requirements. Configure the actual Hostinger scheduler, secure off-machine destination, failure alerts and retention after the hosting plan is known. Those integrations/credentials are not configured.

## Restore to a new location

1. Stop the application service and preserve the existing database/WAL/SHM files for investigation. Preserve the deployed release and environment configuration as well.
2. Supply the original encryption key to the restore process securely. Restore to a **new** file path; the script refuses to overwrite existing files.

```sh
node --env-file-if-exists=.env scripts/restore.mjs /secure/backup-path/mzansiplumb-YYYYMMDD.mpbackup /private/data/mzansiplumb-restored.sqlite
```

3. The restore authenticates/decrypts the backup, runs SQLite integrity and foreign-key checks, deletes sessions to require fresh login, and promotes the verified file. Point DATABASE_PATH at the restored file and confirm directory/file ownership and private permissions.
4. Start the compatible application version; startup applies any pending migrations. Sign in, verify company/job counts, open several private photos, review quote decisions and download representative reports. Verify the configured origin and secure cookies.
5. Re-enable traffic only after verification; keep the previous database and release available for rollback until the incident is reviewed. Do not restore a database upgraded by newer migrations into older code without an explicitly tested compatibility path.

The automated test restores a live database containing a real customer/property/job/image, confirms rows and evidence survive, confirms restored sessions are gone, and verifies wrong-key/overwrite rejection. A recovery drill on the actual Hostinger environment remains unrun.

## Phase 3 automation safety on restore

The database backup also contains maintenance occurrences, stock movements, cost/revenue history, completion snapshots and notification queue/attempt/event state. Restoring disables every company's external email toggle, suppresses pending/retrying/processing outbox items, and clears worker leases in addition to revoking sessions. This avoids blindly replaying mail that may have been accepted after the backup was taken. Accepted/delivered historical outcomes remain historical records.

Keep workers stopped while reviewing a restored database. Reconcile maintenance jobs and manual accounting/stock changes since the backup's recovery point. Compare uncertain messages with the provider's log; do not assume a pending snapshot means no email was sent. Restart the worker and verify its heartbeat after reviewing queues. Re-enable email explicitly only after recipient, provider credentials/webhook and replay risks are checked. A restored snapshot cannot recover transactions that occurred after its recovery point without another authoritative record.

Phase 4 backups include organization, private logos, approval policies/decisions, subscription receipts and encrypted provider tokens. Keep BILLING_TOKEN_KEY recoverable separately; without it real provider cancellation cannot be performed. Restore suspends provider-backed subscriptions and marks pending checkouts `recovery_review`, in addition to disabling mail and revoking sessions. Keep both billing flags off. Reconcile the actual provider ledger/cancellations and replay only independently verified missing events under operator review before restoring entitlement access. Do not open a new duplicate checkout to repair a lost record. Review the external deletion register and reapply completed erasures before making restored data available. Backup and provider retention are not erased by application account deletion.

Phase 5 migration 006 adds account recovery/verification challenges and an encrypted account-email queue. The restore command marks every unconsumed challenge used and suppresses pending/retry/processing account emails while erasing encrypted link payloads. Existing accepted message records remain acceptance history; restored links cannot be consumed. AUTH_LINK_KEY is independent of backup and billing token keys. Verify real sender/provider state and create fresh links only after the restored account/deletion state is reviewed.
