import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import * as TeamController from '../controllers/team.controller';
import * as Subgroupcontroller from '../controllers/subgroup.controller';
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

/** chat group routes **/
router.route('/getteams').get(TeamController.getteams);
router.route('/createteam').post(TeamController.createteam);
router.route('/getTeam').get(TeamController.getTeam);
router.route('/joinTeam').post(TeamController.joinTeam);
router.route('/deleteTeam').delete(TeamController.destroyTeam);
router.route('/editteam').post(TeamController.editteam);
router.route('/teamagents').get(TeamController.teamagents);
router.route('/getinvitedagents').get(UserController.getinvitedagents);



// Login user
router.route('/getlogin').post(UserController.getlogin);
// signup user
router.route('/signupUser').post(UserController.signupUser);
router.route('/getuser').get(UserController.getuser);
router.route('/verifyaccount').get(UserController.verifyaccount);
router.route('/updatenews').post(NewsController.updatenews);
router.route('/forgotpassword').post(UserController.forgotpassword);
router.route('/updateprofile').post(UserController.updateprofile);
router.route('/changenewpassword').post(UserController.changenewpassword);
router.route('/getgroups').get(GroupController.getgroups);

router.route('/createfbPage').post(FbController.createfbPage);
router.route('/editfbPage').post(FbController.editfbPage);
router.route('/getfbpages').get(FbController.getfbpages);
router.route('/getfbpage').get(FbController.getfbpage);
router.route('/getmyusergroups').get(GroupController.getmyusergroups);
router.route('/getcustomergroups').post(GroupController.getcustomergroups);
router.route('/getcustomersession').post(ChatController.getcustomersession);
router.route('/updatechatstatus').post(ChatController.updatechatstatus);
router.route('/getcustomerdetails').post(ChatController.getcustomerdetails);
router.route('/updatereschedule').post(ChatController.updatereschedule);
router.route('/creategroup').post(GroupController.creategroup);
router.route('/deletefbpage').delete(FbController.deletefbpage);
router.route('/getGroup').get(GroupController.getGroup);
router.route('/deleteGroup').delete(GroupController.destroyGroup);
router.route('/deleteAgent').delete(UserController.deleteAgent);
router.route('/webhook').post(FbChatController.chatwebhook);
router.route('/webhook').get(FbChatController.verifyhook);

router.route('/sendfbchat').post(FbChatController.sendTextMessage);

router.route('/getfbCustomers').get(FbChatController.getfbCustomers);
router.route('/getfbSessions').get(FbChatController.getfbSessions);
router.route('/getfbChats').get(FbChatController.getfbChats);
router.route('/assignToAgentFB').post(FbChatController.assignToAgentFB);
router.route('/resolvechatsessionfb').post(FbChatController.resolvechatsessionfb);
router.route('/getagents').get(UserController.getagents);
router.route('/deptagents').get(UserController.deptagents);

router.route('/editgroup').post(GroupController.editgroup);
router.route('/editagent').post(UserController.editagent);
router.route('/inviteAgent').post(UserController.inviteAgent);
router.route('/invitetoken').get(UserController.invitetoken);
router.route('/verifytoken').get(UserController.verifytoken);
router.route('/verifypasswordResettoken').get(UserController.verifypasswordResettoken);
router.route('/changepassword').post(UserController.changepassword);
router.route('/createSubgroup').post(Subgroupcontroller.createSubgroup);
router.route('/editSubgroup').post(Subgroupcontroller.editSubgroup);
router.route('/getsubgroups').get(Subgroupcontroller.getsubgroups);
router.route('/getcustomersubgroups').post(Subgroupcontroller.getcustomersubgroups);

router.route('/getsubgroupwisecalls').post(Subgroupcontroller.getsubgroupwisecalls);
router.route('/getplatformwisecalls').get(Subgroupcontroller.getplatformwisecalls);
router.route('/getdeptwisecalls').get(Subgroupcontroller.getdeptwisecalls);
router.route('/getpagewisecalls').get(Subgroupcontroller.getpagewisecalls);
router.route('/getcountrywisecalls').get(Subgroupcontroller.getcountrywisecalls);
router.route('/getmobilecalls').get(Subgroupcontroller.getmobilecalls);

router.route('/gettopcustomers').get(Subgroupcontroller.gettopcustomers);
router.route('/getagentwisecalls').get(Subgroupcontroller.getagentwisecalls);
router.route('/getagentnotifications').get(Subgroupcontroller.getagentnotifications);

router.route('/deleteSubgroup').delete(Subgroupcontroller.destroySubgroup);

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
router.route('/getcompanylogo').post(UserController.getcompanylogo);
router.post('/uploadchatfile', multipartyMiddleware, ChatController.uploadchatfile);
router.post('/uploadchatfileAgent', multipartyMiddleware, ChatController.uploadchatfileAgent);
router.post('/uploadchatfilefb',multipartyMiddleware, FbChatController.uploadchatfilefb);
router.post('/updatesettings',multipartyMiddleware, UserController.updatesettings);

export default router;
