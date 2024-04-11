import express from 'express';

import { getUserLikes, getTitleLikes, userLiked, userUnliked, userLikesMovie} from '../controllers/user_likes.js';

const router = express.Router();

router.get('/getUserLikes/:id', async (req, res) => {
    const user_id = req.params.id; 
    
    let response = await getUserLikes(user_id);

    res.send(response);
  
  });

router.get('/getTitleLikes/:id', async (req, res) => {
    const title_id = req.params.id;
    
    let response = await getTitleLikes(title_id);

    res.send(response);
  
});

router.get('/userlikesmovie/:user_id/:title_id', async (req, res) => {
  const title_id = req.params.title_id;
  const user_id = req.params.user_id;
  
  let response = String(await userLikesMovie(user_id, title_id));

  res.send(response);

});

router.post('/userliked', async (req, res) => {
    const title_id = req.body.title_id;
    const user_id = req.body.user_id;

    let response = await userLiked(user_id, title_id);

    res.send(response);
    
});
  
router.post('/userunliked', async (req, res) => {
    const title_id = req.body.title_id;
    const user_id = req.body.user_id;

    let response = await userUnliked(user_id, title_id);

    res.send(response);
    
  
  });


  export default router;
