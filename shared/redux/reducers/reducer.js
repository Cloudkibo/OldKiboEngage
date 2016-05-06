import { combineReducers } from 'redux'
import * as ActionTypes from '../constants/constants';
import { push } from 'react-router-redux';
import store from '../store/configureStore'
const initialState = { signupwarnings: {},userdetails : {}};

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

const dashboard = (state =initialState, action) => {
  switch (action.type) {

   case ActionTypes.ADD_USER_DETAILS:
          console.log(action.user.firstname)
          return{
            userdetails:action.user,
           
          };
   case ActionTypes.ADD_GROUPS:
          console.log(action.groups)
          return{
            groupdetails:action.groups,
           
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
