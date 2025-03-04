-- Create "attestation_policies" table
CREATE TABLE "attestation_policies" ("id" bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY, "name" character varying NOT NULL, "statement_policy" bigint NULL, PRIMARY KEY ("id"), CONSTRAINT "attestation_policies_statements_policy" FOREIGN KEY ("statement_policy") REFERENCES "statements" ("id") ON UPDATE NO ACTION ON DELETE SET NULL);
-- Create index "attestation_policies_statement_policy_key" to table: "attestation_policies"
CREATE UNIQUE INDEX "attestation_policies_statement_policy_key" ON "attestation_policies" ("statement_policy");
-- Create index "attestationpolicy_name" to table: "attestation_policies"
CREATE INDEX "attestationpolicy_name" ON "attestation_policies" ("name");
