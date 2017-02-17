import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import * as TeamController from '../controllers/team.controller';
import * as ChannelController from '../controllers/channel.controller';
import * as NotificationController from '../controllers/notifications.controller';
import * as CustomerController from '../controllers/customer.controller';
import * as ChatController from '../controllers/chat.controller';
import * as GroupController from '../controllers/group.controller';
import * as NewsController from '../controllers/news.controller';
import * as FbController from '../controllers/fbPages.controller';
import * as FbChatController from '../controllers/fbChat.controller';
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

const router = new Router();

// Login user
router.route('/getlogin').post(UserController.getlogin);
// signup user
router.route('/signupUser').post(UserController.signupUser);
router.route('/getuser').get(UserController.getuser);
router.route('/verifyaccount').get(UserController.verifyaccount);
router.route('/updatenews').post(NewsController.updatenews);
router.route('/forgotpassword').post(UserController.forgotpassword);
router.route('/updateprofile').post(UserController.updateprofile);
router.route('/updatesettings').post(UserController.updatesettings);
router.route('/changenewpassword').post(UserController.changenewpassword);
router.route('/getteams').get(TeamController.getteams);
router.route('/getgroups').get(GroupController.getgroups);
router.route('/createfbPage').post(FbController.createfbPage);
router.route('/editfbPage').post(FbController.editfbPage);
router.route('/getfbpages').get(FbController.getfbpages);
router.route('/getfbpage').get(FbController.getfbpage);
router.route('/getmyuserteams').get(TeamController.getmyuserteams);
router.route('/getcustomerteams').post(TeamController.getcustomerteams);
router.route('/getcustomersession').post(ChatController.getcustomersession);
router.route('/updatechatstatus').post(ChatController.updatechatstatus);
router.route('/getcustomerdetails').post(ChatController.getcustomerdetails);
router.route('/updatereschedule').post(ChatController.updatereschedule);
router.route('/createteam').post(TeamController.createteam);
router.route('/creategroup').post(GroupController.creategroup);
router.route('/deletefbpage').delete(FbController.deletefbpage);
router.route('/getTeam').get(TeamController.getTeam);
router.route('/getGroup').get(GroupController.getGroup);
router.route('/joinGroup').post(GroupController.joinGroup);
router.route('/deleteTeam').delete(TeamController.destroyTeam);
router.route('/deleteAgent').delete(UserController.deleteAgent);
router.route('/deleteGroup').delete(GroupController.destroyGroup);
router.route('/webhook').post(FbChatController.chatwebhook);
router.route('/webhook').get(FbChatController.verifyhook);


router.route('/getfbCustomers').get(FbChatController.getfbCustomers);
router.route('/getfbChats').get(FbChatController.getfbChats);

router.route('/getagents').get(UserController.getagents);
router.route('/deptagents').get(UserController.deptagents);
router.route('/groupagents').get(GroupController.groupagents);
router.route('/editgroup').post(GroupController.editgroup);

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
router.route('/getcustomerchannels').post(ChannelController.getcustomerchannels);

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
router.route('/resendNotification').post(NotificationController.resendNotification);

router.route('/getnotifications').get(NotificationController.getnotifications);
router.route('/deleteNotification').delete(NotificationController.destroyNotification);
router.route('/createCustomer').post(CustomerController.createCustomer);
router.route('/getCustomers').get(CustomerController.getcustomers);

router.route('/getCountryName').get(CustomerController.getCountryName);

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
router.route('/createnews').post(NewsController.createNews);
router.route('/getnews').post(NewsController.getnews);

router.route('/getchat').post(ChatController.getChatMessage);
router.route('/getchatfromagent').post(ChatController.getchatfromagent);
router.route('/downloadchatfile').post(ChatController.downloadchatfile);

router.post('/uploadchatfile', multipartyMiddleware, ChatController.uploadchatfile);
router.post('/uploadchatfileAgent', multipartyMiddleware, ChatController.uploadchatfileAgent);

export default router;
