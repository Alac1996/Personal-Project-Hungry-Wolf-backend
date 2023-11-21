/*
  Warnings:

  - Made the column `crust` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `size` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `crust` ENUM('Thick_soft', 'Thin_crispy', 'null') NOT NULL DEFAULT 'null',
    MODIFY `size` ENUM('Medium', 'Large', 'null') NOT NULL DEFAULT 'null';
