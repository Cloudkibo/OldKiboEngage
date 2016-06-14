import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import * as GroupController from '../controllers/group.controller';
import * as ChannelController from '../controllers/channel.controller';

const router = new Router();

// Login user
router.route('/getlogin').post(UserController.getlogin);
// signup user
router.route('/signupUser').post(UserController.signupUser);
router.route('/getuser').get(UserController.getuser);


router.route('/getgroups').get(GroupController.getgroups);
router.route('/creategroup').post(GroupController.creategroup);

router.route('/getGroup').get(GroupController.getGroup);
router.route('/deleteGroup').delete(GroupController.destroyGroup);
router.route('/deleteAgent').delete(UserController.deleteAgent);
router.route('/getagents').get(UserController.getagents);
router.route('/deptagents').get(UserController.deptagents);
router.route('/editgroup').post(GroupController.editgroup);
router.route('/editagent').post(UserController.editagent);
router.route('/inviteAgent').post(UserController.inviteAgent);
router.route('/invitetoken').get(UserController.invitetoken);
router.route('/verifytoken').get(UserController.verifytoken);

router.route('/createChannel').post(ChannelController.createChannel);
router.route('/editChannel').post(ChannelController.editChannel);
router.route('/getchannels').get(ChannelController.getchannels);
router.route('/deleteChannel').delete(ChannelController.destroyChannel);

router.route('/createResponse').post(UserController.createResponse);
router.route('/editResponse').post(UserController.editResponse);
router.route('/getresponses').get(UserController.getresponses);
router.route('/deleteResponse').delete(UserController.destroyResponse);


export default router;
