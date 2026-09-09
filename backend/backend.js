require('dotenv').config();
import express from 'express'
import cors from 'cors'
const app=express()
app.use(cors ({origin : 'http://localhost:5173'}))
app.use(express.json())

import DATABASE from 'better-sqlite3'
const db=new DATABASE('predictions-app.db')
db.pragma('foreign_keys=ON');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken')
const fbi_level_secret_key= process.env.jwtsecret;

db.exec(`CREATE TABLE IF NOT EXISTS user(
    id INTEGER  PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL, 
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
    userId 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matchId INTEGER,
    predictedOutcome TEXT NOT NULL,
    actualOutcome TEXT,
    isCorrect TEXT,
    createdAt TEXT DEFAULT (datetime('now', '+5 hours', '+30 minutes')),
    userId INTEGER REFERENCES users(id),
    FOREIGN KEY (matchId) REFERENCES matches(id) ON DELETE CASCADE)`)

app.get('/api/matches', (req,res)=> {
    const {sport}=req.query
    let matches;
    if(sport)
        matches=db.prepare('SELECT * FROM matches WHERE sport = ? ').all(sport);
    else 
        matches=db.prepare('SELECT * FROM matches').all();
    res.json(matches);
})
app.post('/api/matches',authenticate, (req,res)=> {
    const {team1} = req.body;
    const {team2} = req.body;
    if(!team1 || !team2)
    return res.status(400).json({error : 'Both Teams are required!'});
    const {sport} = req.body;
    const {date} = req.body;
    if (!date) return res.status(400).json({ error: 'Date is required!' });
    if(!sport)
    return res.status(400).json({error : 'Sport is required!'});
    const stmt=db.prepare('INSERT INTO matches (team1, team2, sport, date) VALUES (?,?,?,?)').run(team1,team2,sport,date);
    res.status(201).json({id: stmt.lastInsertRowid, team1, team2});
});
app.get('/api/predictions',authenticate, (req,res)=> {
    const sts=db.prepare('SELECT p.id, p.matchId, p.predictedOutcome, p.actualOutcome, p.isCorrect, p.createdAt, m.sport, m.team1, m.team2 FROM predictions p JOIN matches m ON p.matchId = m.id').all();
    res.json(sts);

})
app.post('/api/predictions',authenticate,(req,res)=> {
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
app.patch('/api/predictions/:id',authenticate, (req,res)=> {
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
app.post('/api/auth/register',async (req,res)=> {
    try 
    {
        const {email} = req.body;
        const {username}= req.body
        if(!email)
            return res.status(400).json({error : 'E-mail is required!'});
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

        return res.status(201).json({id : stms.lastInsertRowid, normalizedemail})
    }
    catch(error)
    {
        if(error.message.includes('UNIQUE constraint failed: user.email'))
        {
             return res.status(409).json({ error: 'Email already registered' });
        }
        else if(error.message.includes('UNIQUE constraint failed: user.username'))
        {
           return res.status(409).json({ error: 'Username already exists' });
        }
        else
        {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

})

app.post('api/auth/login', async (req,res)=> {
    try 
    {
        const {email,password} = req.body;
        if(!email)
            return res.status(400).json({error : 'E-mail is required!'});
        if(!password)
            return res.status(400).json({error : 'Password is required!'});

        const user=db.prepare(`SELECT * FROM user WHERE email=?`).get(email)
        if(!user)
        {
            return res.status(401).json({error : 'Invalid E-mail or Password'})
        }
        const passwordMatch = bcrypt.compare(password,user.password);
        if(!passwordMatch)
        {
            return res.status(401).json({error : 'Invalid E-mail or Password'})
        }
        const token= jwt.sign(
            { userId : user.id},
            fbi_level_secret_key,
            { expiresIn: '7d'}
        )
        return res.status(200).json(token)
    }
    catch {
            console.error(error);

            return res.status(500).json({
            error: 'Internal Server Error'
            });
    }
})

function authenticate(req,res,next) 
{
    const authHeader=req.headers.authorization;
    if(!authHeader)
    {
        return res.status(401).json({error : "Authorization header required"})
    }
    const bound=authHeader.split(' ');

    if(bound.length!=2 && bound[0]!= 'Bearer')
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
