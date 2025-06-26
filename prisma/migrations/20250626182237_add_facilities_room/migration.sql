-- AlterTable
ALTER TABLE `room_types` ADD COLUMN `facilities` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL;
