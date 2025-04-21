import express from 'express';
import {
    test,
    signin,
    signup,
    signout,
    googleAuth
} from '../controllers/auth.controller.js';

const router = express.Router();
router.get('/test', test);
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.post('/googleAuth', googleAuth);

export default router;
