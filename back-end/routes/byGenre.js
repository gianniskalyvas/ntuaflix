import express from 'express';

import { getTitle, searchTitle, byGenre } from '../controllers/title.js';

const router = express.Router();

router.post("/", async (req, res) => {
    let genre = req.query.qgenre;
    let rating = req.query.minrating;
    let yrFrom = req.query.yrFrom;
    let yrTo = req.query.yrTo;

    let titleIDs

    if(yrFrom !== undefined && yrTo !== undefined){
        titleIDs = await byGenre(genre, parseFloat(rating), parseInt(yrFrom), parseInt(yrTo));
    }
    else{
        titleIDs = await byGenre(genre, parseFloat(rating), -1, -1);
    }

    let titles_list = [];

    for (let i = 0; i < titleIDs.length; i++) {
        let titleID = titleIDs[i];
        let title = await getTitle(titleID);
        titles_list.push(title);              
    }

    if(titles_list.length == 0) {
        res.status(204).send("No titles that fit creteria");
    }
    else{      
      res.send(titles_list);
    }

  })

router.get("/", async (req, res) => {
    let genre = req.body.qgenre;
    let rating = req.body.minrating;
    let yrFrom = req.body.yrFrom;
    let yrTo = req.body.yrTo;

    let titleIDs

    if(yrFrom !== undefined && yrTo !== undefined){
        titleIDs = await byGenre(genre, parseFloat(rating), parseInt(yrFrom), parseInt(yrTo));
    }
    else{
        titleIDs = await byGenre(genre, parseFloat(rating), -1, -1);
    }

    let titles_list = [];

    for (let i = 0; i < titleIDs.length; i++) {
        let titleID = titleIDs[i];
        let title = await getTitle(titleID);
        titles_list.push(title);              
    }

    if(titles_list.length == 0) {
        res.status(204).send("No titles that fit creteria");
    }
    else{      
      res.send(titles_list);
    }

  })

export default router;