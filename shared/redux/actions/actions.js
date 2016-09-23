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

export function resetpassword(creds) {
  console.log(creds);
     return (dispatch) => {
    fetch(`${baseURL}/api/changepassword`, {
        method: 'post',
        headers: new Headers({
           'Content-Type':'application/json'
        }),
       body: JSON.stringify({
      'token' :    creds.token,
      'password' :  creds.password

    })

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showForgotPassword(res)));
  };

}




// verify password reset token

export function showTokenResponse(status){
  var s = '';
  if(status == 200){
    console.log('status is '+ status);
    s = 'success';

  }
  else{
    s = 'fail'
  }

  return {
    type: ActionTypes.SHOW_TOKEN_RESPONSE,
    errormessage : s,

  }; 


}
export function verifyPasswordResettoken(token) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/verifypasswordResettoken?id=${token}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }), 
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showTokenResponse(res.statusCode))  
      
   
      );
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
          request_id: team.request_id,
          companyid: team.companyid,

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
/*              Team RELATED actions                                                       */

/********************************************************************************************/

/****** get user details ***/
export function getuserteams(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getteams`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showTeams(res)));
  };
}

//this is without-token version of getting teamlist for Chat widget
export function getcustomerteams(){
 
  return (dispatch) => {
    fetch(`${baseURL}/api/getcustomerteams`, {
        method: 'get',
       
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showCustomerTeams(res)));
  };
}

export function getspecificsession(requestid) {
  console.log('requestid is ' + requestid);
  return (dispatch) => {
    fetch(`${baseURL}/api/getcustomersession/`, {
        method: 'post',
        body: JSON.stringify({
          request_id: requestid,
         

      })
        ,
        headers: new Headers({
        'Content-Type': 'application/json',
      }),
      
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showCustomerSession(res)));
  };
}
export function getspecificcustomer(customerid) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getcustomerdetails/`, {
        method: 'post',
        body: JSON.stringify({
          customerid: customerid,
         

      })
        ,
        headers: new Headers({
        'Content-Type': 'application/json',
      }),
      
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showCustomerDetails(res)));
  };
}
export function createteamError(message) {
  console.log(message);
  return {
    type: ActionTypes.CREATEGROUP_FAILURE,
    message,
  }
}

export function editteamError(message) {
  console.log(message);
  return {
    type: ActionTypes.EDITGROUP_RESPONSE,
    message,
  }
}

export function showTeams(teams) {
  console.log(teams);
  return {
    type: ActionTypes.ADD_TEAMS,
    teams,

  };
}

export function showCustomerTeams(teams){
  return {
    type: ActionTypes.ADD_CUSTOMER_TEAMS,
    teams,

  };
}

export function showCustomerSession(specificsession){
  return {
    type: ActionTypes.ADD_CUSTOMER_SESSION,
    specificsession,
    

  };
}

export function showCustomerDetails(specificcustomer){
  return {
    type: ActionTypes.ADD_CUSTOMER_DETAILS,
    specificcustomer,
    

  };
}
export function addTeam(team) {
  console.log(team);
  return {
    type: ActionTypes.ADD_TEAM,
    deptname: team.deptname,
    deptdescription: team.deptdescription,

  };
}


export function createteam(team) {
    
  return (dispatch) => {
    fetch(`${baseURL}/api/createteam`, {
      method: 'post',
      body: JSON.stringify({
          deptname: team.name,
          deptdescription: team.description,

      }),
    
      headers: new Headers({
         'Authorization': team.usertoken,
        'Content-Type': 'application/json',
      }),
     
    }).then((res) => res.json()).then((res) => res).then((res) => {
        console.log(res.statusCode);
          if(res.statusCode != 200){

          dispatch(createteamError(res.message));
        }
        else{
           dispatch(showTeams(res.message))
            }
        }
    );
  };
}


