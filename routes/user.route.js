import express from 'express';
const router = express.Router();

import { signin, signup, verifyUser } from '../authentication';

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/verify', verifyUser);

export default router;