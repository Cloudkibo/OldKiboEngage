import { combineReducers } from 'redux'
import * as ActionTypes from '../constants/constants';
import { push } from 'react-router-redux';
import store from '../store/configureStore'


function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
  return newArray;
 }



const initialState = { signupwarnings: {},userdetails : {}};
const dashboardState = { userdetails : {},groupdetails:[],userjoinedroom:'notjoined',userchats:[],chatlist:[]};
const widgetState ={groupdetails:[],subgroups:[],chatbotlist:[]}
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

  case ActionTypes.ADD_SELECTED_GROUP :
      var agentid =[];
      if(state.deptagents)
      {
      state.deptagents.filter((agent) => agent.deptid == action.group._id).map((agent, i)=> (
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

   case ActionTypes.ADD_INVITED_AGENTS:
         return {
          ...state,errorMessageProfile:'',
        invitedagents: action.invitedagents,
        }
      
   case ActionTypes.ADD_SELECTED_AGENT :
      return {
        ...state,errorMessageProfile:'',
        agent: state.agents.filter((agent) => agent._id == action.id),
        
      };

    case ActionTypes.ADD_SELECTED_SUBGROUP :
      return {
       ...state,errorMessageProfile:'',
        subgroup: state.subgroups.filter((subgroup) => subgroup._id == action.id),
       
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
   case ActionTypes.ADD_GROUPS:
          console.log(action.groups)
          return{
            ...state,errorMessageProfile:'',
            groupdetails:action.groups,
            newagents: [],
            

      };


  

   case ActionTypes.ADD_SUBGROUPS:
          return{
            ...state,errorMessageProfile:'',
            subgroups : action.subgroups,
             errorMessage:'',

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
    case ActionTypes.ADD_MY_GROUPS:
          return{
            ...state,errorMessageProfile:'',
            mygroupdetails:action.mygroups,
          
      };
    case ActionTypes.ADD_GROUP:
    console.log(action.deptname);
      return {
        ...state,errorMessageProfile:'',
        groupdetails: [{
          deptname: action.deptname,
          deptdescription: action.deptdescription,

        }, ...state.groupdetails],
        
         errorMessage:'Group created successfully',
        
        };


     case ActionTypes.DELETE_GROUP :
      return {
        ...state,errorMessageProfile:'',
        groupdetails: state.groupdetails.filter((group) => group._id !== action.group._id),
       
        errorMessage:'Group deleted successfully',
        
      };

       


      case ActionTypes.DELETE_SUBGROUP :
      return {
        ...state,errorMessageProfile:'',
        subgroups : state.subgroups.filter((subgroup) => subgroup._id !== action.subgroup._id),
        errorMessage:'Subgroup deleted successfully',
        
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

      

     

      case ActionTypes.EDITAGENT_RESPONSE:
      return {
        ...state,errorMessageProfile:'',
         errorMessage:action.message,
       
        };



      case ActionTypes.INVITE_AGENT_RESPONSE:
      return {
        ...state,errorMessageProfile:'',
         errorMessage:action.message,
         inviteurl:action.inviteurl,
         
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

          case ActionTypes.ADD_UPDATE_SETTINGS:
           return {
          ...state,
           errorMessageProfile : action.errormessage,
           companysettings:action.companysettings,

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
             customerchat_selected:action.customerchat_selected,
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
           return {
            ...state,errorMessageProfile:'',
            userchats: action.userchats,
            chatlist: action.chatlist,
            
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

              case ActionTypes.FILTER_BY_SUBGROUP:
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
              chatlistt = removeDuplicates([...state.chatlist,action.message],'uniqueid')

            }
            else{
              chatlistt = [action.message]
            }
            var cc = []
           if(state.userchats){
              cc = removeDuplicates([...state.userchats,action.message],'uniqueid')
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


            case ActionTypes.SUBGROUP_STATS:
              return {
               ...state,errorMessageProfile:'', 
             errorMessage:action.chat_error,
             subgroupwisestats : action.subgroupwisestats,
             
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

        case ActionTypes.JOINED_MEETING:
             return {
              ...state,errorMessageProfile:'',
                userjoinedroom:action.userjoinedroom,
               };

        case ActionTypes.ADD_SELECTED_TEAM :
      var agentid =[];
      if(state.teamagents)
      {
      state.teamagents.filter((agent) => agent.groupid._id == action.team._id).map((agent, i)=> (
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

      case ActionTypes.ADD_TEAMAGENTS:
              return{
                
                ...state,errorMessageProfile:'',
                teamagents : action.agents,
                newagents : action.agents,
                 errorMessage:''
                
              };


      case ActionTypes.ADD_TEAMS:
              return{
                ...state,errorMessageProfile:'',
                teamdetails : action.teams,
                 errorMessage:''
        
          };


     case ActionTypes.DELETE_TEAM :
          return {
            ...state,errorMessageProfile:'',
             teamdetails : state.teamdetails.filter((team) => team._id !== action.team.get('_id')),
            errorMessage:'Team deleted successfully',
           
          };

      case ActionTypes.EDITTEAM_RESPONSE:
          return {
             ...state,errorMessageProfile:'',
             errorMessage:action.message,
            
            };

      case ActionTypes.CREATETEAM_FAILURE:
          return {
             ...state,errorMessageProfile:'',
             
             errorMessage:action.message,
             
            };

    default:
      return state;
  }
};



function widget(state = widgetState, action){
  switch(action.type){
    case ActionTypes.COMPANY_LOGO:
       return {
        ...state,
        companylogo:action.companylogo,
       }

      case ActionTypes.BOT_RESPONSE:
       return {
        ...state,
        chatbotlist:[...state.chatbotlist,action.message],
       }  
       case ActionTypes.BOT_SESSION:
        return {
        ...state,
        chatbotsessionid:action.chatbotsessionid
       }  
    case ActionTypes.ADD_CUSTOMER_GROUPS:
          return {
            ...state,
            groupdetails:action.groups,
           

            };
    case ActionTypes.ADD_CUSTOMER_SUBGROUPS:
          return{
            ...state,
            subgroups : action.subgroups,
            
      };

     case ActionTypes.ADD_CUSTOMER_SESSION:
          return{
            ...state,
            specificsession : action.specificsession,
           
      };

      case ActionTypes.ADD_CUSTOMER_DETAILS:
          return{
            ...state,
           specificcustomer : action.specificcustomer,
            
      };
    case ActionTypes.ADD_ROOM_DETAILS :
         return{
            ...state,
          
            roomdetails : action.room,
        

      };
    case ActionTypes.FILTER_SUBGROUPS:
          return{
            ...state,
            filterlist : state.subgroups.filter((subgroup) => subgroup.groupid == action.id),
          

      };
    case ActionTypes.CREATE_SESSION:
         return{
          ...state,
            sessiondetails :action.session ,
           
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
        errormessage:'',

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
