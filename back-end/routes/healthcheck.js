import express from 'express';


import pool from "../utils/db.js";

const router = express.Router();

router.get('/healthcheck', async (req, res) => {

    try {
        // Acquire a connection from the pool
        const connection = await pool.getConnection();
    
        // Check if the connection is actually alive
        await connection.ping();
    
        // Release the connection back to the pool
        connection.release();
    
        // Indicate success
        res.status(200).send("Database connection is healthy");
      } catch (error) {
        // Log the error for debugging
        console.error("Health check failed:", error);
    
        // Indicate failure
        res.status(500).send("Database connection is unavailable");
      }
    
});

export default router;