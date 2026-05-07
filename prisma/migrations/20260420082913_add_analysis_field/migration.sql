-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "accessibility" JSONB NOT NULL,
    "content" JSONB NOT NULL,
    "design" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_pageId_key" ON "Analysis"("pageId");

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
