import { Router } from 'express';
import { ProducersController } from '../controllers/producers.controller';

const router = Router();
const producersController = new ProducersController();

router.get('/intervals', (req, res) => producersController.getIntervals(req, res));

export default router;
