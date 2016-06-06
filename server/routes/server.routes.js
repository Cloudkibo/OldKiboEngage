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
router.route('/deleteAgent').delete(UserController.deleteAgent);
router.route('/getagents').get(UserController.getagents);
router.route('/deptagents').get(UserController.deptagents);
router.route('/editgroup').post(UserController.editgroup);
router.route('/editagent').post(UserController.editagent);
router.route('/inviteAgent').post(UserController.inviteAgent);
router.route('/invitetoken').get(UserController.invitetoken);
router.route('/verifytoken').get(UserController.verifytoken);

router.route('/createChannel').post(UserController.createChannel);
router.route('/editChannel').post(UserController.editChannel);
router.route('/getchannels').get(UserController.getchannels);
router.route('/deleteChannel').delete(UserController.destroyChannel);



router.route('/createResponse').post(UserController.createResponse);
router.route('/editResponse').post(UserController.editResponse);
router.route('/getresponses').get(UserController.getresponses);
router.route('/deleteResponse').delete(UserController.destroyResponse);


export default router;
