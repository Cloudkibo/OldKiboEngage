import * as ActionTypes from '../constants/constants';
import Config from '../../../server/config';
import fetch from 'isomorphic-fetch';
import { CALL_API } from '../middleware/api'
import Router from 'react-router';
import cookie from 'react-cookie';
import RouterContainer from '../../services/RouterContainer';
import { browserHistory } from 'react-router'

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${Config.port}`) : '';


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





export function showSpecificChat(chat) {
  console.log(chat);
  return {
    type: ActionTypes.SHOW_SPECIFIC_CHAT,
    chat,

  };
}

export function fetchSpecificChat(data) {
  return (dispatch) => {
    fetch(`${baseURL}/api/userchats/getSpecificChat`, {
      method: 'post',
      body: JSON.stringify({
          request_id: group.request_id,
          companyid: group.companyid,

      }),
      headers: new Headers({
         'Authorization': data.usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
          console.log(res.statusCode);
          if(res.statusCode != 200){
            dispatch(showSpecificChat_Error(res.message));
          }
          else{
            dispatch(showSpecificChat(res.message))
          }
        }
    );
  };
}

export function showSpecificChat_Error(chat_error) {
  console.log(chat_error);
  return {
    type: ActionTypes.SHOW_SPECIFIC_CHAT_ERROR,
    chat_error,

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
        'website' : user.website,
        'token'   : user.token,
      }),
        headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res.signup).then((res) => dispatch(showSignupResponse(res))  
      
   
      );
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


/********************************************************************************************/
/*              GROUP RELATED actions                                                       */

/********************************************************************************************/

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

export function creategroupError(message) {
  console.log(message);
  return {
    type: ActionTypes.CREATEGROUP_FAILURE,
    message,
  }
}

export function editgroupError(message) {
  console.log(message);
  return {
    type: ActionTypes.EDITGROUP_RESPONSE,
    message,
  }
}

export function showGroups(groups) {
  console.log(groups);
  return {
    type: ActionTypes.ADD_GROUPS,
    groups,

  };
}
export function addGroup(group) {
  console.log(group);
  return {
    type: ActionTypes.ADD_GROUP,
    deptname: group.deptname,
    deptdescription: group.deptdescription,

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
    }).then((res) => res.json()).then((res) => res).then((res) => {
        console.log(res.statusCode);
          if(res.statusCode != 200){
          dispatch(creategroupError(res.message));
        }
        else{
              dispatch(showGroups(res.message))
            }
        }
    );
  };
}


export function editGroup(group) {
  console.log('editGroup action called');
  console.log(group.deptagents);
  alert(group)
  return (dispatch) => {
    fetch(`${baseURL}/api/editgroup`, {
      method: 'post',
      body: JSON.stringify({
        dept :{
          _id:group.id,
          deptname: group.name,
          deptdescription: group.desc,
        },
        deptagents: group.deptagents

      })
      ,
      headers: new Headers({
         'Authorization': group.token,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
         console.log(res.statusCode);
         alert(res.message);
         dispatch(editgroupError(res.message));


        }
    );
  };
}

export function addSelectedGroup(group) {
  console.log(group)
  return {
    type: ActionTypes.ADD_SELECTED_GROUP,
    group,
  };
}




export function getGroupRequest(group,usertoken) {
  console.log('getGroupRequest is called '+ group);
  return (dispatch) => {
    return fetch(`${baseURL}/api/getGroup?id=${group}`, {
      method: 'get',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(addSelectedGroup(res.group)));
  };
}

export function deleteGROUP(group) {
  return {
    type: ActionTypes.DELETE_GROUP,
    group,
  };
}
export function deletegroup(group,usertoken) {
  console.log('deletegroup Action is called '+ group._id + 'your token : '  + usertoken);
  if(confirm("Do you want to delete this group?"))
  {
  return (dispatch) => {
    return fetch(`${baseURL}/api/deleteGroup?id=${group._id}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(deleteGROUP(group)));
  };
}
else{
  browserHistory.push('/groups');

}

}







/***************************************************************************************************/
/*              AGENT RELATED actions                                                              */
/***************************************************************************************************/

export function getAgentRequest(id,usertoken) {
  console.log(id)
  return {
    type: ActionTypes.ADD_SELECTED_AGENT,
    id,
  };
}
export function showAgents(agents) {
  console.log(agents);
  return {
    type: ActionTypes.ADD_AGENTS,
    agents,

  };
}

export function showDeptAgents(agents) {
  console.log(agents);
  return {
    type: ActionTypes.ADD_DEPTAGENTS,
    agents,

  };
}

export function editagentError(message) {
  console.log(message);
  return {
    type: ActionTypes.EDITAGENT_RESPONSE,
    message,
  }
}
export function inviteAgentResponse(message) {
  alert(message);
  return {
    type: ActionTypes.INVITE_AGENT_RESPONSE,
    message,
  }
}


