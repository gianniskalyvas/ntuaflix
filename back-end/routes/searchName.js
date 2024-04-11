import express from 'express';

import { getName, searchName } from '../controllers/name.js';

const router = express.Router();

router.post("/", async (req, res) => {
  const str = req.query.namePart;
  const nameIDs = await searchName(str);
  if (nameIDs === undefined) {
    res.status(404).json({error: 'Not Found'});
  }

  let name_list = [];

  for (let i = 0; i < nameIDs.length; i++) {
      let nameID = nameIDs[i];
      let name = await getName(nameID);
      name_list.push(name);              
  }

  if(name_list.length == 0) {
    res.status(204).send("No name found");
  }
  else{
    res.send(name_list);
  }
  
})

router.get("/", async (req, res) => {
    const str = req.body.namePart;
    const nameIDs = await searchName(str);
    if (nameIDs === undefined) {
      res.status(404).json({error: 'Not Found'});
    }

    let name_list = [];

    for (let i = 0; i < nameIDs.length; i++) {
        let nameID = nameIDs[i];
        let name = await getName(nameID);
        name_list.push(name);              
    }

    if(name_list.length == 0) {
      res.status(204).send("No name found");
    }
    else{
      res.send(name_list);
    }
    
})

export default router;