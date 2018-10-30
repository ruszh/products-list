import express from 'express';
const router = express.Router();
import { save } from '../list';

router.post('/save', save);

export default router;