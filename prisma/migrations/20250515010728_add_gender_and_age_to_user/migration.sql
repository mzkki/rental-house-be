-- AlterTable
ALTER TABLE `users` ADD COLUMN `age` INTEGER NULL,
    ADD COLUMN `gender` ENUM('M', 'W') NULL;