/****** get user details ***/
export function getAgents(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getagents`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token,
        'Pragma': 'no-cache'
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showAgents(res)));
  };
}

/****** get user details ***/
export function getDeptAgents(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/deptagents`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token,
        'Pragma': 'no-cache'
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showDeptAgents(res)));
  };
}

export function editAgent(id,role,token) {
  console.log('editAgent action called');
  alert(role)
  return (dispatch) => {
    fetch(`${baseURL}/api/editagent`, {
      method: 'post',
      body: JSON.stringify({
        
          personid:id,
          role: role       
        
      })     
      ,
      headers: new Headers({
         'Authorization': token,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
        console.log(res.statusCode);
         dispatch(editagentError(res.message));
        
           
        }
    );
  };
}

export function inviteagent(email,token) {
  console.log('invite agent action called');
  return (dispatch) => {
    fetch(`${baseURL}/api/inviteAgent`, {
      method: 'post',
      body: JSON.stringify({
        email : email
        
      })     
      ,
      headers: new Headers({
        'Authorization': token,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
        console.log(res.statusCode);
         dispatch(inviteAgentResponse(res.message));
        
           
        }
    );
  };
}

export function joinCompanyResponse(inviteDetails) {
  return {
    type: ActionTypes.JOIN_COMPANY,
    inviteDetails,
  };
}

 
export function getInviteEmail(token) {
 console.log('getInviteEmail is called '+ token);
  return (dispatch) => {
    return fetch(`${baseURL}/api/invitetoken?id=${token}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }), 
    }).then((res) => res.json()).then((res) => res).then((res) =>{
      console.log(res.statusCode);
          if(res.statusCode == 200){

            dispatch(joinCompanyResponse(res.body));

          }
          else{
            browserHistory.push('/joincompanyfailure')
          }
    }) 

      };
}

export function verifyEmail(token) {
 console.log('verifyEmail is called '+ token);
  return (dispatch) => {
    return fetch(`${baseURL}/api/verifytoken?id=${token}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }), 
    }).then((res) => res.json()).then((res) => res).then((res) =>{
      console.log(res.statusCode);
          if(res.statusCode != 200){

            browserHistory.push('/verificationfailure')
          }
    }) 

      };
}


export function deleteAGENT(agent) {
  return {
    type: ActionTypes.DELETE_AGENT,
    agent,
  };
}
export function deleteagent(agent,usertoken) {
  console.log('deleteagent Action is called '+ agent._id + 'your token : '  + usertoken);
  if(confirm("Do you want to delete this agent?"))
  {
  return (dispatch) => {
    return fetch(`${baseURL}/api/deleteAgent?id=${agent._id}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(deleteAGENT(agent)));
  };
}
else{
  browserHistory.push('/agents');

}

}



/*************************************************************************************************/
/*                      Channel Related Actions                                                  */ 

/*************************************************************************************************/

export function createChannel(channel,usertoken){
  console.log(channel);
  console.log(usertoken);
  console.log('create message channel is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/createChannel`, {
      method: 'post',
      headers: new Headers({
         'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
      channel : channel
      })       
      
      ,
    }).then((res) => res.json()).then((res) => res).then((res) => {
        console.log(res.statusCode);
         //dispatch(createeditagentError(res.message));
        
           
        }
    );
  };
}


export function editChannel(channel,usertoken){
  console.log(channel);
  console.log(usertoken);
  console.log('edit message channel is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/editChannel`, {
      method: 'post',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
      channel : channel
      })       
      
      ,
    }).then((res) => res.json()).then((res) => res).then((res) => {
      
        browserHistory.push('/messagechannels');
           
        }
    );
  };
}

export function showChannels(channels) {
  console.log(channels);
  return {
    type: ActionTypes.ADD_CHANNELS,
    channels,

  };
}

/*** get channels ***/
export function getchannels(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getchannels`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showChannels(res)));
  };
}

export function getChannelRequest(id,usertoken) {
  console.log(id)
  return {
    type: ActionTypes.ADD_SELECTED_CHANNEL,
    id,
  };
}

export function deleteCHANNEL(channel) {
  return {
    type: ActionTypes.DELETE_CHANNEL,
   channel,
  };
}
export function deletechannel(channel,usertoken) {
  console.log('deletechannel Action is called '+ channel._id + 'your token : '  + usertoken);
  if(confirm("Do you want to delete this message channel?"))
  {
  return (dispatch) => {
    return fetch(`${baseURL}/api/deleteChannel?id=${channel._id}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res).then(res => dispatch(deleteCHANNEL(channel)));
  };
}
else{
  browserHistory.push('/messagechannels');

}

}


/**********************************************************************************************/
/*          CANNED RESPONSE RELATED Actions                                                   */
/*********************************************************************************************/


export function createResponse(response,usertoken){
  console.log(response);
  console.log(usertoken);
  console.log('create response is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/createResponse`, {
      method: 'post',
      headers: new Headers({
         'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
      response : response
      })       
      
      ,
    }).then((res) => res.json()).then((res) => res).then((res) => {
        console.log(res);
         dispatch(showResponse(response))
           
        }
    );
  };
}


