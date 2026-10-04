DROP TABLE IF EXISTS predictions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS matches;


CREATE TABLE users (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username    TEXT NOT NULL UNIQUE,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  points      INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE matches (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  team1       TEXT NOT NULL,
  team2       TEXT NOT NULL,
  sport       TEXT NOT NULL CHECK (sport IN ('cricket', 'football')),
  match_date  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE predictions (
  id                 INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id            INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_id           INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  predicted_outcome  TEXT NOT NULL,
  actual_outcome     TEXT,
  is_correct         BOOLEAN,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, match_id)
)

