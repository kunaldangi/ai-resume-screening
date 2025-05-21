import express from 'express';

import upload from '../../utils/multer';
import singleResume from "./single";

const router = express.Router();

router.post("/single", upload.single('resume'), singleResume);
// router.get("/multi", );

export default router;