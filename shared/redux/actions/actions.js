import * as ActionTypes from '../constants/constants';
import Config from '../../../server/config';
import fetch from 'isomorphic-fetch';
import { CALL_API } from '../middleware/api'
import Router from 'react-router';
import cookie from 'react-cookie';
import RouterContainer from '../../services/RouterContainer';
import { browserHistory } from 'react-router'

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${Config.port}`) : '';

// There are three possible states for our login
// process and we need actions for each of them

// Feature test

export function addGroup(group) {
  console.log(group);
  return {
    type: ActionTypes.ADD_GROUP,
    deptname: group.deptname,
    deptdescription: group.deptdescription,
   
  };
}
function requestLogin(creds) {
  return {
    type: ActionTypes.LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}

function receiveLogin(user) {

  return {
    type: ActionTypes.LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    id_token: user.token.token
  }
}

function loginError(message) {
  console.log(message);
  return {
    type: ActionTypes.LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

// Three possible states for our logout process as well.
// Since we are using JWTs, we just need to remove the token
// from localStorage. These actions are more useful if we
// were calling the API to log the user out


function requestLogout() {
  return {
    type: ActionTypes.LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  }
}

function receiveLogout() {
  return {
    type: ActionTypes.LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  }
}

// Calls the API to get a token and
// dispatches actions along the way
export function loginUser(creds) {
  console.log(creds);
  let config = {
    method: 'post',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({
      'email' :    creds.email,
      'password'  :creds.password,
      'website' :  creds.website

    })
}

return dispatch => {
  // We dispatch requestLogin to kickoff the call to the API
  dispatch(requestLogin(creds))
  return fetch(`${baseURL}/api/getlogin`, config)
      .then(response =>
    response.json()
      .then(user => ({ user, response }))
).then(({ user, response }) =>  {
    if (!response.ok) {
    // If there was a problem, we want to
    // dispatch the error condition
    dispatch(loginError(user.message))
    return Promise.reject(user)
  }
else {
    // If login was successful, set the token in local storage
      cookie.save('token', user.token.token, { path: '/' });
      console.log(cookie.load('token'));
      browserHistory.push('/dashboard')

      // Dispatch the success action
    //  dispatch(receiveLogin(user))
  }
}).catch(err => console.log("Error: ", err))
}
}

// Logs the user out
export function logoutUser() {
  return dispatch => {
    dispatch(requestLogout())
    cookie.remove('token', { path: '/' });
    dispatch(receiveLogout())
    browserHistory.push('/login')
  }
}

/*************** signup actions ***********/

export function showSignupResponse(res) {
  console.log(res);
  return {
    type: ActionTypes.ADD_WARNINGS,
    signup : res,

  };
}

export function showUsername(user) {
  console.log(user);
  return {
    type: ActionTypes.ADD_USER_DETAILS,
    user,

  };
}

export function showGroups(groups) {
  console.log(groups);
  return {
    type: ActionTypes.ADD_GROUPS,
    groups,

  };
}




export function signupuser(user) {
  console.log(user);
  return (dispatch) => {
    fetch(`${baseURL}/api/signupUser`, {
      method: 'post',
        body: JSON.stringify({
        'firstname' :user.firstname,
        'lastname'  :user.lastname,
        'email'     :user.email,
        'phone'     :user.phone,
        'password'   : user.password,
        'companyName':user.companyName,
        'website' : user.website

      }),
        headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res.signup).then(res => dispatch(showSignupResponse(res)));
  };
}


/****** get user details ***/
export function getuser(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getuser`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token,
        'Pragma': 'no-cache'
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showUsername(res)));
  };
}

/****** get user details ***/
export function getusergroups(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getgroups`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showGroups(res)));
  };
}


export function creategroup(group) {
  return (dispatch) => {
    fetch(`${baseURL}/api/creategroup`, {
      method: 'post',
      body: JSON.stringify({
          deptname: group.name,
          deptdescription: group.description,
        
      }),
      headers: new Headers({
         'Authorization': group.usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(addGroup(res)));
  };
}