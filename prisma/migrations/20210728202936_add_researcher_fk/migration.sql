-- AlterTable
ALTER TABLE `Observation` ADD COLUMN `researcherId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Observation` ADD CONSTRAINT `Observation_researcherId_fkey` FOREIGN KEY (`researcherId`) REFERENCES `Researcher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
