import { combineReducers } from 'redux'
import * as ActionTypes from '../constants/constants';
import { push } from 'react-router-redux';
import store from '../store/configureStore'
const initialState = { signupwarnings: {},userdetails : {}};
const dashboardState = { userdetails : {},teamdetails:[]};
const widgetState ={teamdetails:[],channels:[]}
const signup = (state =initialState, action) => {
  switch (action.type) {

   case ActionTypes.ADD_WARNINGS:
          return{
            inviteDetails : state.inviteDetails,
            signupwarnings:action.signup,
          };

   case ActionTypes.JOIN_COMPANY:
      return {
        inviteDetails : action.inviteDetails,

        };
    default:
      return state;
  }
};

const dashboard = (state =dashboardState, action) => {
  switch (action.type) {

  case ActionTypes.ADD_SELECTED_TEAM :
      var agentid =[];
      if(state.deptagents)
      {
      state.deptagents.filter((agent) => agent.deptid == action.team._id).map((agent, i)=> (
                          state.agents.filter((ag) => ag._id == agent.agentid).map((ag,j) =>
                          (
                             agentid.push({"_id" :ag._id})
                          ))
                          ));
       };

      return {
        ...state,
        team: action.team,
        newagents:agentid,
       

      };

      case ActionTypes.ADD_SELECTED_GROUP :
      var agentid =[];
      if(state.groupagents)
      {
      state.groupagents.filter((agent) => agent.groupid == action.group._id).map((agent, i)=> (
                          state.agents.filter((ag) => ag._id == agent.agentid).map((ag,j) =>
                          (
                             agentid.push({"_id" :ag._id})
                          ))
                          ));
       };

      return {
        ...state,
        group: action.group,
        newagents:agentid,
        

      };

      case ActionTypes.ADD_SELECTED_PAGE :
      return {
      

        ...state,
        fbpage:action.fbpage,

      };


   case ActionTypes.ADD_SELECTED_AGENT :
      return {
        ...state,
        agent: state.agents.filter((agent) => agent._id == action.id),
        
      };

    case ActionTypes.ADD_SELECTED_CHANNEL :
      return {
       ...state,
        channel: state.channels.filter((channel) => channel._id == action.id),
       
      };
    case ActionTypes.ADD_SELECTED_RESPONSE :
      return {
       ...state,
        response: state.responses.filter((response) => response._id == action.id),
      
      };
   case ActionTypes.ADD_USER_DETAILS:
          console.log(action.user.firstname)
          return{
            ...state,
             userdetails:action.user,
             errorMessage:action.chat_error,
            

    };
   case ActionTypes.ADD_AGENTS:
          console.log(action.agents)
          return{
            
            ...state,
            agents:action.agents,
            };


  case ActionTypes.ADD_DEPTAGENTS:
          console.log(action.agents)
          return{
            ...state,
            deptagents :action.agents,
           
             newagents : [],


          };
          case ActionTypes.ADD_GROUPAGENTS:
          return{
            
            ...state,
            groupagents : action.agents,
            newagents : action.agents,
            
          };

    case ActionTypes.ADD_NEWS:
          return{
            ...state,
            news : action.news,
           
             }

    case ActionTypes.ADD_FB_PAGES:
          return{
          ...state, 
          fbpages : action.fbpages,

             }
   case ActionTypes.ADD_TEAMS:
          console.log(action.teams)
          return{
            ...state,
            teamdetails:action.teams,
            newagents: [],
            

      };


    case ActionTypes.ADD_GROUPS:
          return{
            ...state,
            groupdetails : action.groups,
    
      };

   case ActionTypes.ADD_CHANNELS:
          return{
            ...state,
            channels : action.channels,
       

      };

    case ActionTypes.ADD_RESPONSES:
          return{
            ...state,
            responses : action.responses,
           


      };

    case ActionTypes.ADD_NEW_RESPONSE:
        // console.log(action.response)
          return{
            ...state,
            responses : [action.response,...state.responses],
            
      };
    case ActionTypes.ADD_MY_TEAMS:
          return{
            ...state,
            myteamdetails:action.myteams,
          
      };
    case ActionTypes.ADD_TEAM:
    console.log(action.deptname);
      return {
        ...state,
        teamdetails: [{
          deptname: action.deptname,
          deptdescription: action.deptdescription,

        }, ...state.teamdetails],
        
         errorMessage:'Team created successfully',
        
        };


     case ActionTypes.DELETE_TEAM :
      return {
        ...state,
        teamdetails: state.teamdetails.filter((team) => team._id !== action.team._id),
       
        errorMessage:'Team deleted successfully',
        
      };

       case ActionTypes.DELETE_GROUP :
      return {
        ...state,
         groupdetails : state.groupdetails.filter((group) => group._id !== action.group._id),
        errorMessage:'Group deleted successfully',
       
      };


      case ActionTypes.DELETE_CHANNEL :
      return {
        ...state,
        channels : state.channels.filter((channel) => channel._id !== action.channel._id),
        errorMessage:'Message channel deleted successfully',
        
      };

      case ActionTypes.DELETE_RESPONSE :
      return {
        ...state,
        
        responses : state.responses.filter((response) => response._id != action.response._id),
        errorMessage:'Canned Response deleted successfully',
        
      };


       case ActionTypes.DELETE_SELECTED_PAGE :
      return {
        ...state,
        
        fbpages:state.fbpages.filter((fbpage)=> fbpage.pageid != action.fbpage.pageid),
        errorMessage:'Facebook Page Info deleted successfully',
        
      };
      case ActionTypes.DELETE_AGENT :
      return {
        ...state,
        errorMessage:'Agent deleted successfully',
        agents : state.agents.filter((agent) => agent._id !== action.agent._id),
        
      };

      case ActionTypes.CREATEGROUP_FAILURE:
      return {
         ...state,
         
         errorMessage:action.message,
         
        };

      case ActionTypes.EDITGROUP_RESPONSE:
      return {
         ...state,
         errorMessage:action.message,
        
        };

      case ActionTypes.EDITAGENT_RESPONSE:
      return {
        ...state,
         errorMessage:action.message,
       
        };



      case ActionTypes.INVITE_AGENT_RESPONSE:
      return {
        ...state,
         errorMessage:action.message,
         
        };

        case ActionTypes.SHOW_SPECIFIC_CHAT:
        return {
          ...state,
           chat:action.chat,
           
          };

        case ActionTypes.ADD_UPDATE_PROFILE_WARNINGS:
        return {
          ...state,
           errorMessageProfile : action.errormessage,
           

          };
          case ActionTypes.SHOW_SPECIFIC_CHAT_ERROR:

          return {
            ...state,
             errorMessage:action.chat_error,
             
            };
          case ActionTypes.SHOW_ALL_CHAT:
           return {
            ...state,
             errorMessage:action.chat_error,
             customerchat : action.customerchat,
             customerchatold : action.customerchat,
             serverresponse : action.serverresponse,
            };


            case ActionTypes.CHAT_SAVE_RESPONSE:
           var cc = []
           if(state.userchats){
              cc = [...state.userchats,action.tempMessage]
           }
           else{
            cc = [action.tempMessage]
           }
           return {
            ...state,
             userchats : cc,
             errorMessage:action.chat_error,
            tempMessage : action.tempMessage,
            ismessageSaved : action.ismessageSaved,

            };

            case ActionTypes.ADD_USER_CHATS_SPECIFIC_MOBILE:
           return {
            ...state,
             errorMessage:action.chat_error,
            mobileuserchat : action.mobileuserchat,

            };


            case ActionTypes.ADD_USER_CHATS_SPECIFIC_MOBILE:
           return {
            ...state,
             userchats : action.userchats,
             errorMessage:action.chat_error,
             
            };

           case ActionTypes.SHOW_MY_PICKED_SESSIONS:
           return {
            ...state,
             customerchatold : action.customerchat,
             mypickedsessions : action.mypickedsessions,
             
            };

          case ActionTypes.SHOW_ASSIGNED_SESSIONS:
             return {
              ...state,
             assignedsessions : action.assignedsessions,
            };

            case ActionTypes.SHOW_RESOLVED_SESSIONS:
            return {
             ...state, 
             resolvedsessions : action.resolvedsessions,
           
            };

            case ActionTypes.SHOW_NEW_SESSIONS:
             return {
              ...state,
             newsessions : action.newsessions,
             
            };


             case ActionTypes.SHOW_ASSIGNED_SOCKET_SESSIONS:
             return {
              ...state,
             assignedsessions : action.assignedsessions,
             assignedsocketsessions : action.assignedsocketsessions,
             
            };


             case ActionTypes.SHOW_NEW_SOCKET_SESSIONS:
             return {
              ...state,
             newsessions : action.newsessions,
             newsocketsessions : action.newsocketsessions,

            };


            case ActionTypes.SHOW_RESOLVED_SOCKET_SESSIONS:
             return {
              ...state,
             resolvedsessions : action.resolvedsessions,
             resolvedsocketsessions : action.resolvedsocketsessions,
             
            };




          case ActionTypes.SET_SOCKET_ID:
          return {
            ...state,
             errorMessage:action.chat_error,
             customerchat : action.customerchat,
             customerchatold : action.customerchat,
             yoursocketid : action.yoursocketid


            };
          case ActionTypes.ADD_USER_CHATS:
          var usChat = []
          if(action.userchats.length>0 ){
            usChat = action.userchats;

          }
          else{
             usChat = state.userchats
          }
           return {
            ...state,
            userchats : usChat,
            
            };

            case ActionTypes.FILTER_BY_STATUS:
            return {
              ...state,
             errorMessage:action.chat_error,
             customerchat : action.filtered,
           
            };
             case ActionTypes.FILTER_BY_DEPT:
            return {
              ...state,
             errorMessage:action.chat_error,
             customerchat : action.filtered,
            
            };

              case ActionTypes.FILTER_BY_CHANNEL:
            return {
              ...state,
             errorMessage:action.chat_error,
             customerchat : action.filtered,
            
            };
            case ActionTypes.FILTER_BY_AGENT:
            return {
              ...state,
             errorMessage:action.chat_error,
             customerchat : action.filtered,
            
            };
            case ActionTypes.SELECT_CUSTOMERCHAT:
             return {
              ...state,
             customerchat_selected : action.customerchat_selected[0],
             new_message_arrived_rid : action.new_message_arrived_rid,
           
            };


          case ActionTypes.FB_CHAT_SELECTED:
             return {
              ...state,
             fbchatSelected:action.fbchatSelected,



            };


          case ActionTypes.FB_CHAT_ADDED:
             return {
              ...state,
             fbchats:action.fbchats,
             fbchatSelected:action.fbchatSelected,



            };

          case ActionTypes.FB_CHAT_STATUS:
             return {
              ...state,
             fbchats:action.fbchats,
            };

          case ActionTypes.FBCHAT_SENT_TO_AGENT:
              return {
             ...state,
             status:action.status



            };
          case ActionTypes.ADD_SESSION:
           return {
            ...state,
             errorMessage:action.chat_error,
             customerchat : action.customerchat,
             customerchatold : [action.customerchat,...state.customerchatold],
           
            };

          case ActionTypes.ONLINE_AGENTS:
             return {
              ...state,
             onlineAgents : action.onlineAgents,
            };

          case ActionTypes.SHOW_CHAT_HISTORY:
           return {
            ...state,
             errorMessage:action.chat_error,
             chatlist : action.chatlist,
          
            };

          case ActionTypes.ADD_CHAT_MESSAGE:
          var chatlistt = []
            if(state.chatlist){
              chatlistt = [...state.chatlist,action.message]

            }
            else{
              chatlistt = [action.message]
            }
            var cc = []
           if(state.userchats){
              cc = [...state.userchats,action.message]
           }
           else{
            cc = [action.message]
           }

           return {
            ...state,
             errorMessage:action.chat_error,
             chatlist: chatlistt,
             new_message_arrived_rid : action.ch,
             userchats :cc,
           
            };

          case ActionTypes.CHAT_SENT_TO_AGENT:

           return {
            ...state,
             errorMessage:action.status,
            
            };
          case ActionTypes.SHOW_NOTIFICATIONS:
             return {
              ...state,
             errorMessage:action.chat_error,
             notifications:action.notifications,
            
            };
             case ActionTypes.CONFIRM_NOTIFICATION:
             return {
             ...state, 
             addednotification : action.msg,
             errorMessage :action.msg,
             
            };
             case ActionTypes.DELETE_NOTIFICATION :
              return {
                ...state,
                errorMessage:'Notification deleted successfully',
                notifications : state.notifications.filter((notification) => notification._id !== action.notification._id),

              };
              case ActionTypes.ADD_CUSTOMER :
              return {
                ...state,
                errorMessage:'Customer created successfully',


              };
            case ActionTypes.ADD_SELECTED_NOTIFICATION :
            return {
              ...state,
              notification: state.notifications.filter((notification) => notification._id == action.id),


            };
            case ActionTypes.SHOW_CUSTOMERS:
             return {
              ...state,
             errorMessage:action.chat_error,
             customers : action.customers,
            };

            case ActionTypes.SHOW_COUNTRY_NAME:
             return {
              ...state,
             errorMessage:action.chat_error,
             countryname:action.countryinfo.country_name,

            };


            case ActionTypes.CHANNEL_STATS:
              return {
               ...state, 
             errorMessage:action.chat_error,
             channelwisestats : action.channelwisestats,
             
            };


            case ActionTypes.CUSTOMER_STATS:
              return {
                ...state,
             errorMessage:action.chat_error,
             customerwisestats : action.customerwisestats,

            };


            case ActionTypes.AGENT_STATS:
              return {
                ...state,
            
             agentwisestats : action.agentwisestats,
            };


             case ActionTypes.AGENT_NOTIFICATIONS:
              return {
                ...state,
           
             agentwisenotifications : action.agentwisenotifications,

            };
            case ActionTypes.MOBILE_STATS:
              return {
                ...state,
          
             mobilewisestats : action.mobilewisestats,

            };


            case ActionTypes.PAGE_STATS:
              return {
                ...state,
           
             pagewisestats : action.pagewisestats,
            };

            case ActionTypes.DEPT_STATS:
              return {
                ...state,
          
             deptwisestats : action.deptwisestats,
            };



            case ActionTypes.PLATFORM_STATS:
              return {
                ...state,
          
             platformwisestats : action.platformwisestats,
            };

            case ActionTypes.COUNTRY_STATS:
              return {
                ...state,
         
             errorMessage:action.chat_error,
             countrywisestats : action.countrywisestats,
            
            };

            case ActionTypes.SHOW_CHAT_SUMMARY:
             return {
              ...state,
         
              sessionsummary : action.sessionsummary,
              sessionsummaryfiltered : action.sessionsummary,
         
            };

            case ActionTypes.ADD_SELECTED_SESSIONSUMMARY:
             return {
              ...state,
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels,
             responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             sessionsummary : state.sessionsummary,
             sessionsummaryfiltered : state.sessionsummaryfiltered,
             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             sessionsummarydetail : state.sessionsummary.filter((c) => c.request_id == action.id),
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,


            };


             case ActionTypes.ADD_USER_CHATS_SPECIFIC:
             return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels,
             responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             sessionsummary : state.sessionsummary,
             sessionsummary:state.sessionsummaryfiltered,
             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             sessionsummarydetail : state.sessionsummarydetail,
             userchathistory : action.userchathistory,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,


            };


             case ActionTypes.FILTER_BY_SESSION:
             return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels,
             responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             sessionsummary : state.sessionsummary,
             sessionsummaryfiltered:action.sessionsummaryfiltered,
             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             sessionsummarydetail : state.sessionsummarydetail,
             userchathistory : state.userchathistory,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,


            };


            case ActionTypes.ADD_SELECTED_CUSTOMER :
            return {
              userdetails: state.userdetails,
              teamdetails:state.teamdetails,
              agents : state.agents,
              channels : state.channels,
              deptagents :state.deptagents,
              notifications : state.notifications,
              customers:state.customers,
              customer: state.customers.filter((customer) => customer._id == action.id),
              onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
              groupdetails :state.groupdetails,
              responses : state.responses,
              chatlist: state.chatlist,
              customerid : state.customerid,
              customerchat : state.customerchat,
              customerchatold : state.customerchatold,
               customerchat_selected : state.customerchat_selected,
               new_message_arrived_rid : state.new_message_arrived_rid,
               userchats : state.userchats,

            };

          case ActionTypes.COMPANY_PROFILE:
           return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchat,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             responses : state.responses,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
            onlineAgents : state.onlineAgents,
            yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
            groupdetails :state.groupdetails,
            companysettings : action.companysettings,



            };

             case ActionTypes.ADD_FB_CUSTOMERS:
         
             return {
               teamdetails: state.teamdetails,
               userdetails: state.userdetails,
               errorMessage:state.errorMessage,
               agents : state.agents,
               deptagents :state.deptagents,

               chatlist: state.chatlist,
               customerid : state.customerid,
               customerchat : state.customerchat,
               customerchatold : state.customerchatold,
               customerchat_selected : state.customerchat_selected,
               new_message_arrived_rid : state.new_message_arrived_rid,
               userchats :state.userchats,
               responses : state.responses,

               channels : state.channels,
               customers : state.customers,
               onlineAgents : state.onlineAgents,
               yoursocketid : state.yoursocketid,
               news:state.news,
               groupagents : state.groupagents,
               groupdetails :state.groupdetails,
               fbcustomers:action.fbcustomers,
               fbchats:state.fbchats,

              };

               case ActionTypes.ADD_FB_CHATS:
         
             return {
               teamdetails: state.teamdetails,
               userdetails: state.userdetails,
               errorMessage:state.errorMessage,
               agents : state.agents,
               deptagents :state.deptagents,

               chatlist: state.chatlist,
               customerid : state.customerid,
               customerchat : state.customerchat,
               customerchatold : state.customerchatold,
               customerchat_selected : state.customerchat_selected,
               new_message_arrived_rid : state.new_message_arrived_rid,
               userchats :state.userchats,
               responses : state.responses,

               channels : state.channels,
               customers : state.customers,
               onlineAgents : state.onlineAgents,
               yoursocketid : state.yoursocketid,
               news:state.news,
               groupagents : state.groupagents,
               groupdetails :state.groupdetails,
               fbcustomers:state.fbcustomers,
               fbchats:action.fbchats,

              };


          case ActionTypes.ADD_NEW_FB_CUSTOMER:
         
             return {
               teamdetails: state.teamdetails,
               userdetails: state.userdetails,
               errorMessage:state.errorMessage,
               agents : state.agents,
               deptagents :state.deptagents,

               chatlist: state.chatlist,
               customerid : state.customerid,
               customerchat : state.customerchat,
               customerchatold : state.customerchatold,
               customerchat_selected : state.customerchat_selected,
               new_message_arrived_rid : state.new_message_arrived_rid,
               userchats :state.userchats,
               responses : state.responses,

               channels : state.channels,
               customers : state.customers,
               onlineAgents : state.onlineAgents,
               yoursocketid : state.yoursocketid,
               news:state.news,
               groupagents : state.groupagents,
               groupdetails :state.groupdetails,
               fbcustomers:action.fbcustomers,
               fbchats:state.fbchats,

               fbchatSelected:state.fbchatSelected,
              };
    default:
      return state;
  }
};



