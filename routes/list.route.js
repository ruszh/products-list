import express from 'express';
const router = express.Router();
import { save, load, getList } from '../list';

router.post('/save', save);
router.post('/load', load);
router.post('/get', getList);

export default router;