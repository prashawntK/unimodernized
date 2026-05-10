/*
  Warnings:

  - You are about to drop the column `accessibility` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `design` on the `Analysis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "accessibility",
DROP COLUMN "design";
