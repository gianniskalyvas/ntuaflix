import express from 'express';

import { userAuth } from '../controllers/auth.js';

const router = express.Router();


router.post('/', async (req, res) => {
    const user_email = req.body.email;
    const password_hash = req.body.password_hash;

    let response = await userAuth(user_email, password_hash);

    res.send(response);
  
  });

export default router;
  

