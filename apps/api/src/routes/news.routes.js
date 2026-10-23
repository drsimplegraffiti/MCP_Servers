import { Router } from 'express';
import * as newsController from '../controllers/news.controller.js';
import commentRoutes from './comment.routes.js';

const router = Router();

router.post('/', newsController.create);
router.get('/', newsController.list);
router.get('/:id', newsController.get);
router.put('/:id', newsController.update);
router.delete('/:id', newsController.remove);

router.use('/:id/comments', commentRoutes);

export default router;
