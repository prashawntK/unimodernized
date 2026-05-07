-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('CREATED', 'CRAWLING', 'CRAWL_COMPLETE', 'ANALYZING', 'ANALYSIS_COMPLETE', 'GENERATING', 'COMPLETE', 'FAILED');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
