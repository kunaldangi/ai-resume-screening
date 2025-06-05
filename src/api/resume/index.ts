import express from 'express';

import upload from '../../utils/multer';
import singleResume from "./single";
import multiResume from './multi';

const router = express.Router();

router.post("/single", upload.single('resume'), singleResume);
router.post("/multi", upload.single('resume'), multiResume);

export default router;