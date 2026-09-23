CREATE TABLE "DSAQuestion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "constraints" TEXT,
    "examples" TEXT,
    "solution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DSAQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DSASubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DSASubmission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DSAQuestion_slug_key"
ON "DSAQuestion"("slug");

CREATE INDEX "DSAQuestion_topic_idx"
ON "DSAQuestion"("topic");

CREATE INDEX "DSAQuestion_difficulty_idx"
ON "DSAQuestion"("difficulty");

CREATE INDEX "DSAQuestion_topic_difficulty_idx"
ON "DSAQuestion"("topic", "difficulty");

CREATE INDEX "DSASubmission_userId_idx"
ON "DSASubmission"("userId");

CREATE INDEX "DSASubmission_questionId_idx"
ON "DSASubmission"("questionId");

CREATE INDEX "DSASubmission_userId_questionId_idx"
ON "DSASubmission"("userId", "questionId");

ALTER TABLE "DSASubmission"
ADD CONSTRAINT "DSASubmission_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "DSASubmission"
ADD CONSTRAINT "DSASubmission_questionId_fkey"
FOREIGN KEY ("questionId")
REFERENCES "DSAQuestion"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;