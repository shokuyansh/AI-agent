import express from 'express';
import { getDBClient } from './database.js';
import {naturalToSql} from './sqlAgent.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv';
const app=express();
const port=3000;

const corsOptions = {
  origin: process.env.FRONTEND_URL,
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
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 
        };
        res.cookie('userId',userId,cookieOptions);
        const {userMessage}=req.body;
        console.log('Received request:', req.body);
        console.log('userId:', userId);
        const userClient = await getDBClient(); 
        const schemaDescription = [`
            Table: groceries
            Columns:
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                quantity INT DEFAULT 1,
                purchased_on DATE DEFAULT CURRENT_DATE,
                UNIQUE(user_id, name)
        `, `
            Table: tasks
            Columns:
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                due_date DATE DEFAULT CURRENT_DATE
        `, `
            Table:expenses
            Columns:
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                item TEXT NOT NULL,
                amount NUMERIC NOT NULL,
                spent_on DATE DEFAULT CURRENT_DATE
        `, `
    Table: custom_lists
    Columns:
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        list_name TEXT NOT NULL,
        item_description TEXT NOT NULL,
        created_on DATE DEFAULT CURRENT_DATE
`];

        const sqlQuery = await naturalToSql(userMessage,userId,schemaDescription);
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