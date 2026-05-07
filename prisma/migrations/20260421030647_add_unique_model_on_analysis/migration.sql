/*
  Warnings:

  - A unique constraint covering the columns `[pageId,model]` on the table `Analysis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `model` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "model" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_pageId_model_key" ON "Analysis"("pageId", "model");
