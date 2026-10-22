import { Router } from 'express';
import postRoutes from './post.routes.js';

const router = Router();

router.use('/posts', postRoutes);

export default router;
