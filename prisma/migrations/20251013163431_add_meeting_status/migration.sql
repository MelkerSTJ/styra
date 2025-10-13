-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "status" TEXT DEFAULT 'draft',
ADD COLUMN     "summary" TEXT;
