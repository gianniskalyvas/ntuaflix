import express from 'express';

import { addUser, deleteUser } from '../controllers/users.js';

const router = express.Router();

router.post('/adduser', async (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password_hash = req.body.password_hash;
    let isAdmin = req.body.isAdmin;

    let response = await addUser(username, email, password_hash, isAdmin);

    if(response !== "User added!"){
        return res.status(400).send(response);
    }
    else{
    res.send(response);
    }      
  
  });

router.delete('/deleteuser', async (req, res) => {
    let username = req.body.username;
    let response = await deleteUser(username);

    if(response !== "User deleted!"){
        return res.status(400).send(response);
    }
    else{
    res.send(response);
    }   
  
  });

  export default router;
