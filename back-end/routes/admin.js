import express, { response } from 'express';
import multer from 'multer';

import {uploadTitle_basics, uploadName_basics, uploadTitle_akas, uploadTitle_crew, uploadTitle_episode, uploadTitle_principals, uploadTitle_ratings} from '../controllers/uploads.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/titlebasics', upload.single('file'), async (req, res) => {
  const fileBuffer = req.file.buffer;

  const tsvData = fileBuffer.toString('utf8');

  const rows = tsvData.split('\n');

  let response;

  for (let i = 1; i < rows.length -1 ; i++) {
    const row = rows[i].split('\t');

    response = await uploadTitle_basics(row);
    if(response !== "Queries completed"){
      return res.status(400).send(response);
    }
  }
  
  res.send(response);  

});

router.post('/namebasics', upload.single('file'), async (req, res) => {
  const fileBuffer = req.file.buffer;

  const tsvData = fileBuffer.toString('utf8');

  const rows = tsvData.split('\n');

  let response;

  for (let i = 1; i < rows.length -1 ; i++) {
    const row = rows[i].split('\t');
    
    response = await uploadName_basics(row);
    if(response !== "Queries completed"){
      return res.status(400).send(response);
    }
  }
  
  res.send(response);  

});

router.post('/titleakas', upload.single('file'), async (req, res) => {
  const fileBuffer = req.file.buffer;

  const tsvData = fileBuffer.toString('utf8');

  const rows = tsvData.split('\n');

  let response;

  for (let i = 1; i < rows.length -1 ; i++) {
    const row = rows[i].split('\t');

    
    response = await uploadTitle_akas(row);
    if(response !== "Queries completed"){
      return res.status(400).send(response);
    }
  }
  
  res.send(response);  

});

router.post('/titlecrew', upload.single('file'), async (req, res) => {
  const fileBuffer = req.file.buffer;

  const tsvData = fileBuffer.toString('utf8');

  const rows = tsvData.split('\n');

  let response;

  for (let i = 1; i < rows.length -1 ; i++) {
    const row = rows[i].split('\t');
    
    response = await uploadTitle_crew(row);
    if(response !== "Queries completed"){
      return res.status(400).send(response);
    }
  }
  
  res.send(response);  

});

router.post('/titleepisode', upload.single('file'), async (req, res) => {
  const fileBuffer = req.file.buffer;

  const tsvData = fileBuffer.toString('utf8');

  const rows = tsvData.split('\n');

  let response;

  for (let i = 1; i < rows.length -1 ; i++) {
    const row = rows[i].split('\t');
    
    response = await uploadTitle_episode(row);
    if(response !== "Queries completed"){
      return res.status(400).send(response);
    }
  }
  
  res.send(response);  

});

router.post('/titleprincipals', upload.single('file'), async (req, res) => {
  const fileBuffer = req.file.buffer;

  const tsvData = fileBuffer.toString('utf8');

  const rows = tsvData.split('\n');

  let response;

  for (let i = 1; i < rows.length -1 ; i++) {
    const row = rows[i].split('\t');
    
    response = await uploadTitle_principals(row);
    if(response !== "Queries completed"){
      return res.status(400).send(response);
    }
  }
  
  res.send(response);  

});

router.post('/titleratings', upload.single('file'), async (req, res) => {
  const fileBuffer = req.file.buffer;

  const tsvData = fileBuffer.toString('utf8');

  const rows = tsvData.split('\n');

  let response;

  for (let i = 1; i < rows.length -1 ; i++) {
    const row = rows[i].split('\t');
    
    response = await uploadTitle_ratings(row);
    if(response !== "Queries completed"){
      return res.status(400).send(response);
    }
  }
  
  res.send(response);  

});



export default router;
