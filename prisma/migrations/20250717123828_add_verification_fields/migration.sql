-- AlterTable
ALTER TABLE "users" ADD COLUMN     "token_expiry" TIMESTAMP(3),
ADD COLUMN     "verification_token" TEXT;
