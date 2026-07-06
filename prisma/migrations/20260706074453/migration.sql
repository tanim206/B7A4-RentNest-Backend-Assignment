/*
  Warnings:

  - The values [ACTIVE] on the enum `activeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "activeStatus_new" AS ENUM ('BANNED', 'UNBANNED');
ALTER TABLE "public"."users" ALTER COLUMN "activeStatus" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "activeStatus" TYPE "activeStatus_new" USING ("activeStatus"::text::"activeStatus_new");
ALTER TYPE "activeStatus" RENAME TO "activeStatus_old";
ALTER TYPE "activeStatus_new" RENAME TO "activeStatus";
DROP TYPE "public"."activeStatus_old";
ALTER TABLE "users" ALTER COLUMN "activeStatus" SET DEFAULT 'UNBANNED';
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "activeStatus" SET DEFAULT 'UNBANNED';
