import express from 'express';

import { login } from './login';
import { register } from './register';
import { googleRedirect } from './google';
import { googleAuthorize } from './google/authorize';

const router = express.Router();

router.get("/google", googleRedirect);
router.get("/google/authorize", googleAuthorize);
router.post("/login", login);
router.post("/register", register);

export default router;