import { combineReducers } from 'redux'
import * as ActionTypes from '../constants/constants';
import { push } from 'react-router-redux';
import store from '../store/configureStore'
const initialState = { signupwarnings: {},userdetails : {}};
const dashboardState = { userdetails : {},groupdetails:[]};

const signup = (state =initialState, action) => {
  switch (action.type) {

   case ActionTypes.ADD_WARNINGS:
          return{
            signupwarnings:action.signup,
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
      }; 
   case ActionTypes.ADD_SELECTED_AGENT :
      return {
        userdetails: state.userdetails,
        groupdetails:state.groupdetails,
        agents : state.agents,
        deptagents :state.deptagents,
        agent: state.agents.filter((agent) => agent._id == action.id),
      
      };    
   case ActionTypes.ADD_USER_DETAILS:
          console.log(action.user.firstname)
          return{
            userdetails:action.user,

          };
   case ActionTypes.ADD_AGENTS:
          console.log(action.agents)
          return{
            userdetails:state.userdetails,
            agents:action.agents,
            deptagents :state.deptagents,
            groupdetails:state.groupdetails,
          };  

        
  case ActionTypes.ADD_DEPTAGENTS:
          console.log(action.agents)
          return{
            userdetails:state.userdetails,
            agents:state.agents,
            deptagents :action.agents,
             groupdetails:state.groupdetails,
           
          };              

   case ActionTypes.ADD_GROUPS:
          console.log(action.groups)
          return{
            groupdetails:action.groups,
            userdetails: state.userdetails,
            agents : state.agents,
            deptagents :state.deptagents,
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
        };

     case ActionTypes.DELETE_GROUP :
      return {
        groupdetails: state.groupdetails.filter((group) => group._id !== action.group._id),
        userdetails: state.userdetails,
        errorMessage:'Group deleted successfully',
        agents : state.agents,
      };
      case ActionTypes.DELETE_AGENT :
      return {
        groupdetails: state.groupdetails,
        userdetails: state.userdetails,
        errorMessage:'Agent deleted successfully',
        agents : state.agents.filter((agent) => agent._id !== action.agent._id),
        deptagents :state.deptagents,
      };

      case ActionTypes.CREATEGROUP_FAILURE:
      return {
         groupdetails: state.groupdetails,
         userdetails: state.userdetails,
         errorMessage:action.message,
         agents : state.agents,
        };

      case ActionTypes.EDITGROUP_RESPONSE:
      return {
         groupdetails: state.groupdetails,
         userdetails: state.userdetails,
         errorMessage:action.message,
         agents : state.agents,
         deptagents :state.deptagents,
        }; 

      case ActionTypes.EDITAGENT_RESPONSE:
      return {
         groupdetails: state.groupdetails,
         userdetails: state.userdetails,
         errorMessage:action.message,
         agents : state.agents,
         deptagents :state.deptagents,
         agent: state.agent,
        };  
        

        case ActionTypes.SHOW_SPECIFIC_CHAT:
        return {
           groupdetails: state.groupdetails,
           userdetails: state.userdetails,
           chat:action.chat,
           agents : state.agents,
           deptagents :state.deptagents,

          };

          case ActionTypes.SHOW_SPECIFIC_CHAT_ERROR:
          return {
             groupdetails: state.groupdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,

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
  signup
})








export default appReducer;
