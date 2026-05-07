-- CreateTable
CREATE TABLE "ParsedContent" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "headings" JSONB NOT NULL,
    "paragraphs" JSONB NOT NULL,
    "mainText" TEXT NOT NULL,
    "navigation" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "assets" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParsedContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParsedContent_pageId_key" ON "ParsedContent"("pageId");

-- AddForeignKey
ALTER TABLE "ParsedContent" ADD CONSTRAINT "ParsedContent_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
