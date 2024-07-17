-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "birth" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "create_date" TEXT NOT NULL DEFAULT 'xxxx-xx-xx',
    "update_date" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
