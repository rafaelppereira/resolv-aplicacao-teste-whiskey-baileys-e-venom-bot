/*
  Warnings:

  - You are about to drop the `WhatsApp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `whatsAppId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "WhatsApp_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WhatsApp";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Connection" (
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
    CONSTRAINT "Connection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL,
    "organizationId" INTEGER,
    "connectionId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME,
    CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "User_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "id", "name", "online", "organizationId", "updateAt") SELECT "createdAt", "id", "name", "online", "organizationId", "updateAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Connection_name_key" ON "Connection"("name");
