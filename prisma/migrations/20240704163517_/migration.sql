-- CreateTable
CREATE TABLE "Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WhatsApp" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "qrcode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "plugged" TEXT NOT NULL,
    "retries" TEXT NOT NULL,
    "greetingMessage" TEXT NOT NULL,
    "farewellMessage" TEXT NOT NULL,
    "complationMessage" TEXT NOT NULL,
    "outOfHoursMessage" TEXT NOT NULL,
    "ratingMessage" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "token" TEXT NOT NULL,
    "maxUseBotQueues" INTEGER NOT NULL,
    "timeUseBotQueues" INTEGER NOT NULL,
    "organizationId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME,
    CONSTRAINT "WhatsApp_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WhatsApp" ("complationMessage", "createdAt", "farewellMessage", "greetingMessage", "id", "isDefault", "maxUseBotQueues", "name", "outOfHoursMessage", "plugged", "provider", "qrcode", "ratingMessage", "retries", "session", "status", "timeUseBotQueues", "token", "updateAt") SELECT "complationMessage", "createdAt", "farewellMessage", "greetingMessage", "id", "isDefault", "maxUseBotQueues", "name", "outOfHoursMessage", "plugged", "provider", "qrcode", "ratingMessage", "retries", "session", "status", "timeUseBotQueues", "token", "updateAt" FROM "WhatsApp";
DROP TABLE "WhatsApp";
ALTER TABLE "new_WhatsApp" RENAME TO "WhatsApp";
CREATE UNIQUE INDEX "WhatsApp_name_key" ON "WhatsApp"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");