export function editResponse(response,usertoken){
  console.log(response);
  console.log(usertoken);
  console.log('edit response is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/editResponse`, {
      method: 'post',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
      response : response
      })       
      
      ,
    }).then((res) => res.json()).then((res) => res).then((res) => {
        console.log(res.statusCode);
        browserHistory.push('/cannedresponses');
           
        }
    );
  };
}

export function showResponses(responses) {
  console.log(responses);
  return {
    type: ActionTypes.ADD_RESPONSES,
    responses,

  };
}
export function showResponse(response) {
  console.log(response);
  return {
    type: ActionTypes.ADD_NEW_RESPONSE,
    response,

  };
}

/*** get channels ***/
export function getresponses(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getresponses`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showResponses(res)));
  };
}

export function getResponseRequest(id,usertoken) {
  console.log(id)
  return {
    type: ActionTypes.ADD_SELECTED_RESPONSE,
    id,
  };
}

export function deleteRESPONSE(response) {
  return {
    type: ActionTypes.DELETE_RESPONSE,
   response,
  };
}
export function deleteresponse(response,usertoken) {
  console.log('deleteresponse Action is called '+ response._id + 'your token : '  + usertoken);
  if(confirm("Do you want to delete this canned response?"))
  {
  return (dispatch) => {
    return fetch(`${baseURL}/api/deleteResponse?id=${response._id}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res).then(res => dispatch(deleteRESPONSE(response)));
  };
}
else{
  browserHistory.push('/cannedresponses');

}

}





/***************** Chat Actions ********************/
export function showAllChat() {
 var customerchat = [{'name' : 'John','group' :'IT','lastmsg' :'I need help in software installation' },
                  {'name' : 'Alice','group' :'Sales','lastmsg' :'I didnt get my order yet' },
                  {'name' : 'Joe','group' :'Payment','lastmsg' :'Please confirm Payment status' }]
  
   var customerid = 1;
  console.log(customerchat);
  return {
    type: ActionTypes.SHOW_ALL_CHAT,
    customerchat,
    customerid,

  };
}

export function getChatRequest(customerid,token){
  var chatlist =[];
  var customerid = 1;
  console.log(chatlist);
  return {
    type: ActionTypes.SHOW_CHAT_HISTORY,
    chatlist,
    customerid,

  };
}


export function updateChatList(message)
{
   return {
    type: ActionTypes.ADD_CHAT_MESSAGE,
    message

  };
}



/********************** Notifications Actions ***********************************/
export function showNotifications(notifications) {
  return {
    type: ActionTypes.SHOW_NOTIFICATIONS,
    notifications,
  };
}

/*** get notifications ***/
export function getnotifications(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getnotifications`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showNotifications(res)));
  };
}


export function confirmNotification(res){
      console.log(res);
  return {
    type: ActionTypes.CONFIRM_NOTIFICATION,
    msg:'success',

  };
}


export function createNotification(notification,usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/createNotification`, {
      method: 'post',
      body: JSON.stringify({
        notification: notification,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,
      }),
    }).then((res) => res.json()).then(res => dispatch(confirmNotification(res.notification)));
  };
}




export function deleteNOTIFICATION(notification) {
  return {
    type: ActionTypes.DELETE_NOTIFICATION,
   notification,
  };
}
export function deletenotification(notification,usertoken) {
  console.log('deletenotification Action is called '+ notification._id + 'your token : '  + usertoken);
  if(confirm("Do you want to delete this notification?"))
  {
  return (dispatch) => {
    return fetch(`${baseURL}/api/deleteNotification?id=${notification._id}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res).then(res => dispatch(deleteNOTIFICATION(notification)));
  };
}
else{
  browserHistory.push('/notifications');

}

}


export function editNotification(notification,usertoken){
  console.log(notification);
  console.log(usertoken);
  console.log('edit notification is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/editNotification`, {
      method: 'post',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
      notification : notification
      })       
      
      ,
    }).then((res) => res.json()).then((res) => res).then((res) => {
        console.log(res.statusCode);
        browserHistory.push('/notifications');
           
        }
    );
  };
}


export function getNotificationRequest(id,usertoken) {
  console.log(id)
  return {
    type: ActionTypes.ADD_SELECTED_NOTIFICATION,
    id,
  };
}

/******************* Customer Directory ****************/

export function showcustomers(customers) {
  
  return {
    type: ActionTypes.SHOW_CUSTOMERS,
    customers,
  };
}

export function getcustomers(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getcustomers`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showcustomers(res)));
  };
}


export function confirmCustomer(customer) {
  return {
    type: ActionTypes.ADD_CUSTOMER,
    customer :customer,
    msg : 'success',

  };
}


export function createcustomer(customer) {
  return (dispatch) => {
    fetch(`${baseURL}/api/createCustomer`, {
      method: 'post',
      body: JSON.stringify({
        customer:customer,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
       
      }),
    }).then((res) => res.json()).then(res => dispatch(confirmCustomer(res.customer)));
  };
}
