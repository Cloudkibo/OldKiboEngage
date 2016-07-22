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


//forgot password

export function showForgotPassword(msg){
  return {
    type: ActionTypes.ADD_FORGOTPASSWORD_WARNINGS,
    errormessage : msg,

  }; 
}
export function forgotpassword(creds) {
  console.log(creds);
     return (dispatch) => {
    fetch(`${baseURL}/api/forgotpassword`, {
        method: 'post',
        headers: new Headers({
           'Content-Type':'application/json'
        }),
       body: JSON.stringify({
      'email' :    creds.email,
      'website' :  creds.website

    })

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showForgotPassword(res)));
  };

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

//this is without-token version of getting grouplist for Chat widget
export function getcustomergroups(){
 
  return (dispatch) => {
    fetch(`${baseURL}/api/getcustomergroups`, {
        method: 'get',
       
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showCustomerGroups(res)));
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

export function showCustomerGroups(groups){
  return {
    type: ActionTypes.ADD_CUSTOMER_GROUPS,
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
  //alert(group)
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
         browserHistory.push('/groups');
        // dispatch(editgroupError(res.message));


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
      }),
 }).then((res) => res.json()).then((res) => res).then((res) => {
        console.log(res.statusCode);
        browserHistory.push('/messagechannels'); 
        
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


export function updatechannellist(id){
   return {
    type: ActionTypes.FILTER_CHANNELS,
    id,

  };
}
export function showChannels(channels) {
  console.log(channels);
  return {
    type: ActionTypes.ADD_CHANNELS,
    channels,

  };
}

export function showCustomerChannels(channels) {
  console.log(channels);
  return {
    type: ActionTypes.ADD_CUSTOMER_CHANNELS,
    channels,

  };
}

/*** get channels ***/
export function getcustomerchannels(){
  return (dispatch) => {
    fetch(`${baseURL}/api/getcustomerchannels`, {
        method: 'get',
       
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showCustomerChannels(res)));
  };
}
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

export function showResponse(response) {
  console.log(response);
  return {
    type: ActionTypes.ADD_NEW_RESPONSE,
    response,

  };
}


export function createResponse(cr){
  return (dispatch) => {
    fetch(`${baseURL}/api/createResponse`, {
      method: 'post',
       body: JSON.stringify({
          shortcode : cr.shortcode,
          message:    cr.message,
          companyid :  cr.companyid
      }) ,
      headers: new Headers({
         'Authorization': cr.usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
        console.log(res.statusCode);
          if(res.statusCode != 200){
         browserHistory.push('/cannedresponses');
        }
        else{
           browserHistory.push('/cannedresponses');
            }
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
export function showAllChat(customerchat) {
/* var customerchat = [{'id': '1','username' : 'John','group' :'IT','msg' :'I need help in software installation' },
                  {'id': '2','username' : 'Alice','group' :'Sales','msg' :'I didnt get my order yet' },
                  {'id': '3','username' : 'Joe','group' :'Payment','msg' :'Please confirm Payment status' }]
 
*/

   
  console.log(customerchat);
  return {
    type: ActionTypes.SHOW_ALL_CHAT,
    customerchat,
   
  };
}


export function filterbystatus(status,customerchat) {

  var filtered;
  if(status == "all")
  {
    filtered = customerchat
  } 
 else{
   filtered = customerchat.filter((c) => c.status == status)
  
 }
 
  console.log(filtered);
                 
  console.log(customerchat);
  return {
    type: ActionTypes.FILTER_BY_STATUS,
    filtered,
    customerchat,
   
  };
}


export function filterbyDept(id,customerchat) {
 var filtered;
  if(id == "all")
  {
    filtered = customerchat
  } 
 else{
  filtered = customerchat.filter((c) => c.departmentid == id)
  
 }
  console.log(filtered);
                 
  console.log(customerchat);
  return {
    type: ActionTypes.FILTER_BY_DEPT,
    filtered,
    customerchat,
   
  };
}

export function filterbyChannel(id,customerchat) {
  
  var filtered;
  if(id == "all")
  {
    filtered = customerchat
  } 
  else{

    filtered = customerchat.filter((c) => c.messagechannel[c.messagechannel.length-1] == id)

  } 
    console.log(filtered);
                 
  console.log(customerchat);
  return {
    type: ActionTypes.FILTER_BY_CHANNEL,
    filtered,
    customerchat,
   
  };
}

export function filterbyAgent(id,customerchat) {
  
  var filtered;
  if(id == "all")
  {
    filtered = customerchat
  } 
  else{

    filtered = customerchat.filter((c) => c.agent_ids[c.agent_ids.length-1] == id)

  } 
    console.log(filtered);
                 
  console.log(customerchat);
  return {
    type: ActionTypes.FILTER_BY_AGENT,
    filtered,
    customerchat,
   
  };
}

export function selectCustomerChat(id,customerchat,new_message_arrived_rid){
  if(new_message_arrived_rid && new_message_arrived_rid.length > 0)
  {

    for(var i = new_message_arrived_rid.length - 1; i >= 0; i--){
      if(new_message_arrived_rid[i] == id){
        //remove item from array
          new_message_arrived_rid.splice(i, 1);
      }
    }

  }
  else{
    new_message_arrived_rid=[]
  }
  var customerchat_selected = customerchat.filter((c) => c.request_id == id)
  return {
    type: ActionTypes.SELECT_CUSTOMERCHAT,
    customerchat_selected,
    new_message_arrived_rid,
  }; 
}



/*** get notifications ***/
export function getsessions(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getsessions`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showAllChat(res)));
  };
}

export function getChatRequest(customerid,token,chlist){
  var chatlist =[];
  if(chlist){
      chatlist = chlist;
  }
 // var customerid = 1;
  console.log(chatlist);
  return {
    type: ActionTypes.SHOW_CHAT_HISTORY,
    chatlist,
  //  customerid,

  };
}


export function updateChatList(message,ch,id_not_added)
{
  
  // id_not_added is the request_id of the customer with whom agent is already having chat
  var new_message_arrived_rid = message.request_id;
  if(ch){
    if(new_message_arrived_rid != id_not_added){
    ch.push(new_message_arrived_rid);
      }
   }
   else{
    ch =[];
    if(new_message_arrived_rid != id_not_added){
    ch.push(new_message_arrived_rid);
      }
   
   }
   return {
    type: ActionTypes.ADD_CHAT_MESSAGE,
    message,
    ch,

  };
}

export function updateSessionList(customerchat)
{
   return {
    type: ActionTypes.ADD_SESSION,
    customerchat

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


export function createNotification(notification) {
  return (dispatch) => {
    fetch(`${baseURL}/api/createNotification`, {
      method: 'post',
      body: JSON.stringify({
        notification: notification.notification,
        customers : notification.customers
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': notification.usertoken,

      }),
    }).then((res) => res.json()).then(res => {

        browserHistory.push('/notifications'); 
    });
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

export function getCustomerRequest(id) {
  console.log(id)
  return {
    type: ActionTypes.ADD_SELECTED_CUSTOMER,
    id,
  };
}
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


export function  emailCustomer(customer) {
  console.log(customer);  
  return (dispatch) => {
    fetch(`${baseURL}/api/emailCustomer`, {
      method: 'post',
      body: JSON.stringify({
        to : customer.emailMsg.to,
        emailAdd : customer.emailMsg.emailAdd,
        subject : customer.emailMsg.subject,
        body : customer.emailMsg.body,
        from : customer.emailMsg.from,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': customer.usertoken,

      }),
    }).then((res) => res.json()).then(res => {
      console.log(res.statusCode);
        if(res.statusCode == 200){
        alert('Email sent successfully.');  
        browserHistory.push('/customers'); 
      }
       else{
        alert('Email not sent to customer.There might be some errors.');  
        browserHistory.push('/customers'); 
      }
    });
  };
}


export function confirmSession(session) {
  return {
    type: ActionTypes.CREATE_SESSION,
    session,
    msg : 'success',

  };
}

export function addRoom(room) {
  return {
    type: ActionTypes.ADD_ROOM_DETAILS,
    room,
   

  };
}

export function updateAgentList(onlineAgents){
  return {
    type : ActionTypes.ONLINE_AGENTS,
    onlineAgents,
  }
}

/***** session create ****/
export function  createsession(session) {
  console.log(session);  
  return (dispatch) => {
    fetch(`${baseURL}/api/createsession`, {
      method: 'post',
       headers: new Headers({
        'Content-Type': 'application/json',
      
      }),
      body: JSON.stringify({
          session : session
      }),       
      
     
    }).then((res) => res.json()).then(res => {
        console.log(res.statusCode);
        if(res.statusCode == 201){
        alert('session created successfully.');  
        dispatch(confirmSession(session));
      }
       else{
        alert('Session not created');  
        
      }
    });
  };
}


export function  savechat(chat) {
  console.log(chat);  
  return (dispatch) => {
    fetch(`${baseURL}/api/savechat`, {
      method: 'post',
       headers: new Headers({
        'Content-Type': 'application/json',
      
      }),
      body: JSON.stringify({
          chat:chat
      }),       
      
     
    }).then((res) => res.json()).then(res => {
        console.log(res.statusCode);
        if(res.statusCode == 201){
        console.log('chat saved.');  
       
      }
       else{
         console.log('chat not saved.'); 
        
      }
    });
  };
}



/**** update chat status when the session is assigned to agent ***/

export function updateSessionStatus(session){

  console.log('updateSessionStatus is called');

}

export function assignToAgentResponse(session){

  console.log('assignToAgentResponse is called');
}
export function resolvesessionResponse(){

  console.log('resolvesession called');
}

export function movedToMessageChannelResponse(session){
  console.log('assignToChannelResponse is called');
}
//this is for picking session
export function updatestatus(session) {
  return (dispatch) => {
    fetch(`${baseURL}/api/pickchatsession`, {
      method: 'post',
      body: JSON.stringify({
        request_id : session.request_id,
        
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
       'Authorization': session.usertoken,
      }),
    }).then((res) => res.json()).then(res => dispatch(updateSessionStatus(session)));
  };
}

/**** update agent assignment table when the session is assigned to agent ***/

export function assignToAgent(session,usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/assignToAgent`, {
      method: 'post',
      body: JSON.stringify({
        companyid : session.companyid,
        sessionid : session.sessionid,
        agentAssignment : session,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,
       
      }),
    }).then((res) => res.json()).then(res => dispatch(assignToAgentResponse(session)));
  };
}

//moved to message channel
export function movedToMessageChannel(session,usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/movedToMessageChannel`, {
      method: 'post',
      body: JSON.stringify({
        companyid : session.companyid,
        sessionid : session.sessionid,
        channelAssignment : session,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,
       
      }),
    }).then((res) => res.json()).then(res => dispatch(movedToMessageChannelResponse(session)));
  };
}



export function showuserchat(userchats) {
  return {
    type: ActionTypes.ADD_USER_CHATS,
    userchats,
   

  };
}


export function getuserchats(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getuserchats`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showuserchat(res.userchats)));
  };
}


//mark session resolve
export function resolvesession(request_id,usertoken) {
  if(confirm("Are you sure,you want to mark session resolved?")){
  return (dispatch) => {
    fetch(`${baseURL}/api/resolvechatsession`, {
      method: 'post',
      body: JSON.stringify({
        request_id : request_id,
       }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,
       
      }),
    }).then((res) => res.json()).then(res => dispatch(resolvesessionResponse()));
  };
}
}

