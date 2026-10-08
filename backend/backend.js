import dotenv from 'dotenv';
dotenv.config();

import pool from './db.js'
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

const db = new Database('predictions-app.db');

db.pragma('foreign_keys=ON');
const fbi_level_secret_key= process.env.jwtsecret;

db.exec(`CREATE TABLE IF NOT EXISTS user(
    id INTEGER  PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    password TEXT NOT NULL, 
    createdAt TEXT DEFAULT (datetime('now', '+5 hours', '+30 minutes'))
    )`)
db.exec(`CREATE TABLE IF NOT EXISTS matches(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team1 TEXT NOT NULL,
    team2 TEXT NOT NULL,
    sport TEXT NOT NULL,
    date TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now', '+5 hours', '+30 minutes')))
    `)
db.exec(`CREATE TABLE IF NOT EXISTS predictions( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matchId INTEGER,
    predictedOutcome TEXT NOT NULL,
    actualOutcome TEXT,
    isCorrect TEXT,
    createdAt TEXT DEFAULT (datetime('now', '+5 hours', '+30 minutes')),
    userId INTEGER REFERENCES user(id),
    FOREIGN KEY (matchId) REFERENCES matches(id) ON DELETE CASCADE)`)

    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_predictions_user_match_guard ON predictions     (userId,matchId)')


    function matchStartMs(date, time) {
    return new Date(`${date}T${time || "00:00"}:00+05:30`).getTime();
    }

