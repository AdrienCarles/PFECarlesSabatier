import express from 'express';
import parentController from '../controllers/parentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/children', authMiddleware, parentController.getChildrenOfParent);

export default router;
