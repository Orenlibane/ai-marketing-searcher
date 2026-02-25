-- CreateTable
CREATE TABLE "MarketingTool" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "dateAdded" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isNewLaunch" BOOLEAN NOT NULL DEFAULT false,
    "usageScore" INTEGER NOT NULL DEFAULT 0,
    "reviewSentiment" TEXT NOT NULL DEFAULT 'neutral',
    "lastUpdated" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketingTool_name_key" ON "MarketingTool"("name");
