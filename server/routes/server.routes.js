import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
const router = new Router();

// Login user
router.route('/getlogin').get(UserController.getlogin);
// signup user
router.route('/signupUser').post(UserController.signupUser);

export default router;
