ALTER TABLE "armies" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profile_armies" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "armies" CASCADE;--> statement-breakpoint
DROP TABLE "profile_armies" CASCADE;--> statement-breakpoint
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_army_id_armies_id_fk";
--> statement-breakpoint
ALTER TABLE "availabilities" ADD COLUMN "army" text;--> statement-breakpoint
ALTER TABLE "availabilities" DROP COLUMN "army_id";