app.get('/api/matches', async (req,res)=> {
    try
    {    
        const sport = req.query.sport ?? null ; 
        
            const { rows }=await pool.query(`SELECT id, team1, team2, sport,
                to_char(match_date, 'YYYY-MM-DD') AS date,
                start_time AS "startTime",
                created_at AS "createdAt"
            FROM matches
            WHERE ($1::text IS NULL OR sport = $1)
            ORDER BY match_date, start_time NULLS FIRST`,[sport]);
                    res.json(rows);
                }
    catch(err)
    {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
})
app.post("/api/matches", async (req, res) => {
  try {
    const { team1, team2, sport, date, startTime } = req.body;

    if (!team1 || !team2 || !sport || !date) {
      return res.status(400).json({ error: "team1, team2, sport and date are required" });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: "date must be YYYY-MM-DD" });
    }
    if (startTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) {
      return res.status(400).json({ error: "startTime must be HH:MM (24-hour)" });
    }

    const { rows } = await pool.query(
      `INSERT INTO matches (team1, team2, sport, match_date, start_time)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, team1, team2, sport,
                 to_char(match_date, 'YYYY-MM-DD') AS date,
                 start_time AS "startTime",
                 created_at AS "createdAt"`,
      [team1, team2, sport, date, startTime || null]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23514") {
      return res.status(400).json({ error: "sport must be 'cricket' or 'football'" });
    }
    if (err.code === "22008") {
      return res.status(400).json({ error: "date is not a real calendar date" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/predictions", authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id,
              p.match_id          AS "matchId",
              p.predicted_outcome AS "predictedOutcome",
              p.actual_outcome    AS "actualOutcome",
              p.is_correct        AS "isCorrect",
              p.created_at        AS "createdAt",
              m.sport, m.team1, m.team2
       FROM predictions p
       JOIN matches m ON p.match_id = m.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [req.user_id]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/predictions", authenticate, async (req, res) => {
  try {
    const { predictedOutcome } = req.body;
    const matchId = Number(req.body.matchId);
    const userId = req.userId; // use whatever name your middleware sets

    if (!predictedOutcome) {
      return res.status(400).json({ error: "Predicted Outcome is required!" });
    }
    if (!Number.isInteger(matchId)) {
      return res.status(400).json({ error: "matchId must be a number" });
    }

    // 1. Does the match exist? When does it start?
    const { rows: matchRows } = await pool.query(
      `SELECT id,
              to_char(match_date, 'YYYY-MM-DD') AS date,
              start_time AS "startTime"
       FROM matches
       WHERE id = $1`,
      [matchId]
    );

    if (matchRows.length === 0) {
      return res.status(404).json({ error: "Match not found." });
    }

    // 2. Has it started?
    const match = matchRows[0];
    const startMs = matchStartMs(match.date, match.startTime);

    if (Number.isNaN(startMs)) {
      console.error("Bad date format for match", match.id, match.date);
      return res.status(500).json({ error: "Match date is invalid." });
    }
    if (Date.now() >= startMs) {
      return res.status(403).json({ error: "Predictions are closed for this match." });
    }

    // 3. Save it
    const { rows } = await pool.query(
      `INSERT INTO predictions (match_id, predicted_outcome, user_id)
       VALUES ($1, $2, $3)
       RETURNING id,
                 match_id          AS "matchId",
                 predicted_outcome AS "predictedOutcome",
                 created_at        AS "createdAt"`,
      [matchId, predictedOutcome, userId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "You've already predicted this match." });
    }
    if (err.code === "23503") {
      return res.status(400).json({ error: "Match doesn't exist." });
    }
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/api/predictions/:id", authenticate, async (req, res) => {
  const { actualOutcome } = req.body;
  const predictionId = Number(req.params.id);

  if (!actualOutcome) {
    return res.status(400).json({ error: "actualOutcome is required" });
  }
  if (!Number.isInteger(predictionId)) {
    return res.status(400).json({ error: "Invalid prediction id" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Record the result (only if it hasn't been recorded yet)
    const { rows } = await client.query(
      `UPDATE predictions
       SET actual_outcome = $1,
           is_correct = (predicted_outcome = $1)
       WHERE id = $2 AND user_id = $3 AND actual_outcome IS NULL
       RETURNING id,
                 match_id          AS "matchId",
                 predicted_outcome AS "predictedOutcome",
                 actual_outcome    AS "actualOutcome",
                 is_correct        AS "isCorrect"`,
      [actualOutcome, predictionId, req.userId]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ error: "Prediction not found, or its result is already recorded" });
    }

    // 2. Update the user's points
    const pointsChange = rows[0].isCorrect ? 3 : -1;
    await client.query(
      "UPDATE users SET points = points + $1 WHERE id = $2",
      [pointsChange, req.userId]
    );

    await client.query("COMMIT");
    res.status(200).json(rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});
app.post('/api/auth/register',async (req,res)=> {
    try 
    {
        const {email} = req.body;
        const {username}= req.body
        if(!email)
            return res.status(400).json({error : 'E-mail is required!'});
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
}
        if(!username)
            return res.status(400).json({error : 'Username is required!'});
        const {password} = req.body;
        if(!password)
            return res.status(400).json({error : 'Password is required!'});
        const hashedPassword = await bcrypt.hash(password,10)
        const normalizedemail = email.trim().toLowerCase();
        const normalizedusername = username.trim();
        const stms=db.prepare(`INSERT INTO user(email, password, username) VALUES(? , ?, ?)`
        ).run(normalizedemail,hashedPassword,normalizedusername)

        return res.status(201).json({id : stms.lastInsertRowid,email : normalizedemail})
    }
    catch(error)
    {
        if(error.message.includes('UNIQUE constraint failed: user.email'))
        {
             return res.status(409).json({ error: 'Email already registered' });
        }
        else if(error.message.includes('UNIQUE constraint failed: user.username'))
        {
           return res.status(409).json({ error: 'Username is Taken' });
        }
        else
        {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

})

app.post('/api/auth/login', async (req,res)=> {
    try 
    {
        const {email,password} = req.body;
        if(!email)
            return res.status(400).json({error : 'E-mail is required!'});
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
}
        if(!password)
            return res.status(400).json({error : 'Password is required!'});
        const normalizedemail = email.trim().toLowerCase();
        const user=db.prepare(`SELECT * FROM user WHERE email=?`).get(normalizedemail)
        if(!user)
        {
            return res.status(401).json({error : 'Invalid E-mail or Password'})
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch)
        {
            return res.status(401).json({error : 'Invalid E-mail or Password'})
        }
        const token= jwt.sign(
            { userId : user.id},
            fbi_level_secret_key,
            { expiresIn: '7d'}
        )
        return res.status(200).json({token,
            user: { id: user.id, username: user.username, email: user.email }
        })
    }
    catch(error) {
            console.error(error);

            return res.status(500).json({
            error: 'Internal Server Error'
            });
    }
})

app.get('/api/leaderboard',authenticate, (req,res)=>{
    const strows=db.prepare('SELECT id, username,points FROM "user" ORDER BY points DESC, username ASC LIMIT 20').all();
    res.json(strows.map((r,i)=>({rank : i+1, ...r})));
})


function authenticate(req,res,next) 
{
    const authHeader=req.headers.authorization;
    if(!authHeader)
    {
        return res.status(401).json({error : "Authorization header required"})
    }
    const bound=authHeader.split(' ');

    if(bound.length!=2 || bound[0]!= 'Bearer')
    {
        return res.status(401).json({error : "Invalid authorization header"})
    }
    const token = bound[1];
    try {
        const deloaded = jwt.verify(token,fbi_level_secret_key)
        req.userId = deloaded.userId;
        next();
    }
    catch(error) {
        res.status(401).json({error : 'Invalid or expired token'})
    }
}


app.listen(3000 , (error)=> {
    if(error)
        throw error;
    console.log('Running on LocalHost 3000')
    })
