CREATE TABLE IF NOT EXISTS library (
  "id" INTEGER PRIMARY KEY,
  "createdAt" INTEGER NOT NULL,
  "name" TEXT NOT NULL UNIQUE,
  "slug" TEXT NOT NULL,
  "libraryType" TEXT NOT NULL,
  "folders" JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS media (
  "id" INTEGER PRIMARY KEY,
  "parentMediaId" INTEGER,
  "libraryId" INTEGER NOT NULL,
  "createdAt" INTEGER NOT NULL,
  "fileCreatedAt" INTEGER,
  "fileLastUpdatedAt" INTEGER,
  "fileSize" INTEGER,
  "path" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "subType" TEXT,
  "matches" JSON,
  "art" JSON,
  "metadata" JSON,
  "data" JSON,
  "streams" JSON,
  FOREIGN KEY ("parentMediaId") REFERENCES media ("id"),
  FOREIGN KEY ("libraryId") REFERENCES library ("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_media_path ON media ("path");

CREATE TABLE IF NOT EXISTS user (
  "id" INTEGER PRIMARY KEY,
  "createdAt" INTEGER NOT NULL,
  "username" TEXT NOT NULL,
  "providers" JSON NOT NULL
);
