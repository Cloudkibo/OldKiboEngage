import { combineReducers } from 'redux'
import * as ActionTypes from '../constants/constants';
import { push } from 'react-router-redux';
import store from '../store/configureStore'
const initialState = { signupwarnings: {},userdetails : {}};
const dashboardState = { userdetails : {},groupdetails:[]};
const widgetState ={groupdetails:[],channels:[]}
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
        group: action.group,
        userdetails: state.userdetails,
        groupdetails:state.groupdetails,
        agents : state.agents,
        deptagents :state.deptagents,
        newagents:agentid,
        channels : state.channels,
      }; 
   case ActionTypes.ADD_SELECTED_AGENT :
      return {
        userdetails: state.userdetails,
        groupdetails:state.groupdetails,
        agents : state.agents,
        deptagents :state.deptagents,
        agent: state.agents.filter((agent) => agent._id == action.id),
        channels : state.channels,
      
      };

    case ActionTypes.ADD_SELECTED_CHANNEL :
      return {
        userdetails: state.userdetails,
        groupdetails:state.groupdetails,
        agents : state.agents,
        channels : state.channels,
        deptagents :state.deptagents,
        channel: state.channels.filter((channel) => channel._id == action.id),
      
      };   
    case ActionTypes.ADD_SELECTED_RESPONSE :
      return {
        userdetails: state.userdetails,
        groupdetails:state.groupdetails,
        agents : state.agents,
        deptagents :state.deptagents,
        channels : state.channels,
        responses : state.responses,
        response: state.responses.filter((response) => response._id == action.id),
      
      };         
   case ActionTypes.ADD_USER_DETAILS:
          console.log(action.user.firstname)
          return{
            userdetails:action.user,
            channels : state.channels,

          };
   case ActionTypes.ADD_AGENTS:
          console.log(action.agents)
          return{
            userdetails:state.userdetails,
            agents:action.agents,
            deptagents :state.deptagents,
            groupdetails:state.groupdetails,
            channels : state.channels,
          };  

        
  case ActionTypes.ADD_DEPTAGENTS:
          console.log(action.agents)
          return{
            userdetails:state.userdetails,
            agents:state.agents,
            deptagents :action.agents,
            groupdetails:state.groupdetails,
            channels : state.channels,
           
          };              

   case ActionTypes.ADD_GROUPS:
          console.log(action.groups)
          return{
            groupdetails:action.groups,
            userdetails: state.userdetails,
            agents : state.agents,
            deptagents :state.deptagents,
            channels : state.channels,
      };

   case ActionTypes.ADD_CHANNELS:
          console.log(action.channels)
          return{
            groupdetails:state.groupdetails,
            userdetails: state.userdetails,
            agents : state.agents,
            deptagents :state.deptagents,
            channels : action.channels,
      };

    case ActionTypes.ADD_RESPONSES:
         console.log(action.responses)
          return{
            groupdetails:state.groupdetails,
            userdetails: state.userdetails,
            agents : state.agents,
            deptagents :state.deptagents,
            channels : state.channels,
            responses : action.responses,
      };
  
    case ActionTypes.ADD_NEW_RESPONSE:
         console.log(action.response)
          return{
            groupdetails:state.groupdetails,
            userdetails: state.userdetails,
            agents : state.agents,
            deptagents :state.deptagents,
            channels : state.channels,
            responses : [action.response,...state.responses],
      };
  
    case ActionTypes.ADD_GROUP:
    console.log(action.deptname);
      return {
        groupdetails: [{
          deptname: action.deptname,
          deptdescription: action.deptdescription,

        }, ...state.groupdetails],
         userdetails: state.userdetails,
         errorMessage:'Group created successfully',
         agents : state.agents,
         deptagents :state.deptagents,
         channels : state.channels,
        };

     case ActionTypes.DELETE_GROUP :
      return {
        groupdetails: state.groupdetails.filter((group) => group._id !== action.group._id),
        userdetails: state.userdetails,
        errorMessage:'Group deleted successfully',
        agents : state.agents,
        channels : state.channels,
        deptagents :state.deptagents,
       
      };


      case ActionTypes.DELETE_CHANNEL :
      return {
        groupdetails: state.groupdetails,
        channels : state.channels.filter((channel) => channel._id !== action.channel._id),
        userdetails: state.userdetails,
        errorMessage:'Message channel deleted successfully',
        agents : state.agents,
        deptagents :state.deptagents,
       
      };

      case ActionTypes.DELETE_RESPONSE :
      return {
        groupdetails: state.groupdetails,
        channels : state.channels,
        responses : state.responses.filter((response) => response._id !== action.response._id),
        userdetails: state.userdetails,
        errorMessage:'Canned Response deleted successfully',
        agents : state.agents,
        deptagents :state.deptagents,
       

      };
      case ActionTypes.DELETE_AGENT :
      return {
        groupdetails: state.groupdetails,
        userdetails: state.userdetails,
        errorMessage:'Agent deleted successfully',
        agents : state.agents.filter((agent) => agent._id !== action.agent._id),
        deptagents :state.deptagents,
        channels : state.channels,
      };

      case ActionTypes.CREATEGROUP_FAILURE:
      return {
         groupdetails: state.groupdetails,
         userdetails: state.userdetails,
         errorMessage:action.message,
         agents : state.agents,
         channels : state.channels,
         deptagents :state.deptagents,
       
        };

      case ActionTypes.EDITGROUP_RESPONSE:
      return {
         groupdetails: state.groupdetails,
         userdetails: state.userdetails,
         errorMessage:action.message,
         agents : state.agents,
         deptagents :state.deptagents,
         channels : state.channels,
        }; 

      case ActionTypes.EDITAGENT_RESPONSE:
      return {
         groupdetails: state.groupdetails,
         userdetails: state.userdetails,
         errorMessage:action.message,
         agents : state.agents,
         deptagents :state.deptagents,
         agent: state.agent,
         channels : state.channels,
        };  
      
        
          
      case ActionTypes.INVITE_AGENT_RESPONSE:
      return {
         groupdetails: state.groupdetails,
         userdetails: state.userdetails,
         errorMessage:action.message,
         agents : state.agents,
         deptagents :state.deptagents,
         agent: state.agent,
         channels : state.channels,
        };  

        case ActionTypes.SHOW_SPECIFIC_CHAT:
        return {
           groupdetails: state.groupdetails,
           userdetails: state.userdetails,
           chat:action.chat,
           agents : state.agents,
           deptagents :state.deptagents,
           channels : state.channels,

          };

          case ActionTypes.SHOW_SPECIFIC_CHAT_ERROR:
          return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels,

            };
          case ActionTypes.SHOW_ALL_CHAT:
           return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.customerchat,
             customerchatold : action.customerchat,
             chatlist : state.chatlist,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,

            };

            case ActionTypes.FILTER_BY_STATUS:
            return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.filtered,
             customerchatold : state.customerchatold,
             chatlist : state.chatlist,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
            new_message_arrived_rid : state.new_message_arrived_rid,

            };   
             case ActionTypes.FILTER_BY_DEPT:
            return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.filtered,
             customerchatold : state.customerchatold,
             chatlist : state.chatlist,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,

            };   
              case ActionTypes.FILTER_BY_CHANNEL:
            return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.filtered,
             customerchatold : state.customerchatold,
             chatlist : state.chatlist,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
            new_message_arrived_rid : state.new_message_arrived_rid,

            };     
                case ActionTypes.FILTER_BY_AGENT:
            return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.filtered,
             customerchatold : state.customerchatold,
             chatlist : state.chatlist,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid, 

            };            
            case ActionTypes.SELECT_CUSTOMERCHAT:
             return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage: state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             chatlist : state.chatlist,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : action.customerchat_selected[0],
             new_message_arrived_rid : action.new_message_arrived_rid,
            };   
          case ActionTypes.ADD_SESSION:
           return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.customerchat,
             customerchatold : [action.customerchat,...state.customerchatold],
             chatlist : state.chatlist,
             channels : state.channels,
             customers:state.customers,
              customerchat_selected : state.customerchat_selected,
              new_message_arrived_rid : state.new_message_arrived_rid,
            };

          case ActionTypes.SHOW_CHAT_HISTORY:
           return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             chatlist : action.chatlist,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
              customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             channels : state.channels,
            customers : state.customers, 
            };

          case ActionTypes.ADD_CHAT_MESSAGE:
           return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             chatlist: [...state.chatlist,action.message],
             customerid : state.customerid,
              customerchat : state.customerchat,
              customerchatold : state.customerchatold,
               customerchat_selected : state.customerchat_selected,
             channels : state.channels,
             customers : state.customers,
             new_message_arrived_rid : action.ch,  
            };

          case ActionTypes.SHOW_NOTIFICATIONS:
             return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             notifications:action.notifications,
             customers:state.customers,
            };
             case ActionTypes.CONFIRM_NOTIFICATION:
             return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             notifications:state.notifications,
             addednotification : action.msg,
             errorMessage :action.msg,

            };
             case ActionTypes.DELETE_NOTIFICATION :
              return {
                groupdetails: state.groupdetails,
                channels : state.channels,
                responses : state.responses,
                userdetails: state.userdetails,
                errorMessage:'Notification deleted successfully',
                agents : state.agents,
                deptagents :state.deptagents,
                notifications : state.notifications.filter((notification) => notification._id !== action.notification._id),
               

              };
              case ActionTypes.ADD_CUSTOMER :
              return {
               
                errorMessage:'Customer created successfully',
               

              };
            case ActionTypes.ADD_SELECTED_NOTIFICATION :
            return {
              userdetails: state.userdetails,
              groupdetails:state.groupdetails,
              agents : state.agents,
              channels : state.channels,
              deptagents :state.deptagents,
              notifications : state.notifications,
              notification: state.notifications.filter((notification) => notification._id == action.id),
              customers:state.customers,
            };  
            case ActionTypes.SHOW_CUSTOMERS:
             return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             notifications:state.notifications,
             notification: state.notification,
             customers : action.customers,
             customerchat : state.customerchat,
              customerchatold : state.customerchatold,

              customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
             new_message_arrived_rid : state.new_message_arrived_rid,
            
          
            };
            case ActionTypes.ADD_SELECTED_CUSTOMER :
            return {
              userdetails: state.userdetails,
              groupdetails:state.groupdetails,
              agents : state.agents,
              channels : state.channels,
              deptagents :state.deptagents,
              notifications : state.notifications,
              customers:state.customers,
              customer: state.customers.filter((customer) => customer._id == action.id),
            
            };  
    default:
      return state;
  }
};



function widget(state = widgetState, action){
  switch(action.type){
    case ActionTypes.ADD_CUSTOMER_GROUPS:
          return {
            groupdetails:action.groups,
            channels : state.channels,
            roomdetails : state.roomdetails,

         
            };
    case ActionTypes.ADD_CUSTOMER_CHANNELS:
          return{
            groupdetails:state.groupdetails,
            channels : action.channels,
            roomdetails : state.roomdetails,

      };
    case ActionTypes.ADD_ROOM_DETAILS :
         return{
            groupdetails:state.groupdetails,
            channels : state.channels,
            sessiondetails :state.session ,
            roomdetails : action.room,


      };
    case ActionTypes.FILTER_CHANNELS:
          return{
            groupdetails:state.groupdetails,
            channels : state.channels,
            filterlist : state.channels.filter((channel) => channel.groupid == action.id),
            roomdetails : state.room,
      };
    case ActionTypes.CREATE_SESSION:
         return{
            groupdetails:state.groupdetails,
            channels : state.channels,
            sessiondetails :action.session ,
            roomdetails : state.roomdetails,

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

    case ActionTypes.LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      })

    case ActionTypes.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false
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
