/*
  Warnings:

  - Added the required column `expiredAt` to the `email_verify_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiredAt` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `email_verify_tokens` ADD COLUMN `expiredAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `password_reset_tokens` ADD COLUMN `expiredAt` DATETIME(3) NOT NULL;
