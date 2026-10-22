import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';

const router = Router({ mergeParams: true });

router.post('/', commentController.create);
router.get('/', commentController.list);

export default router;
