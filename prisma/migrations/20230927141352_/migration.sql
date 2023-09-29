-- CreateTable
CREATE TABLE "tiendanube_users" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tiendanube_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tiendanube_users_userId_key" ON "tiendanube_users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tiendanube_users_email_key" ON "tiendanube_users"("email");
