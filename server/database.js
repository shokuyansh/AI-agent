import { Client } from "pg"; 
export async function createUserDB(userId){
    const client = new Client({
    host:'localhost',
    user:'postgres',
    port:5432,
    password:'rootUser',
    database:'postgres' 
    })
    await client.connect();
    const dbName = `user_${userId}`;
    try{
        await client.query(`CREATE DATABASE ${dbName} WITH OWNER postgres;`)
    }catch(err){
        if(err.code==='42P04'){
            console.log(`Database ${dbName} already exists.`);
        }
        else{
            console.error('Error creating database:', err);
        }
    }
    await client.end();

    const userClient = new Client({
        host:'localhost',
        user: 'postgres',
        port:5432,
        password: 'rootUser',
        database: dbName
    });
    await userClient.connect();

    return userClient;
}
