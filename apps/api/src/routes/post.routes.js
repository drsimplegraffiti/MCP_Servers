import { Router } from 'express';
import * as postController from '../controllers/post.controller.js';
import commentRoutes from './comment.routes.js';

const router = Router();

router.post('/', postController.create);
router.get('/', postController.list);
router.get('/:id', postController.get);
router.put('/:id', postController.update);
router.delete('/:id', postController.remove);

router.use('/:id/comments', commentRoutes);

export default router;
