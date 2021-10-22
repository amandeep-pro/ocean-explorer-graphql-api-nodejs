-- CreateTable
CREATE TABLE `Creature` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `species` VARCHAR(191) NOT NULL,
    `oceanId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Creature` ADD CONSTRAINT `Creature_oceanId_fkey` FOREIGN KEY (`oceanId`) REFERENCES `Ocean`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
