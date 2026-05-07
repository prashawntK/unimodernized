-- CreateTable
CREATE TABLE "Redesign" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "pageType" TEXT NOT NULL,
    "layout" TEXT NOT NULL,
    "colors" JSONB NOT NULL,
    "typography" JSONB NOT NULL,
    "fixes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Redesign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Redesign_pageId_key" ON "Redesign"("pageId");

-- AddForeignKey
ALTER TABLE "Redesign" ADD CONSTRAINT "Redesign_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
