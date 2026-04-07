-- CreateEnum for ProductApprovalStatus
CREATE TYPE "ProductApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable "Product" - Add product approval fields
ALTER TABLE "Product" ADD COLUMN "approvalStatus" "ProductApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "approvedBy" TEXT,
ADD COLUMN "approvalReason" TEXT,
ADD COLUMN "approvedAt" TIMESTAMP(3);

-- AlterTable "User" - Add dismissal tracking fields
ALTER TABLE "User" ADD COLUMN "dismissedBy" TEXT,
ADD COLUMN "dismissalReason" TEXT,
ADD COLUMN "dismissedAt" TIMESTAMP(3);
