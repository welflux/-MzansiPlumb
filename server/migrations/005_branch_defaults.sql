-- Ensure system-created records carry the source branch just like interactive writes.
CREATE TRIGGER followups_branch_default AFTER INSERT ON followups WHEN NEW.branch_id IS NULL BEGIN
 UPDATE followups SET branch_id=COALESCE((SELECT branch_id FROM jobs WHERE id=NEW.job_id AND company_id=NEW.company_id),(SELECT branch_id FROM customers WHERE id=NEW.customer_id AND company_id=NEW.company_id),NEW.company_id) WHERE id=NEW.id;
END;
CREATE TRIGGER notifications_branch_default AFTER INSERT ON notifications WHEN NEW.branch_id IS NULL BEGIN
 UPDATE notifications SET branch_id=COALESCE((SELECT branch_id FROM followups WHERE id=NEW.followup_id AND company_id=NEW.company_id),(SELECT branch_id FROM inventory_items WHERE id=substr(NEW.dedupe_key,7,36) AND company_id=NEW.company_id),NEW.company_id) WHERE id=NEW.id;
END;
CREATE TRIGGER activities_branch_default AFTER INSERT ON activities WHEN NEW.branch_id IS NULL BEGIN
 UPDATE activities SET branch_id=COALESCE((SELECT branch_id FROM jobs WHERE id=NEW.job_id AND company_id=NEW.company_id),(SELECT branch_id FROM customers WHERE id=NEW.customer_id AND company_id=NEW.company_id),NEW.company_id) WHERE id=NEW.id;
END;
