ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_army_id_armies_id_fk";
--> statement-breakpoint
DROP TABLE "profile_armies";
--> statement-breakpoint
DROP TABLE "armies";
--> statement-breakpoint
ALTER TABLE "availabilities" DROP COLUMN "army_id";
--> statement-breakpoint
ALTER TABLE "availabilities" ADD COLUMN "army" text;
