/*
  Warnings:

  - Added the required column `image` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `image` VARCHAR(191) NOT NULL,
    MODIFY `crust` ENUM('Thick_soft', 'Thin_crispy') NULL,
    MODIFY `size` ENUM('Medium', 'Large') NULL;
