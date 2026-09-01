import express from 'express'
import cors from 'cors'
const app=express()
app.use(cors ({origin : 'http://localhost:5173'}))
app.use(express.json())

import DATABASE from 'better-sqlite3'
const db=new DATABASE('predictions-app.db')
db.pragma('foreign_keys=ON');

db.exec(`CREATE TABLE IF NOT EXISTS matches(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team1 TEXT NOT NULL,
    team2 TEXT NOT NULL,
    sport TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now', '+5 hours', '+30 minutes')))
    `)
db.exec(`CREATE TABLE IF NOT EXISTS predictions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matchId INTEGER,
    predictedOutcome TEXT NOT NULL,
    actualOutcome TEXT,
    isCorrect TEXT,
    createdAt TEXT DEFAULT (datetime('now', '+5 hours', '+30 minutes')),
    
    FOREIGN KEY (matchId) REFERENCES matches(id) ON DELETE CASCADE)`)

app.get('/api/matches',(req,res)=> {
    const {sport}=req.query
    let matches;
    if(sport)
        matches=db.prepare('SELECT * FROM matches WHERE sport = ? ').all(sport);
    else 
        matches=db.prepare('SELECT * FROM matches').all();
    res.json(matches);
})
app.post('/api/matches',(req,res)=> {
    const {team1} = req.body;
    const {team2} = req.body;
    if(!team1 || !team2)
    return res.status(400).json({error : 'Both Teams are required!'});
    const {sport} = req.body;
    if(!sport)
    return res.status(400).json({error : 'Sport is required!'});
    const stmt=db.prepare('INSERT INTO matches (team1, team2, sport) VALUES (?,?,?)').run(team1,team2,sport);
    res.status(201).json({id: stmt.lastInsertRowid, team1, team2});
});
app.get('/api/predictions',(req,res)=> {
    const sts=db.prepare('SELECT p.id, p.matchId, p.predictedOutcome, p.actualOutcome, p.isCorrect, p.createdAt, m.sport, m.team1, m.team2 FROM predictions p JOIN matches m ON p.matchId = m.id').all();
    res.json(sts);

})
app.post('/api/predictions',(req,res)=> {
    try {
        const {predictedOutcome,matchId} = req.body; 
        if(!predictedOutcome)
        return res.status(400).json({error : 'Predicted Outcome is required!'});
        const stmts=db.prepare('INSERT INTO predictions (matchId, predictedOutcome) VALUES (? , ?)').run(req.body.matchId,predictedOutcome);
        res.status(201).json({id : stmts.lastInsertRowid,predictedOutcome,matchId }); 
    }
    catch(error)
    {
        console.log(error)
        if(error.code==='SQLITE_CONSTRAINT_FOREIGNKEY')
        {
            return res.status(400).json({error : 'Match Doesnt exist'})
        }
        res.status(500).json({error: 'Internal Server Error'})
    }
})
app.patch('/api/predictions/:id',(req,res)=> {
    const {actualOutcome}=req.body;
    const stap=db.prepare('SELECT predictedOutcome FROM predictions WHERE id= ?' ).get(req.params.id);
    if(!stap)
        return res.status(404).json({error : 'Prediction Not Found'});
    const step = (stap.predictedOutcome === actualOutcome)?'true':'false';
    const sta=db.prepare('UPDATE predictions SET actualOutcome = ?, isCorrect = ? WHERE id = ?').run(actualOutcome,step,req.params.id);
    if(sta.changes===0)
        return res.status(404).json({error: 'Not Found'})
    res.status(200).json('Done');
})

app.listen(3000 , (error)=> {
    if(error)
        throw error;
    console.log('Running on LocalHost 3000')
    })
