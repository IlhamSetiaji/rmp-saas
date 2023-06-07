/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `email_verify_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `password_reset_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `email_verify_tokens_token_key` ON `email_verify_tokens`(`token`);

-- CreateIndex
CREATE UNIQUE INDEX `password_reset_tokens_token_key` ON `password_reset_tokens`(`token`);
