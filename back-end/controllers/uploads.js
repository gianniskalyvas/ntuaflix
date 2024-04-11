import pool from "../utils/db.js";

export async function uploadTitle_basics(data) {
    try{
        let list = [data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[9]];

        list = list.map(value => (value === "\\N" ? null : value));


        const q1 = await pool.query(`
        INSERT INTO title_basics (title_id, type, primaryTitle, originalTitle, isAdult, start_year, end_year, runtimeMinutes, img_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, list);

        const genres = data[8] != null ? data[8].split(',') : [];


        for(let i = 0; i < genres.length; i++) {
            const q1 = await pool.query(`
            INSERT INTO genres (title_basics_title_id, genre) VALUES (?, ?)
            `, [data[0], genres[i]]);                
        }

        return "Queries completed";
    }
    catch(error) {
        return error.message;
    }
}

export async function uploadName_basics(data) {
    try{
        let list = [data[0], data[1], data[2], data[3], data[6]];

        list = list.map(value => (value === "\\N" ? null : value));

        const q1 = await pool.query(`
        INSERT INTO name_basics (name_id, name, birth_year, death_year, img_url) VALUES (?, ?, ?, ?, ?)
        `, list);

        const professions = data[4] != null ? data[4].split(',') : [];


        for(let i = 0; i < professions.length; i++) {
            const q1 = await pool.query(`
            INSERT INTO primaryProfession (name_basics_name_id, profession) VALUES (?, ?)
            `, [data[0], professions[i]]);                
        }

        const titles = data[5] != null ? data[5].split(',') : [];


        for(let i = 0; i < titles.length; i++) {
            const q1 = await pool.query(`
            INSERT INTO knownFor (name_basics_name_id, title_id) VALUES (?, ?)
            `, [data[0], titles[i]]);                
        }

        return "Queries completed";
    }
    catch(error) {
        return error.message;
    }
}


export async function uploadTitle_akas(data) {
    try{
        data = data.map(value => (value === "\\N" ? null : value));

        const q1 = await pool.query(`
        INSERT INTO title_akas (title_basics_title_id, ordering, title, region, language, type, attributes, isOriginal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, data);

        return "Queries completed";
    }
    catch(error) {
        return error.message;
    }
}

export async function uploadTitle_crew(data) {
    try{
        data = data.map(value => (value === "\\N" ? null : value));

        

        let writers = data[2] != null ? data[2].split(',') : [];
        
        let directors = data[1] != null ? data[1].split(',') : [];
        
        

        for(let i = 0; i < writers.length; i++) {
            const q1 = await pool.query(`
            INSERT INTO writers (title_basics_title_id, name_id) VALUES (?, ?)
            `, [data[0], writers[i]]);                
        }

        for(let i = 0; i < directors.length; i++) {
            const q1 = await pool.query(`
            INSERT INTO directors (title_basics_title_id, name_id) VALUES (?, ?)
            `, [data[0], directors[i]]);                 
        }

        return "Queries completed";
    }
    catch(error) {
        return error.message;
    }
}

export async function uploadTitle_episode(data) {
    try{
        data = data.map(value => (value === "\\N" ? null : value));

        const q1 = await pool.query(`
        INSERT INTO episodes (title_basics_title_id, parent_id, season, episode_num) VALUES (?, ?, ?, ?)
        `, data);

        return "Queries completed";
    }
    catch(error) {
        return error.message;
    }
}

export async function uploadTitle_principals(data) {
    try{
        data = data.map(value => (value === "\\N" ? null : value));

        const q1 = await pool.query(`
        INSERT INTO title_principals (title_basics_title_id,  ordering, name_id, category, job, characters, img_url) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, data);

        return "Queries completed";
    }
    catch(error) {
        return error.message;
    }
}

export async function uploadTitle_ratings(data) {
    try{
        data = data.map(value => (value === "\\N" ? null : value));

        const q1 = await pool.query(`
        INSERT INTO ratings (title_basics_title_id, avg_rating, num_votes) VALUES (?, ?, ?)
        `, data);

        return "Queries completed";
    }
    catch(error) {
        return error.message;
    }
}