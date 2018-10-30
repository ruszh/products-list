import express from 'express';
const router = express.Router();

import { signin, signup, verifyUser, getLists } from '../authentication';

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/verify', verifyUser);
router.get('/getlists', getLists);



export default router;