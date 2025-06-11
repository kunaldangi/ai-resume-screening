import express from 'express';

import info from './info';

const router = express.Router();

router.get("/info", info);

export default router;