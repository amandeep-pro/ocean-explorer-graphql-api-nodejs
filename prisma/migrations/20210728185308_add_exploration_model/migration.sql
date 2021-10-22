-- CreateTable
CREATE TABLE `Exploration` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `oceanId` VARCHAR(191) NOT NULL,
    `details` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Exploration` ADD CONSTRAINT `Exploration_oceanId_fkey` FOREIGN KEY (`oceanId`) REFERENCES `Ocean`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
