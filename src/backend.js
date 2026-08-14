import express from 'express'
const app=express()
app.use(express.json())

import DATABASE from 'better-sqlite3'
const db=new DATABASE('predictions-app.db')
db.pragma('foreign_keys=ON');

db.exec(`CREATE TABLE IF NOT EXISTS matches(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matchLabel TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP)
    `)
db.exec(`CREATE TABLE IF NOT EXISTS predictions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matchId INTEGER,
    FOREIGN KEY (matchId) REFERENCES matches(id),
    predictedOutcome TEXT NOT NULL,
    actualOutcome TEXT NULL,
    isCorrect TEXT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP)`)

app.get('/api/matches',(req,res)=> {
    const mts=db.prepare('SELECT * FROM matches').all();
    res.json(mts);
})
app.post('/api/matches',(req,res)=> {
    const {matchLabel} = req.body;
    if(!matchLabel)
    return res.status(400).json({error : 'MatchLabel is required'});
    const stmt=db.prepare('INSERT INTO matches (matchLabel) VALUES (?)').run(matchLabel);
    res.status(201).json({id: stmt.lastINsertRowid, matchLabel});
});
