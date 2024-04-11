import pool from "../utils/db.js";
import jwt from 'jsonwebtoken'

export async function userAuth(email, password_hash) {

    try{
        const [row] = await pool.query(`
      SELECT * FROM users WHERE email = ? AND password = ?
    `, [email, password_hash]);

        if (row.length === 0) {
            return "Invalid data";
        }
        const user_id = row[0].user_id;
        const user_email = row[0].email;
        const username = row[0].username;
        return generateAuthToken(user_id, user_email, username);
    }
    catch(error){
        return error.message;
    }
   
}

function generateAuthToken(user_id, email, username) {
    const payload = { username, user_id, email };
    const options = { expiresIn: '3h' };
    return jwt.sign(payload, process.env.SECRET_KEY, options);
  }