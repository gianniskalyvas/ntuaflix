import pool from "../utils/db.js";

export async function addUser(username, email, password_hash, isAdmin) {

    try{
        const response = await pool.query(`
      INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)
    `, [username, email, password_hash, isAdmin]);

        return "User added!"
    }
    catch(error){
        return error.message;
    }
   
}

export async function deleteUser(username) {

    try{
        const response = await pool.query(`
      DELETE FROM users WHERE username = ?
    `, [username]);

    return "User deleted!";

    }
    catch(error){
        return error.message;
    }
    
}