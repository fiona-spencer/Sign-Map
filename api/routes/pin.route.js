import express from 'express';

import {
    test,
    createPin,
    deletePin,
    getPins,
    updatePinStatus,
} from '../controllers/pin.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/createPin', verifyToken, createPin);
router.post('/deletePin', verifyToken, deletePin);
router.get('/getPins', getPins);
// Route for updating a pin's status
router.put('/updatePin/:pinId', verifyToken, updatePinStatus);

export default router;

