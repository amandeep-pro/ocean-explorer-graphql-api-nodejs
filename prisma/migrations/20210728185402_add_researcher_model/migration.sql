-- AlterTable
ALTER TABLE `Exploration` ADD COLUMN `researcherId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Researcher` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `expertise` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Exploration` ADD CONSTRAINT `Exploration_researcherId_fkey` FOREIGN KEY (`researcherId`) REFERENCES `Researcher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
