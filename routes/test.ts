import { Router } from 'express';
import TestController from '../controllers/TestController';

const router = Router();
const testController = new TestController();

router.post('/', testController.uploadMiddleware());

export default router;
