import express from 'express';

import listForms from './list';
import { googleRedirect } from './connect';

const router = express.Router();

router.get("/", listForms);
router.get("/connect", googleRedirect);

export default router;