import pg from "pg";

const pool=new pg.Pool({

    user:"postgres",
    password:"Sharma@19",
    port:5432,
    host:"localhost",
    database:"taskmanagement"
});
export default pool;