function widget(state = widgetState, action){
  switch(action.type){
    case ActionTypes.ADD_CUSTOMER_TEAMS:
          return {
            teamdetails:action.teams,
            channels : state.channels,
            roomdetails : state.roomdetails,
            specificsession : state.specificsession,
             specificcustomer : state.specificcustomer,
             filterlist : state.filterlist,

            };
    case ActionTypes.ADD_CUSTOMER_CHANNELS:
          return{
            teamdetails:state.teamdetails,
            channels : action.channels,
            roomdetails : state.roomdetails,
            specificsession : state.specificsession,
            specificcustomer : state.specificcustomer,
            filterlist : state.filterlist,

      };

     case ActionTypes.ADD_CUSTOMER_SESSION:
          return{
            teamdetails:state.teamdetails,
            channels : state.channels,
            roomdetails : state.roomdetails,
            specificsession : action.specificsession,
            specificcustomer : state.specificcustomer,
            filterlist : state.filterlist,

      };

      case ActionTypes.ADD_CUSTOMER_DETAILS:
          return{
            teamdetails:state.teamdetails,
            channels : state.channels,
            roomdetails : state.roomdetails,
            specificsession : state.specificsession,
            specificcustomer : action.specificcustomer,
            filterlist : state.filterlist,

      };
    case ActionTypes.ADD_ROOM_DETAILS :
         return{
            teamdetails:state.teamdetails,
            channels : state.channels,
            sessiondetails :state.session ,
            roomdetails : action.room,
            specificsession : state.specificsession,
            specificcustomer : state.specificcustomer,
            filterlist : state.filterlist,


      };
    case ActionTypes.FILTER_CHANNELS:
          return{
            teamdetails:state.teamdetails,
            channels : state.channels,
            filterlist : state.channels.filter((channel) => channel.groupid == action.id),
            roomdetails : state.room,
            specificcustomer : state.specificcustomer,
            specificsession : state.specificsession,

      };
    case ActionTypes.CREATE_SESSION:
         return{
            teamdetails:state.teamdetails,
            channels : state.channels,
            sessiondetails :action.session ,
            roomdetails : state.roomdetails,
            specificcustomer : state.specificcustomer,
            specificsession : state.specificsession,
            filterlist : state.filterlist,
            countryname : state.countryname,

      };

  default:
      return state;
  }
};
// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.

function auth(state = {isAuthenticated: false}, action) {
  switch (action.type) {
    case ActionTypes.ADD_FORGOTPASSWORD_WARNINGS:
    return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.errormessage
      })



    case ActionTypes.LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds
      })
    case ActionTypes.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        errorMessage: 'Login went successfully'
      })


     case ActionTypes.SHOW_TOKEN_RESPONSE:
      return Object.assign({}, state, {

        errorMessage: action.errormessage
      })

    case ActionTypes.LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      })

    case ActionTypes.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        errormessage:''
      })
    default:
      return state
  }
}


// We combine the reducers here so that they
// can be left split apart above
const appReducer = combineReducers({
  auth,
  dashboard,
  signup,
  widget
})








export default appReducer;
