import express from 'express';
import { handleLogin, handleSignup } from '../controller/authController.js';
const router = express.Router();

// Define routes
router.post('/sign-up', handleSignup);
router.post('/login', handleLogin);

// Export router
export default router;
