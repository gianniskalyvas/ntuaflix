import express from 'express';

import { getTitle } from '../controllers/title.js';

const router = express.Router();

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const title = await getTitle(id);
    if (title === undefined) {
      res.status(204).send("No title with this id available");
    }
    else{
      res.send(title);
    }
  })

export default router;