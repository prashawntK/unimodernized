-- CreateTable
CREATE TABLE "AuditResult" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "passCount" INTEGER NOT NULL,
    "failCount" INTEGER NOT NULL,
    "auditedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Violation" (
    "id" TEXT NOT NULL,
    "auditResultId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "helpUrl" TEXT NOT NULL,
    "nodes" JSONB NOT NULL,

    CONSTRAINT "Violation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuditResult_pageId_key" ON "AuditResult"("pageId");

-- AddForeignKey
ALTER TABLE "AuditResult" ADD CONSTRAINT "AuditResult_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Violation" ADD CONSTRAINT "Violation_auditResultId_fkey" FOREIGN KEY ("auditResultId") REFERENCES "AuditResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
