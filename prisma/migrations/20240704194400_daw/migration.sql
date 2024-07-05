/*
  Warnings:

  - You are about to alter the column `retries` on the `Connection` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Connection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "qrcode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "plugged" TEXT NOT NULL,
    "retries" INTEGER NOT NULL,
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
    CONSTRAINT "Connection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Connection" ("complationMessage", "createdAt", "farewellMessage", "greetingMessage", "id", "isDefault", "maxUseBotQueues", "name", "organizationId", "outOfHoursMessage", "plugged", "provider", "qrcode", "ratingMessage", "retries", "session", "status", "timeUseBotQueues", "token", "updateAt") SELECT "complationMessage", "createdAt", "farewellMessage", "greetingMessage", "id", "isDefault", "maxUseBotQueues", "name", "organizationId", "outOfHoursMessage", "plugged", "provider", "qrcode", "ratingMessage", "retries", "session", "status", "timeUseBotQueues", "token", "updateAt" FROM "Connection";
DROP TABLE "Connection";
ALTER TABLE "new_Connection" RENAME TO "Connection";
CREATE UNIQUE INDEX "Connection_name_key" ON "Connection"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