export function editTeam(team) {
  console.log('editTeam action called');
  console.log(team.deptagents);
  //alert(team)
  return (dispatch) => {
    fetch(`${baseURL}/api/editteam`, {
      method: 'post',
      body: JSON.stringify({
        dept :{
          _id:team.id,
          deptname: team.name,
          deptdescription: team.desc,
        },
        deptagents: team.deptagents

      })
      ,
      headers: new Headers({
         'Authorization': team.token,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
         console.log(res.statusCode);
         alert(res.message);
         browserHistory.push('/teams');
        // dispatch(editteamError(res.message));


        }
    );
  };
}



export function editGroup(group) {
  //alert(team)
  return (dispatch) => {
    fetch(`${baseURL}/api/editgroup`, {
      method: 'post',
      body: JSON.stringify({
        group :{
          _id:group.id,
          groupname: group.name,
          groupdescription: group.desc,
          status : group.status,
        },
        groupagents: group.groupagents

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
    
        }
    );
  };
}


export function addSelectedTeam(team) {
  console.log(team)
  return {
    type: ActionTypes.ADD_SELECTED_TEAM,
    team,
  };
}

export function addSelectedGroup(group) {
  return {
    type: ActionTypes.ADD_SELECTED_GROUP,
    group,
  };
}



export function getTeamRequest(team,usertoken) {
  console.log('getTeamRequest is called '+ team);
  return (dispatch) => {
    return fetch(`${baseURL}/api/getTeam?id=${team}`, {
      method: 'get',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(addSelectedTeam(res.team)));
  };
}


export function getGroupRequest(group,usertoken) {
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


export function deleteGROUP(team) {
  return {
    type: ActionTypes.DELETE_TEAM,
    team,
  };
}
export function deleteteam(team,usertoken) {
  console.log('deleteteam Action is called '+ team._id + 'your token : '  + usertoken);
  if(confirm("Do you want to delete this team?"))
  {
  return (dispatch) => {
    return fetch(`${baseURL}/api/deleteTeam?id=${team._id}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(deleteGROUP(team)));
  };
}
else{
  browserHistory.push('/teams');

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

export function showGroupAgents(agents) {
  console.log(agents);
  return {
    type: ActionTypes.ADD_GROUPAGENTS,
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


/****** get user details ***/
export function getGroupAgents(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/groupagents`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token,
        'Pragma': 'no-cache'
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showGroupAgents(res)));
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


export function getSessionDetailsRequest(id,usertoken)
{
  return {
    type: ActionTypes.ADD_SELECTED_SESSIONSUMMARY,
    id,
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

export function getsessionsfromsocket(customerchat){
  return {
    type: ActionTypes.SHOW_ALL_CHAT,
    customerchat,
   
  };
}

export function getsessionsfromserver(customerchat){
// add a filter here to filter only mobile clients sessions
customerchat = customerchat.filter((c) => c.platform == "mobile")

  return {
    type: ActionTypes.SHOW_ALL_CHAT,
    customerchat,
    serverresponse : 'received',
   
  };
}

export function showChatSummary(sessions){
  return {
    type: ActionTypes.SHOW_CHAT_SUMMARY,
    sessionsummary : sessions,
   
  };
}
export function showAllChat(customerchat) {
/* var customerchat = [{'id': '1','username' : 'John','team' :'IT','msg' :'I need help in software installation' },
                  {'id': '2','username' : 'Alice','team' :'Sales','msg' :'I didnt get my order yet' },
                  {'id': '3','username' : 'Joe','team' :'Payment','msg' :'Please confirm Payment status' }]
 
*/

  return {
    type: ActionTypes.SHOW_ALL_CHAT,
    customerchat,
   
  };
}

export function showMyPickChatSessions(sessions,userid){
  var mypickedsessions = sessions.filter((c) => c.status != "new" && c.agent_ids.length>0 && c.agent_ids[c.agent_ids.length-1] == userid)
  return {
    type: ActionTypes.SHOW_MY_PICKED_SESSIONS,
    mypickedsessions : mypickedsessions,
   
  };
}


export function showNewChatSessions(sessions){
  var newsessions = sessions.filter((c) => c.status == "new")
  return {
    type: ActionTypes.SHOW_NEW_SESSIONS,
    newsessions : newsessions,
   
  };
}

export function showAssignedChatSessions(sessions){
  var assignedsessions = sessions.filter((c) => c.status == "assigned" && c.agent_ids.length>0)
  return {
    type: ActionTypes.SHOW_ASSIGNED_SESSIONS,
    assignedsessions : assignedsessions,
   
  };
}

export function showResolvedChatSessions(sessions){
  var resolvedsessions = sessions.filter((c) => c.status == "resolved" && c.agent_ids.length>0)
  return {
    type: ActionTypes.SHOW_RESOLVED_SESSIONS,
    resolvedsessions : resolvedsessions,
   
  };
}



export function getresolvedsessionsfromsocket(sessions,serversessions){
  var resolvedsocketsessions = sessions.filter((c) => c.status == "resolved")
  for(var j=0;j<resolvedsocketsessions.length-1;j++){
     for(var i=0;i<serversessions.length-1;i++){
  
      if(serversessions[i].request_id == resolvedsocketsessions[j].request_id){
        serversessions.splice(i,1);
        break;
      }
    }
  }
  return {
    type: ActionTypes.SHOW_RESOLVED_SOCKET_SESSIONS,
    resolvedsocketsessions : resolvedsocketsessions,
    resolvedsessions : serversessions,
  }; 
}

export function getnewsessionsfromsocket(sessions,serversessions){
  var newsocketsessions = sessions.filter((c) => c.status == "new")
  for(var j=0;j<newsocketsessions.length-1;j++){
     for(var i=0;i<serversessions.length-1;i++){
  
      if(serversessions[i].request_id == newsocketsessions[j].request_id){
        serversessions.splice(i,1);
        break;
      }
    }
  }
  return {
    type: ActionTypes.SHOW_NEW_SOCKET_SESSIONS,
    newsocketsessions : newsocketsessions,
    newsessions : serversessions,
  }; 
}

export function getassignedsessionsfromsocket(sessions,serversessions){
  var assignedsocketsessions = sessions.filter((c) => c.status == "assigned")
  for(var j=0;j<assignedsocketsessions.length-1;j++){
     for(var i=0;i<serversessions.length-1;i++){
  
      if(serversessions[i].request_id == assignedsocketsessions[j].request_id){
        serversessions.splice(i,1);
        break;
      }
    }
  }
  return {
    type: ActionTypes.SHOW_ASSIGNED_SOCKET_SESSIONS,
    assignedsocketsessions : assignedsocketsessions,
    assignedsessions : serversessions,
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

    filtered = customerchat.filter((c) => c.messagechannel == id)

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

    filtered = customerchat.filter((c) => c.agent_ids == id)

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



export function getmypickedsessions(token,userid){
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getsessions`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showMyPickChatSessions(res,userid)));
  };
}


//get new sessions list

export function getnewsessions(token){
  console.log(token);


  return (dispatch) => {
    fetch(`${baseURL}/api/getsessions`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showNewChatSessions(res)));
  };
}


export function getresolvedsessions(token){
  console.log(token);


  return (dispatch) => {
    fetch(`${baseURL}/api/getsessions`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showResolvedChatSessions(res)));
  };
}




export function getassignedsessions(token){
  console.log(token);


  return (dispatch) => {
    fetch(`${baseURL}/api/getsessions`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showAssignedChatSessions(res)));
  };
}

/*** get session for Chat Summary Page ***/
export function getsessions(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getsessions`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showChatSummary(res)));
  };
}

// for fetching mobile clients sesions
export function getmobilesessions(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getsessions`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(getsessionsfromserver(res)));
  };
}

export function previousChat(chatlist){
    return {
    type: ActionTypes.SHOW_CHAT_HISTORY,
    chatlist,
  //  customerid,

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
  if(!id_not_added){
    if(ch){
    ch.push(new_message_arrived_rid);
  }
  else{
    ch =[];
    ch.push(new_message_arrived_rid);
  }
    
  }
  else
    {
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

export function uploadpicture(data,fname,token,picture) {
  console.log(data);
  var values = {
       file: data,
       fileName:fname,
       oldprofile : picture
     
     };
  return (dispatch) => {
    fetch(`${baseURL}/api/uploadpicture`, {
      method: 'post',
        body: JSON.stringify(values),
        headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showUpdateProfile(res))  
      
   
      );
  };

};


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




export function  submitemail(customer) {
  console.log(customer);  
 return (dispatch) => {
    fetch(`${baseURL}/api/rescheduleEmail`, {
      method: 'post',
      body: JSON.stringify({
        to : customer.emailMsg.to,
        emailAdd : customer.emailMsg.emailAdd,
        subject : customer.emailMsg.subject,
        body : customer.emailMsg.body,
        from : customer.emailMsg.from,
        url : customer.emailMsg.url
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': customer.usertoken,

      }),
    }).then((res) => res.json()).then(res => {
      console.log(res.statusCode);
        if(res.statusCode == 200){
        alert('Email sent successfully.');  
        browserHistory.push('/dashboard'); 
      }
       else{
        alert('Email not sent to customer.There might be some errors.');  
        browserHistory.push('/dashboard'); 
      }
    });
  };
}



export function  updatereschedule(session,customer) {
  return (dispatch) => {
    fetch(`${baseURL}/api/updatereschedule`, {
      method: 'post',
      body: JSON.stringify({
        is_rescheduled : session.is_rescheduled,
        rescheduled_by : session.rescheduled_by,
        request_id : session.request_id,
        companyid : session.companyid,
       
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': session.usertoken,

      }),
    }).then((res) => res.json()).then(res => dispatch(submitemail(customer)));
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
       // alert('session created successfully.');  
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
  return {
    type : ActionTypes.UPDATE_SESSION_STATUS,
    session,
  }

}

export function assignToAgentResponse(session){

  console.log('assignToAgentResponse is called');
   return {
    type : ActionTypes.ASSIGN_CHAT_TO_AGENT,
    session,
  }
}
export function resolvesessionResponse(){

  console.log('resolvesession called');
   return {
    type : ActionTypes.RESOLVE_SESSION,
    
  }
}

export function movedToMessageChannelResponse(session){
  console.log('assignToChannelResponse is called');
   return {
    type : ActionTypes.MOVE_TO_MESSAGECHANNEL,
    session,
  }
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


export function setsocketid(yoursocketid){
  return {
    type: ActionTypes.SET_SOCKET_ID,
    yoursocketid,
   

  };
}

export function getchatsfromsocket(data){
   return {
    type: ActionTypes.ADD_USER_CHATS,
    userchats : data,
   

  };
}
export function showuserchat(userchats) {
  return {
    type: ActionTypes.ADD_USER_CHATS,
    userchats,
   

  };
}


export function showuserchatspecific(userchats) {
  return {
    type: ActionTypes.ADD_USER_CHATS_SPECIFIC,
    userchathistory : userchats,
   

  };
}


export function showuserchatspecific_mobile(userchats) {
  return {
    type: ActionTypes.ADD_USER_CHATS_SPECIFIC_MOBILE,
    mobileuserchat : userchats,
   

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



//for fetching history of mobile clients
export function getspecificuserchats_mobile(request_id,companyid,usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getspecificuserchats`, {
      method: 'post',
      body: JSON.stringify({
        request_id : request_id,
        companyid : companyid,
       }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,
       
      }),
    }).then((res) => res.json()).then(res => dispatch(showuserchatspecific_mobile(res.userchats)));
  };

}


//get specific chat messages history
// for session summary page


export function getspecificuserchats(request_id,companyid,usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getspecificuserchats`, {
      method: 'post',
      body: JSON.stringify({
        request_id : request_id,
        companyid : companyid,
       }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,
       
      }),
    }).then((res) => res.json()).then(res => dispatch(showuserchatspecific(res.userchats)));
  };

}



/************* My Profile functions***/

// My Teams
export function showMyTeams(myteams) {
  console.log(myteams);
  return {
    type: ActionTypes.ADD_MY_TEAMS,
    myteams,

  };
}
export function getmyuserteams(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getmyuserteams`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then(res => dispatch(showMyTeams(res.depts)));
  };
}

//update profile
export function showUpdateProfile(msg){
  console.log(msg);
  return {
    type: ActionTypes.ADD_UPDATE_PROFILE_WARNINGS,
    errormessage : msg,

  }; 
}
export function updateprofile(user,token) {
  console.log(user);
  return (dispatch) => {
    fetch(`${baseURL}/api/updateprofile`, {
      method: 'post',
        body: JSON.stringify({
        'firstname' :user.firstname,
        'lastname'  :user.lastname,
        'phone'     :user.phone,
        'country'     :user.country,
        'state'     :user.state,
        'city'     :user.city,
       

      }),
        headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showUpdateProfile(res))  
      
   
      );
  };
}


export function verifyaccount(token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/verifyaccount`, {
      method: 'get',
      headers: new Headers({
        'Authorization': token,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showUpdateProfile(res))  
      
   
      );
  };
}

export function changepassword(user,token) {
     return (dispatch) => {
    fetch(`${baseURL}/api/changenewpassword`, {
        method: 'post',
        headers: new Headers({
           'Content-Type':'application/json',
            'Authorization': token,
        }),
       body: JSON.stringify({
       'email' : user.email,
       'password' : user.password,
       'newpassword' :user.newpassword        

    })

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showUpdateProfile(res)));
  };

}

export function updatesettings(company,token) {
  console.log(company);
  return (dispatch) => {
    fetch(`${baseURL}/api/updatesettings`, {
      method: 'post',
        body:JSON.stringify({
                   'abandonedscheduleemail1':company.abandonedscheduleemail1,
                    'abandonedscheduleemail2':company.abandonedscheduleemail2,
                    'abandonedscheduleemail3':company.abandonedscheduleemail3,
                    'completedscheduleemail1': company.completedscheduleemail1,
                    'completedscheduleemail2':company.completedscheduleemail2,
                    'completedscheduleemail3':company.completedscheduleemail3,
                    'invitedscheduleemail1':company.invitedscheduleemail1,
                    'invitedscheduleemail2':company.invitedscheduleemail2,
                    'invitedscheduleemail3':company.invitedscheduleemail3,
                    'maxnumberofdepartment':company.maxnumberofdepartment,
                    'maxnumberofchannels':company.maxnumberofchannels,
                    'notificationemailaddress':company.notificationemailaddress,
                    'widgetwindowtab':company.widgetwindowtab,
                    'showsummary':company.showsummary,
                    'smsphonenumber':company.smsphonenumber,
                    'allowemailnotification':company.allowemailnotification,
                    'allowsmsnotification':company.allowsmsnotification,
                    'isdomainemail':company.isdomainemail,
                    'allowChat':company.allowChat,
       

      }),
        headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showUpdateProfile(res))  
      
   
      );
  };
}

export function showcompanyprofile(companysettings) {
  console.log(companysettings);
  return {
    type: ActionTypes.COMPANY_PROFILE,
    companysettings,

  };
}
export function getcompanysettings(token,id) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getcompanyprofile`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token,
        'Id': id,

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showcompanyprofile(res)));
  };
}



/*********** filter sessionsummary ***********/


export function filterbysessionstatus(status,sessionsummary) {

  var sessionsummaryfiltered;
  if(status == "all")
  {
    sessionsummaryfiltered = sessionsummary
  } 
 else{
   sessionsummaryfiltered = sessionsummary.filter((c) => c.status == status)
  
 }
 
  return {
    type: ActionTypes.FILTER_BY_SESSION,
    sessionsummaryfiltered,
    sessionsummary,
   
  };
}


export function filterbysessionDept(id,sessionsummary) {
 var sessionsummaryfiltered;
  if(id == "all")
  {
    sessionsummaryfiltered = sessionsummary
  } 
 else{
  sessionsummaryfiltered = sessionsummary.filter((c) => c.departmentid == id)
  
 }
                 
  return {
    type: ActionTypes.FILTER_BY_SESSION,
    sessionsummaryfiltered,
    sessionsummary,
   
  };
}

export function filterbysessionChannel(id,sessionsummary) {
  
  var sessionsummaryfiltered;
  if(id == "all")
  {
    sessionsummaryfiltered = sessionsummary
  } 
  else{

    sessionsummaryfiltered = sessionsummary.filter((c) => c.messagechannel[c.messagechannel.length-1] == id)

  } 
   return {
    type: ActionTypes.FILTER_BY_SESSION,
    sessionsummaryfiltered,
    sessionsummary,
   
  };
}

export function filterbysessionAgent(id,sessionsummary) {
  
  var sessionsummaryfiltered;
  if(id == "all")
  {
    sessionsummaryfiltered = sessionsummary
  } 
  else{

    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids[c.agent_ids.length-1] == id)

  } 
   return {
    type: ActionTypes.FILTER_BY_SESSION,
    sessionsummaryfiltered,
   sessionsummary,
   
  };
}




/****** High Charts
**/
export function channelwisestats(channelwisestats){
  return {
    type: ActionTypes.CHANNEL_STATS,
    channelwisestats,
   
  };
}

export function platformwisestats(platformwisestats){
  return {
    type: ActionTypes.PLATFORM_STATS,
   platformwisestats,
   
  };
}

export function deptwisestats(deptwisestats){
  return {
  type: ActionTypes.DEPT_STATS,
   deptwisestats,
   
  };
}


export function pagewisestats(pagewisestats){
  return {
  type: ActionTypes.PAGE_STATS,
   pagewisestats,
   
  };
}

export function countrywisestats(countrywisestats){
  return {
  type: ActionTypes.COUNTRY_STATS,
  countrywisestats,
   
  };
}


export function mobilewisestats(mobilewisestats){
  return {
  type: ActionTypes.MOBILE_STATS,
  mobilewisestats,
   
  };
}


export function agentwisestats(agentwisestats){
  return {
  type: ActionTypes.AGENT_STATS,
  agentwisestats,
   
  };
}


export function agentwisenotifications(agentwisenotifications){
  return {
  type: ActionTypes.AGENT_NOTIFICATIONS,
  agentwisenotifications,
   
  };
}

export function customerstats(customerwisestats){
  return {
  type: ActionTypes.CUSTOMER_STATS,
  customerwisestats,
   
  };
}

export function getchannelwisestats(departmentid,token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getchannelwisecalls`, {
      method: 'post',
      body: JSON.stringify({
        departmentid:departmentid,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
       
      }),
    }).then((res) => res.json()).then(res => dispatch(channelwisestats(res.body)));
  };
}


export function getplatformwisestats(token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getplatformwisecalls`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then(res => dispatch(platformwisestats(res.info)));
  };
}


