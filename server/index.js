import express from 'express';
import { createUserDB } from './database.js';
import {naturalToSql} from './sqlAgent.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from "uuid";
const app=express();
const port=3000;

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true,
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.post('/agent',async(req,res)=>{
    try{
        let userId = req.cookies.userId;
        if(!userId){
            userId=uuidv4().replace(/-/g, "");
            console.log(`New user detected. Assinging userId: ${userId}`);
        }
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 
        };
        res.cookie('userId',userId,cookieOptions);
        const {userMessage}=req.body;
        console.log('Received request:', req.body);
        console.log('userId:', userId);
        const userClient = await createUserDB(userId);
        const schemaDescription = [`
    Table: groceries
    Columns:
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      quantity INT DEFAULT 1,
      purchased_on DATE DEFAULT CURRENT_DATE
    `,`
    Table: tasks
    Columns:
      id SERIAL PRIMARY KEY,
      name TEXT TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      due_date DATE DEFAULT CURRENT_DATE
    `,
    `
    Table:expenses
    Columns:
        id SERIAL PRIMARY KEY,
        item TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        spent_on DATE DEFAULT CURRENT_DATE
    `];

        const sqlQuery = await naturalToSql(userMessage,schemaDescription);
        console.log('Generated SQL Query:', sqlQuery);
        const result = await userClient.query(sqlQuery);
        console.log('Query Result:', result.rows);
        res.json(result.rows);
    
    }catch(error){
        console.error('Error processing request:', error);
        if(error.code==='42P01'){
            res.status(400).json({error:"No Relevant Data. Please enter some data."});
        }
    }
})
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})