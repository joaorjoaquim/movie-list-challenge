import { Router } from 'express';
import producersRoutes from './producers.routes';

const router = Router();

router.use('/producers', producersRoutes);

export default router;
