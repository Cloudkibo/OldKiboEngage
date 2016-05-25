import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
const router = new Router();

// Login user
router.route('/getlogin').post(UserController.getlogin);
// signup user
router.route('/signupUser').post(UserController.signupUser);
router.route('/getuser').get(UserController.getuser);


router.route('/getgroups').get(UserController.getgroups);
router.route('/creategroup').post(UserController.creategroup);
// Get one group by id
router.route('/getGroup').get(UserController.getGroup);
router.route('/deleteGroup').delete(UserController.destroyGroup);
router.route('/deptagent').get(UserController.deptagent);

export default router;
