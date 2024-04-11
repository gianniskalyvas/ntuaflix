import express from 'express';

import { getTitle, searchTitle } from '../controllers/title.js';

const router = express.Router();

router.post("/", async (req, res) => {
  const str = req.query.titlePart;
  const titleIDs = await searchTitle(str);
  
  let title_list = [];

  for (let i = 0; i < titleIDs.length; i++) {
      let titleID = titleIDs[i];
      let title = await getTitle(titleID);
      title_list.push(title);              
  }

  if(title_list.length == 0) {
    res.status(204).send("No title found");
  }
  else{
    res.send(title_list);
  }
  
})

router.get("/", async (req, res) => {
    const str = req.body.titlePart;
    const titleIDs = await searchTitle(str);
    
    let title_list = [];

    for (let i = 0; i < titleIDs.length; i++) {
        let titleID = titleIDs[i];
        let title = await getTitle(titleID);
        title_list.push(title);              
    }

    if(title_list.length == 0) {
      res.status(204).send("No title found");
    }
    else{
      res.send(title_list);
    }
    
  })

export default router;