import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import * as TeamController from '../controllers/team.controller';
import * as ChannelController from '../controllers/channel.controller';
import * as NotificationController from '../controllers/notifications.controller';
import * as CustomerController from '../controllers/customer.controller';
import * as ChatController from '../controllers/chat.controller';
import * as GroupController from '../controllers/group.controller';


const router = new Router();

// Login user
router.route('/getlogin').post(UserController.getlogin);
// signup user
router.route('/signupUser').post(UserController.signupUser);
router.route('/getuser').get(UserController.getuser);
router.route('/verifyaccount').get(UserController.verifyaccount);

router.route('/forgotpassword').post(UserController.forgotpassword);
router.route('/updateprofile').post(UserController.updateprofile);
router.route('/updatesettings').post(UserController.updatesettings);
router.route('/changenewpassword').post(UserController.changenewpassword);
router.route('/getteams').get(TeamController.getteams);
router.route('/getmyuserteams').get(TeamController.getmyuserteams);
router.route('/getcustomerteams').get(TeamController.getcustomerteams);
router.route('/getcustomersession').post(ChatController.getcustomersession);
router.route('/getcustomerdetails').post(ChatController.getcustomerdetails);
router.route('/updatereschedule').post(ChatController.updatereschedule);
router.route('/createteam').post(TeamController.createteam);
router.route('/creategroup').post(GroupController.creategroup);

router.route('/getTeam').get(TeamController.getTeam);
router.route('/deleteTeam').delete(TeamController.destroyTeam);
router.route('/deleteAgent').delete(UserController.deleteAgent);
router.route('/getagents').get(UserController.getagents);
router.route('/deptagents').get(UserController.deptagents);
router.route('/editteam').post(TeamController.editteam);
router.route('/editagent').post(UserController.editagent);
router.route('/inviteAgent').post(UserController.inviteAgent);
router.route('/invitetoken').get(UserController.invitetoken);
router.route('/verifytoken').get(UserController.verifytoken);
router.route('/verifypasswordResettoken').get(UserController.verifypasswordResettoken);
router.route('/changepassword').post(UserController.changepassword);
router.route('/createChannel').post(ChannelController.createChannel);
router.route('/editChannel').post(ChannelController.editChannel);
router.route('/getchannels').get(ChannelController.getchannels);
router.route('/getcustomerchannels').get(ChannelController.getcustomerchannels);

router.route('/getchannelwisecalls').post(ChannelController.getchannelwisecalls);
router.route('/getplatformwisecalls').get(ChannelController.getplatformwisecalls);
router.route('/getdeptwisecalls').get(ChannelController.getdeptwisecalls);
router.route('/getpagewisecalls').get(ChannelController.getpagewisecalls);
router.route('/getcountrywisecalls').get(ChannelController.getcountrywisecalls);
router.route('/getmobilecalls').get(ChannelController.getmobilecalls);

router.route('/gettopcustomers').get(ChannelController.gettopcustomers);
router.route('/getagentwisecalls').get(ChannelController.getagentwisecalls);
router.route('/getagentnotifications').get(ChannelController.getagentnotifications);

router.route('/deleteChannel').delete(ChannelController.destroyChannel);

router.route('/createResponse').post(UserController.createResponse);
router.route('/uploadpicture').post(UserController.uploadpicture);

router.route('/editResponse').post(UserController.editResponse);
router.route('/getresponses').get(UserController.getresponses);
router.route('/deleteResponse').delete(UserController.destroyResponse);


router.route('/createNotification').post(NotificationController.createNotification);
router.route('/getnotifications').get(NotificationController.getnotifications);
router.route('/deleteNotification').delete(NotificationController.destroyNotification);
router.route('/createCustomer').post(CustomerController.createCustomer);
router.route('/getCustomers').get(CustomerController.getcustomers);
router.route('/emailCustomer').post(CustomerController.emailCustomer);
router.route('/rescheduleEmail').post(CustomerController.rescheduleEmail);

router.route('/createsession').post(ChatController.createsession);
router.route('/savechat').post(ChatController.savechat);
router.route('/getsessions').get(ChatController.getsessions);
router.route('/getcompanyprofile').get(UserController.getcompanyprofile);
router.route('/updateStatus').post(ChatController.updateStatus);
router.route('/assignToAgent').post(ChatController.assignToAgent);
router.route('/movedToMessageChannel').post(ChatController.movedToMessageChannel);

router.route('/getuserchats').get(ChatController.getuserchats);
router.route('/getspecificuserchats').post(ChatController.getspecificuserchats);
router.route('/resolvechatsession').post(ChatController.resolvechatsession);
router.route('/pickchatsession').post(ChatController.pickchatsession);
export default router;
