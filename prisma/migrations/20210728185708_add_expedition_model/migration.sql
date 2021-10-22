-- AlterTable
ALTER TABLE `Researcher` ADD COLUMN `expeditionId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Expedition` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `details` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Researcher` ADD CONSTRAINT `Researcher_expeditionId_fkey` FOREIGN KEY (`expeditionId`) REFERENCES `Expedition`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
