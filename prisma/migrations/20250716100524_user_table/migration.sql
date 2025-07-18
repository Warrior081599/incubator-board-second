-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'subadmin', 'user');

-- CreateEnum
CREATE TYPE "project_member_role" AS ENUM ('owner', 'admin', 'member', 'viewer');

-- CreateEnum
CREATE TYPE "idea_stage" AS ENUM ('seed', 'refining', 'validating', 'launching');

-- CreateEnum
CREATE TYPE "idea_category" AS ENUM ('product', 'service', 'business', 'technology', 'marketing', 'research', 'personal', 'other');

-- CreateEnum
CREATE TYPE "idea_priority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "activity_action" AS ENUM ('created', 'updated', 'stage_changed', 'assigned', 'unassigned', 'archived', 'restored', 'deleted', 'tag_added', 'tag_removed', 'exported', 'project_created', 'member_added', 'member_removed');

-- CreateEnum
CREATE TYPE "export_type" AS ENUM ('json', 'markdown', 'csv', 'pdf');

-- CreateEnum
CREATE TYPE "export_status" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'user',
    "provider" TEXT,
    "provider_id" TEXT,
    "serial_number" SERIAL NOT NULL,
    "email_verified" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "default_stage" "idea_stage" NOT NULL DEFAULT 'seed',
    "default_priority" "idea_priority" NOT NULL DEFAULT 'medium',
    "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "auto_archive_days" INTEGER NOT NULL DEFAULT 90,
    "preferred_view" TEXT NOT NULL DEFAULT 'kanban',
    "custom_settings" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_serial_number_key" ON "users"("serial_number");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_serial_number_idx" ON "users"("serial_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
