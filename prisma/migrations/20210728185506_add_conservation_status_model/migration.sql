-- AlterTable
ALTER TABLE `Creature` ADD COLUMN `conservationStatusId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ConservationStatus` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Creature` ADD CONSTRAINT `Creature_conservationStatusId_fkey` FOREIGN KEY (`conservationStatusId`) REFERENCES `ConservationStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
