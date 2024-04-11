import pool from "../utils/db.js";

import { getTitle } from "./title.js";

export async function getUserLikes(id) {

    try{
        const [rows] = await pool.query(`
      SELECT * from users_likes_title WHERE users_user_id = ?
    `, [id]);

    let title_IDs = [];

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];

        let title_obj = await getTitle(row.title_basics_title_id);

        title_IDs.push(title_obj);
    }

    return title_IDs;
    }
    catch(error){
        return error.message;
    }
   
}

export async function getTitleLikes(id) {

    try{
        const [rows] = await pool.query(`
      SELECT * from users_likes_title WHERE title_basics_title_id = ?
    `, [id]);

    let user_IDs = [];

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        user_IDs.push(row.users_user_id);
    }

    return user_IDs;

    }
    catch(error){
        return error.message;
    }
    
}

export async function userLiked(user_id, title_id) {

    try{
        const response = await pool.query(`
      INSERT INTO users_likes_title (users_user_id, title_basics_title_id) VALUES (?, ?)
    `, [user_id, title_id]);

    return "User liked succesfully!"

    }
    catch(error){
        return error.message;
    }
    
}

export async function userUnliked(user_id, title_id) {

    try{
        const response = await pool.query(`
      DELETE FROM users_likes_title WHERE users_user_id = ? AND title_basics_title_id = ?
    `, [user_id, title_id]);

    return "User unliked succesfully!"

    }
    catch(error){
        return error.message;
    }
    
}

export async function userLikesMovie(user_id, title_id) {

    try{
        const [rows] = await pool.query(`
      SELECT * from users_likes_title WHERE title_basics_title_id = ? AND users_user_id = ?
    `, [title_id, user_id]);


    return rows.length;

    }
    catch(error){
        return error.message;
    }
   
    
}