import { Router } from 'express';
import { MainController } from '../controllers/mainController';

const router = Router();

// Admin Routes
router.post('/admin/doctors', MainController.createDoctor);
router.post('/admin/slots', MainController.createSlot);

// Public Routes
router.get('/doctors', MainController.getDoctors);
router.get('/doctors/:doctorId/slots', MainController.getSlots);
router.post('/book', MainController.bookSlot);

export default router;
