INSERT INTO users (username, email, password)
VALUES ('testuser', 'test@example.com', 'not-a-real-hash');

INSERT INTO matches (team1, team2, sport, match_date, start_time) VALUES
  ('India', 'Australia', 'cricket', '2026-10-20', '14:00'),
  ('Arsenal', 'Chelsea', 'football', '2026-10-25', '20:00');