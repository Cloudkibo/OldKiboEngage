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
        ...state,errorMessageProfile:'',
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
        ...state,errorMessageProfile:'',
        group: action.group,
        newagents:agentid,
        

      };

      case ActionTypes.ADD_SELECTED_PAGE :
      return {
      

        ...state,errorMessageProfile:'',
        fbpage:action.fbpage,

      };


   case ActionTypes.ADD_SELECTED_AGENT :
      return {
        ...state,errorMessageProfile:'',
        agent: state.agents.filter((agent) => agent._id == action.id),
        
      };

    case ActionTypes.ADD_SELECTED_CHANNEL :
      return {
       ...state,errorMessageProfile:'',
        channel: state.channels.filter((channel) => channel._id == action.id),
       
      };
    case ActionTypes.ADD_SELECTED_RESPONSE :
      return {
       ...state,errorMessageProfile:'',
        response: state.responses.filter((response) => response._id == action.id),
      
      };
   case ActionTypes.ADD_USER_DETAILS:
          console.log(action.user.firstname)
          return{
            ...state,errorMessageProfile:'',
             userdetails:action.user,
             errorMessage:action.chat_error,
            

    };
   case ActionTypes.ADD_AGENTS:
          console.log(action.agents)
          return{
            
            ...state,errorMessageProfile:'',
            agents:action.agents,
            };


  case ActionTypes.ADD_DEPTAGENTS:
          console.log(action.agents)
          return{
            ...state,errorMessageProfile:'',
            deptagents :action.agents,
           
             newagents : [],


          };
          case ActionTypes.ADD_GROUPAGENTS:
          return{
            
            ...state,errorMessageProfile:'',
            groupagents : action.agents,
            newagents : action.agents,
            
          };

    case ActionTypes.ADD_NEWS:
          return{
            ...state,errorMessageProfile:'',
            news : action.news,
           
             }

    case ActionTypes.ADD_FB_PAGES:
          return{
          ...state,errorMessageProfile:'', 
          fbpages : action.fbpages,

             }
   case ActionTypes.ADD_TEAMS:
          console.log(action.teams)
          return{
            ...state,errorMessageProfile:'',
            teamdetails:action.teams,
            newagents: [],
            

      };


    case ActionTypes.ADD_GROUPS:
          return{
            ...state,errorMessageProfile:'',
            groupdetails : action.groups,
    
      };

   case ActionTypes.ADD_CHANNELS:
          return{
            ...state,errorMessageProfile:'',
            channels : action.channels,
       

      };

    case ActionTypes.ADD_RESPONSES:
          return{
            ...state,errorMessageProfile:'',
            responses : action.responses,
           


      };

    case ActionTypes.ADD_NEW_RESPONSE:
        // console.log(action.response)
          return{
            ...state,errorMessageProfile:'',
            responses : [action.response,...state.responses],
            
      };
    case ActionTypes.ADD_MY_TEAMS:
          return{
            ...state,errorMessageProfile:'',
            myteamdetails:action.myteams,
          
      };
    case ActionTypes.ADD_TEAM:
    console.log(action.deptname);
      return {
        ...state,errorMessageProfile:'',
        teamdetails: [{
          deptname: action.deptname,
          deptdescription: action.deptdescription,

        }, ...state.teamdetails],
        
         errorMessage:'Team created successfully',
        
        };


     case ActionTypes.DELETE_TEAM :
      return {
        ...state,errorMessageProfile:'',
        teamdetails: state.teamdetails.filter((team) => team._id !== action.team._id),
       
        errorMessage:'Team deleted successfully',
        
      };

       case ActionTypes.DELETE_GROUP :
      return {
        ...state,errorMessageProfile:'',
         groupdetails : state.groupdetails.filter((group) => group._id !== action.group._id),
        errorMessage:'Group deleted successfully',
       
      };


      case ActionTypes.DELETE_CHANNEL :
      return {
        ...state,errorMessageProfile:'',
        channels : state.channels.filter((channel) => channel._id !== action.channel._id),
        errorMessage:'Message channel deleted successfully',
        
      };

      case ActionTypes.DELETE_RESPONSE :
      return {
        ...state,errorMessageProfile:'',
        
        responses : state.responses.filter((response) => response._id != action.response._id),
        errorMessage:'Canned Response deleted successfully',
        
      };


       case ActionTypes.DELETE_SELECTED_PAGE :
      return {
        ...state,errorMessageProfile:'',
        
        fbpages:state.fbpages.filter((fbpage)=> fbpage.pageid != action.fbpage.pageid),
        errorMessage:'Facebook Page Info deleted successfully',
        
      };
      case ActionTypes.DELETE_AGENT :
      return {
        ...state,errorMessageProfile:'',
        errorMessage:'Agent deleted successfully',
        agents : state.agents.filter((agent) => agent._id !== action.agent._id),
        
      };

      case ActionTypes.CREATEGROUP_FAILURE:
      return {
         ...state,errorMessageProfile:'',
         
         errorMessage:action.message,
         
        };

      case ActionTypes.EDITGROUP_RESPONSE:
      return {
         ...state,errorMessageProfile:'',
         errorMessage:action.message,
        
        };

      case ActionTypes.EDITAGENT_RESPONSE:
      return {
        ...state,errorMessageProfile:'',
         errorMessage:action.message,
       
        };



      case ActionTypes.INVITE_AGENT_RESPONSE:
      return {
        ...state,errorMessageProfile:'',
         errorMessage:action.message,
         
        };

        case ActionTypes.SHOW_SPECIFIC_CHAT:
        return {
          ...state,errorMessageProfile:'',
           chat:action.chat,
           
          };

        case ActionTypes.ADD_UPDATE_PROFILE_WARNINGS:
        return {
          ...state,
           errorMessageProfile : action.errormessage,
           

          };
          case ActionTypes.SHOW_SPECIFIC_CHAT_ERROR:

          return {
            ...state,errorMessageProfile:'',
             errorMessage:action.chat_error,
             
            };
          case ActionTypes.SHOW_ALL_CHAT:
           return {
            ...state,errorMessageProfile:'',
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
            ...state,errorMessageProfile:'',
             userchats : cc,
             errorMessage:action.chat_error,
            tempMessage : action.tempMessage,
            ismessageSaved : action.ismessageSaved,

            };

            case ActionTypes.ADD_USER_CHATS_SPECIFIC_MOBILE:
           return {
            ...state,errorMessageProfile:'',
             errorMessage:action.chat_error,
            mobileuserchat : action.mobileuserchat,

            };


            case ActionTypes.ADD_USER_CHATS_SPECIFIC_MOBILE:
           return {
            ...state,errorMessageProfile:'',
             userchats : action.userchats,
             errorMessage:action.chat_error,
             
            };

           case ActionTypes.SHOW_MY_PICKED_SESSIONS:
           return {
            ...state,errorMessageProfile:'',
             customerchatold : action.customerchat,
             mypickedsessions : action.mypickedsessions,
             
            };

          case ActionTypes.SHOW_ASSIGNED_SESSIONS:
             return {
              ...state,errorMessageProfile:'',
             assignedsessions : action.assignedsessions,
            };

            case ActionTypes.SHOW_RESOLVED_SESSIONS:
            return {
             ...state,errorMessageProfile:'', 
             resolvedsessions : action.resolvedsessions,
           
            };

            case ActionTypes.SHOW_NEW_SESSIONS:
             return {
              ...state,errorMessageProfile:'',
             newsessions : action.newsessions,
             
            };


             case ActionTypes.SHOW_ASSIGNED_SOCKET_SESSIONS:
             return {
              ...state,errorMessageProfile:'',
             assignedsessions : action.assignedsessions,
             assignedsocketsessions : action.assignedsocketsessions,
             
            };


             case ActionTypes.SHOW_NEW_SOCKET_SESSIONS:
             return {
              ...state,errorMessageProfile:'',
             newsessions : action.newsessions,
             newsocketsessions : action.newsocketsessions,

            };


            case ActionTypes.SHOW_RESOLVED_SOCKET_SESSIONS:
             return {
              ...state,errorMessageProfile:'',
             resolvedsessions : action.resolvedsessions,
             resolvedsocketsessions : action.resolvedsocketsessions,
             
            };




          case ActionTypes.SET_SOCKET_ID:
          return {
            ...state,errorMessageProfile:'',
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
            ...state,errorMessageProfile:'',
            userchats : usChat,
            
            };

            case ActionTypes.FILTER_BY_STATUS:
            return {
              ...state,errorMessageProfile:'',
             errorMessage:action.chat_error,
             customerchat : action.filtered,
           
            };
             case ActionTypes.FILTER_BY_DEPT:
            return {
              ...state,errorMessageProfile:'',
             errorMessage:action.chat_error,
             customerchat : action.filtered,
            
            };

              case ActionTypes.FILTER_BY_CHANNEL:
            return {
              ...state,errorMessageProfile:'',
             errorMessage:action.chat_error,
             customerchat : action.filtered,
            
            };
            case ActionTypes.FILTER_BY_AGENT:
            return {
              ...state,errorMessageProfile:'',
             errorMessage:action.chat_error,
             customerchat : action.filtered,
            
            };
            case ActionTypes.SELECT_CUSTOMERCHAT:
             return {
              ...state,errorMessageProfile:'',
             customerchat_selected : action.customerchat_selected[0],
             new_message_arrived_rid : action.new_message_arrived_rid,
           
            };


          case ActionTypes.FB_CHAT_SELECTED:
             return {
              ...state,errorMessageProfile:'',
             fbchatSelected:action.fbchatSelected,



            };


          case ActionTypes.FB_CHAT_ADDED:
             return {
              ...state,errorMessageProfile:'',
             fbchats:action.fbchats,
             fbchatSelected:action.fbchatSelected,



            };

          case ActionTypes.FB_CHAT_STATUS:
             return {
              ...state,errorMessageProfile:'',
             fbchats:action.fbchats,
            };

          case ActionTypes.FBCHAT_SENT_TO_AGENT:
              return {
             ...state,errorMessageProfile:'',
             status:action.status



            };
          case ActionTypes.ADD_SESSION:
           return {
            ...state,errorMessageProfile:'',
             errorMessage:action.chat_error,
             customerchat : action.customerchat,
             customerchatold : [action.customerchat,...state.customerchatold],
           
            };

          case ActionTypes.ONLINE_AGENTS:
             return {
              ...state,errorMessageProfile:'',
             onlineAgents : action.onlineAgents,
            };

          case ActionTypes.SHOW_CHAT_HISTORY:
           return {
            ...state,errorMessageProfile:'',
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
            ...state,errorMessageProfile:'',
             errorMessage:action.chat_error,
             chatlist: chatlistt,
             new_message_arrived_rid : action.ch,
             userchats :cc,
           
            };

          case ActionTypes.CHAT_SENT_TO_AGENT:

           return {
            ...state,errorMessageProfile:'',
             errorMessage:action.status,
            
            };
          case ActionTypes.SHOW_NOTIFICATIONS:
             return {
              ...state,errorMessageProfile:'',
             errorMessage:action.chat_error,
             notifications:action.notifications,
            
            };
             case ActionTypes.CONFIRM_NOTIFICATION:
             return {
             ...state,errorMessageProfile:'', 
             addednotification : action.msg,
             errorMessage :action.msg,
             
            };
             case ActionTypes.DELETE_NOTIFICATION :
              return {
                ...state,errorMessageProfile:'',
                errorMessage:'Notification deleted successfully',
                notifications : state.notifications.filter((notification) => notification._id !== action.notification._id),

              };
              case ActionTypes.ADD_CUSTOMER :
              return {
                ...state,errorMessageProfile:'',
                errorMessage:'Customer created successfully',


              };
            case ActionTypes.ADD_SELECTED_NOTIFICATION :
            return {
              ...state,errorMessageProfile:'',
              notification: state.notifications.filter((notification) => notification._id == action.id),


            };
            case ActionTypes.SHOW_CUSTOMERS:
             return {
              ...state,errorMessageProfile:'',
             errorMessage:action.chat_error,
             customers : action.customers,
            };

            case ActionTypes.SHOW_COUNTRY_NAME:
             return {
              ...state,errorMessageProfile:'',
             errorMessage:action.chat_error,
             countryname:action.countryinfo.country_name,

            };


            case ActionTypes.CHANNEL_STATS:
              return {
               ...state,errorMessageProfile:'', 
             errorMessage:action.chat_error,
             channelwisestats : action.channelwisestats,
             
            };


            case ActionTypes.CUSTOMER_STATS:
              return {
                ...state,errorMessageProfile:'',
             errorMessage:action.chat_error,
             customerwisestats : action.customerwisestats,

            };


            case ActionTypes.AGENT_STATS:
              return {
                ...state,errorMessageProfile:'',
            
             agentwisestats : action.agentwisestats,
            };


             case ActionTypes.AGENT_NOTIFICATIONS:
              return {
                ...state,errorMessageProfile:'',
           
             agentwisenotifications : action.agentwisenotifications,

            };
            case ActionTypes.MOBILE_STATS:
              return {
                ...state,errorMessageProfile:'',
          
             mobilewisestats : action.mobilewisestats,

            };


            case ActionTypes.PAGE_STATS:
              return {
              ...state,errorMessageProfile:'',
           
             pagewisestats : action.pagewisestats,
            };

            case ActionTypes.DEPT_STATS:
              return {
              ...state,errorMessageProfile:'',
          
             deptwisestats : action.deptwisestats,
            };



            case ActionTypes.PLATFORM_STATS:
              return {
              ...state,errorMessageProfile:'',
          
             platformwisestats : action.platformwisestats,
            };

            case ActionTypes.COUNTRY_STATS:
              return {
              ...state,errorMessageProfile:'',
         
             errorMessage:action.chat_error,
             countrywisestats : action.countrywisestats,
            
            };

            case ActionTypes.SHOW_CHAT_SUMMARY:
             return {
              ...state,errorMessageProfile:'',
         
              sessionsummary : action.sessionsummary,
              sessionsummaryfiltered : action.sessionsummary,
         
            };

            case ActionTypes.ADD_SELECTED_SESSIONSUMMARY:
             return {
              ...state,errorMessageProfile:'',
             sessionsummarydetail : state.sessionsummary.filter((c) => c.request_id == action.id),
             };


             case ActionTypes.ADD_USER_CHATS_SPECIFIC:
             return {
              ...state,errorMessageProfile:'',
             userchathistory : action.userchathistory,
             
            };


             case ActionTypes.FILTER_BY_SESSION:
             return {
              ...state,errorMessageProfile:'',
             sessionsummaryfiltered:action.sessionsummaryfiltered,
            };


            case ActionTypes.ADD_SELECTED_CUSTOMER :
            return {
              ...state,errorMessageProfile:'',
              customer: state.customers.filter((customer) => customer._id == action.id),
              
            };

          case ActionTypes.COMPANY_PROFILE:
           return {
            ...state,errorMessageProfile:'',
            companysettings : action.companysettings,
            };

             case ActionTypes.ADD_FB_CUSTOMERS:
         
             return {
              ...state,errorMessageProfile:'',
               fbcustomers:action.fbcustomers,
             
              };

               case ActionTypes.ADD_FB_CHATS:
         
             return {
              ...state,errorMessageProfile:'',
              fbchats:action.fbchats,

              };


          case ActionTypes.ADD_NEW_FB_CUSTOMER:
         
             return {
              ...state,errorMessageProfile:'',
                fbcustomers:action.fbcustomers,
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
