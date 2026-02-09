import express from 'express';
const router = express.Router();
import accessRoutes from './access';
import buildingRouter from './building';
import bookingRequestRoutes from './bookingRequest';

router.use('/v1/api', accessRoutes);
router.use('/v1/api', bookingRequestRoutes);
router.use('/v1/api', accessRoutes);
router.use('/v1/api', buildingRouter);
export default router;