export function getdeptwisestats(token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getdeptwisecalls`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then(res => dispatch(deptwisestats(res.info)));
  };
}

export function getpagewisestats(token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getpagewisecalls`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then(res => dispatch(pagewisestats(res.info)));
  };
}

export function getcountrywisestats(token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getcountrywisecalls`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then(res => dispatch(countrywisestats(res.info)));
  };
}

export function getmobilewisestats(token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getmobilecalls`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then(res => dispatch(mobilewisestats(res.info)));
  };
}


//get top 10 customers
export function gettopcustomers(token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/gettopcustomers`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then(res => dispatch(customerstats(res.info)));
  };
}

//agent wise calls
export function getagentwisecalls(token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getagentwisecalls`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then(res => dispatch(agentwisestats(res.info)));
  };
}

// agent notifications

export function getagentwisenotifications(token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getagentnotifications`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then(res => dispatch(agentwisenotifications(res.info)));
  };
}



/********************* Group Related Actions ************/
export function creategroupError(message) {
  return {
    type: ActionTypes.CREATEGROUP_FAILURE,
    message,
  }
}
export function createGroup(group,usertoken) {
    
  return (dispatch) => {
    fetch(`${baseURL}/api/creategroup`, {
      method: 'post',
      
      body: JSON.stringify({
          groupname: group.groupname,
          groupdescription: group.groupdescription,
          status : group.status,


      }),
    
      headers: new Headers({
         'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
     
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(creategroupError(res)));
  };
}

export function showGroups(groups) {
  return {
    type: ActionTypes.ADD_GROUPS,
    groups,

  };
}
export function getgroups(token) {
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

