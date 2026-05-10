-- CreateTable
CREATE TABLE "BrandProfile" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "backgroundColor" TEXT,
    "textColor" TEXT,
    "fontHeading" TEXT,
    "fontBody" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrandProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_projectId_key" ON "BrandProfile"("projectId");

-- AddForeignKey
ALTER TABLE "BrandProfile" ADD CONSTRAINT "BrandProfile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
