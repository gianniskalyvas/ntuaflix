import express from 'express';

import fs from 'fs';

import path from 'path'


import pool from "../utils/db.js";

const router = express.Router();

router.post('/resetall', async (req, res) => {
    try {
      
  
      
      await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  
      
      const tablesToReset = ['name_basics', 'title_basics', 'genres', 'title_akas', 'knownFor', 'writers', 'directors', 'ratings', 'episodes', 'title_principals', 'primaryProfession'];
  
      
      for (const table of tablesToReset) {
        await pool.query(`DELETE FROM ${table}`); 
      }
  
      
      const currentFileUrl = import.meta.url;
      const currentDir = path.dirname(new URL(currentFileUrl).pathname);
      const scriptPath = path.join(currentDir, '../utils/sql_dump.sql');
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      const sqlQueries = scriptContent.split(';').filter(query => query.trim() !== '');
      

      for(let i = 0; i < sqlQueries.length; i++){
        await pool.query(sqlQueries[i]);        
      }

      const fileName = '../utils/prin_dump.tsv'; // Replace with your actual file name
      const filePath = path.join(currentDir, fileName);

      const tsvData = fs.readFileSync(filePath, 'utf-8');

      const rows = tsvData.split('\n');

      
      rows.forEach((row) => {
      const values = row.split('\t');

      
      const query = 'INSERT INTO title_principals (title_basics_title_id, name_id, ordering, category, job, characters, img_url) VALUES (?, ?, ?, ?, ?, ?, ?);'

      pool.query(query, values, (err, results) => {
        if (err) {
          console.error('Error inserting row into MySQL:', err);
        } else {
          console.log('Row inserted into MySQL:', results);
        }
      });
    });

      
  
      
      await pool.query('SET FOREIGN_KEY_CHECKS = 1');
  
      
  
      res.status(200).send('Database tables reset successfully.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error resetting database tables.');
    }
  });

export default router;