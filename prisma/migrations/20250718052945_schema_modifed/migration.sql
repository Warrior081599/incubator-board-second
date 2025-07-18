/*
  Warnings:

  - You are about to drop the column `token_expiry` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verification_token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "token_expiry",
DROP COLUMN "verification_token";
