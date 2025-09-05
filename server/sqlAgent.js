import model from "./agent.js";

export async function naturalToSql(userMessage,schema){
    const prompt = `
You are a SQL generator.
Schema:
${schema}
-First check if the table you are querying exists or not if it doesn't create it.
-below is example of table creation query
CREATE TABLE IF NOT EXISTS groceries (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      quantity INT DEFAULT 1,
      purchased_on DATE DEFAULT CURRENT_DATE
    );

-Tables have to be created in the database before you can use them.If the table already exists don't create it again.
-Schema are for multiple tables.
-If the user doesn't specify a table, choose the most relevant one based on the request.
-i have specified 3 tables groceries,tasks,expenses for most common requests for other requests create on your own.

-Columns are the fields in the table.
-Use the columns that are relevant to the user's request.
-If the user doesn't specify a column, choose the most relevant one based on the request.
-Generate a valid SQL query based on the user's request.
-If the request is ambiguous, generate the most reasonable SQL query.
-when asked for showing expenses also return the total amount spent along with the expense table.
Rules:
- Always output a valid SQL query for PostgreSQL.
- Do not output explanations, comments, or markdown.
- For "add" or "insert" requests,first check if table you are querying exists or not if it doesn't create it, generate an INSERT with an 
ON CONFLICT (name) DO UPDATE SET quantity = table_name.quantity + EXCLUDED.quantity clause. Always include RETURNING *;.
- For "update" requests → generate UPDATE with RETURNING *.
- For "delete" requests → generate DELETE with RETURNING *.
- For "list", "show", "get" requests → generate SELECT.
- NEVER just output "SELECT *" unless the user explicitly asks for all rows.
-Check if the item asked to add exists before inserting it , if it exists then update it's quantity don't add it.


User: "${userMessage}"
SQL:
`;
const response = await model.invoke([{
    role: "user",
    content: prompt
}])
let sql = response.content.trim();

  
  sql = sql.replace(/```sql|```/g, "").trim();

  return sql;
}