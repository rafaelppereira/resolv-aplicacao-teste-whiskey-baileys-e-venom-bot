/*
  Warnings:

  - Added the required column `battery` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `complationMessage` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farewellMessage` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `greetingMessage` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDefault` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxUseBotQueues` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outOfHoursMessage` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plugged` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qrcode` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingMessage` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `retries` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeUseBotQueues` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `WhatsApp` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WhatsApp" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "qrcode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "battery" TEXT NOT NULL,
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
    "timeUseBotQueues" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME
);
INSERT INTO "new_WhatsApp" ("id") SELECT "id" FROM "WhatsApp";
DROP TABLE "WhatsApp";
ALTER TABLE "new_WhatsApp" RENAME TO "WhatsApp";
CREATE UNIQUE INDEX "WhatsApp_name_key" ON "WhatsApp"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
