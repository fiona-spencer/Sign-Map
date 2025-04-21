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
router.put('/updatereport/:reportId/:userId', verifyToken, updatePinStatus);

export default router;