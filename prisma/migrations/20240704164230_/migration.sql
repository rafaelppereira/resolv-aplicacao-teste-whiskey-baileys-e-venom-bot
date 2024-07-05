-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL,
    "organizationId" INTEGER,
    "whatsAppId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME,
    CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "User_whatsAppId_fkey" FOREIGN KEY ("whatsAppId") REFERENCES "WhatsApp" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
