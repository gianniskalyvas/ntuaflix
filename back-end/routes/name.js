import express from 'express';

import { getName } from '../controllers/name.js';

const router = express.Router();

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const name = await getName(id);
    if (name === undefined) {
      res.status(204).send("No name with this id available");
    }
    else{
    res.send(name);
    }
  })

export default router;