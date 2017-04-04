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
    isAuthenticated: false,

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

    dispatch(setjoinedState('notjoined'));
    browserHistory.push('/login')
    window.location.reload();
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
    }).then((res) => res.json()).then((res) => res.signup).then((res) => {
          if (res.token == '') {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(showSignupResponse(res));

        }
      else {
              // If signup was successful, set the token in local storage
            cookie.save('token', res.token, { path: '/' });
            console.log(cookie.load('token'));
            browserHistory.push('/dashboard');
            window.location.reload();
          }
        }
          );


  }
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
    }).then((res) => res.json()).then((res) => res).then(res => {
     if(res.status == 200){
            dispatch(showUsername(res.info));
     }
     else{
        cookie.remove('token', { path: '/' });
        browserHistory.push('/login');
     }
    });
  };
}


/********************************************************************************************/
/*              Group RELATED actions - Old (TEAMS)                                                     */

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
export function getcustomergroups(appid,appsecret,companyid){

  return (dispatch) => {
    fetch(`${baseURL}/api/getcustomergroups/`, {
        method: 'post',
        body: JSON.stringify({
          appid: appid,
          appsecret : appsecret,
          clientid:companyid,


      })
        ,
        headers: new Headers({
        'Content-Type': 'application/json',
      }),

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showCustomerGroups(res)));
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
export function addGroup(group) {
 // console.log(group);
  return {
    type: ActionTypes.ADD_GROUP,
    deptname: group.deptname,
    deptdescription: group.deptdescription,

  };
}


export function creategroup(group,customers) {

  return (dispatch) => {
    fetch(`${baseURL}/api/creategroup`, {
      method: 'post',
      body: JSON.stringify({
          deptname: group.name,
          deptdescription: group.description,
          deptagents:group.deptagents,
          customers:customers,

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


export function editGroup(group,customers) {
//  console.log('editGroup action called');
 // console.log(group.deptagents);
//  console.log(group);
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
        deptagents: group.deptagents,
        customers : customers

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
  //console.log(group)
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





export function deleteGroup(group) {
  return {
    type: ActionTypes.DELETE_GROUP,
    group,
  };
}


export function deletegroup(group,usertoken,customers) {
  if(confirm("Do you want to delete this group?"))
  {
  return (dispatch) => {
    return fetch(`${baseURL}/api/deleteGroup?id=${group._id}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        group : group,
        customers : customers,

      }),

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(deleteGroup(group)));
  };
}
else{
  browserHistory.push('/groups');

}

}







/***************************************************************************************************/
/*              AGENT RELATED actions                                                              */
/***************************************************************************************************/

export function showInvitedAgents(invitedagents) {
  return {
    type: ActionTypes.ADD_INVITED_AGENTS,
    invitedagents,

  };
}
export function getinvitedagents(usertoken){
  return (dispatch) => {
    fetch(`${baseURL}/api/getinvitedagents`, {
        method: 'get',
        headers: new Headers({
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showInvitedAgents(res)));
  };
}
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


export function showTeamAgents(agents) {
  console.log(agents);
  return {
    type: ActionTypes.ADD_TEAMAGENTS,
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
export function inviteAgentResponse(res) {
  alert(res.message);
  return {
    type: ActionTypes.INVITE_AGENT_RESPONSE,
    message:res.message,
    inviteurl:res.url,
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
         dispatch(inviteAgentResponse(res));


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


/************************* Team Related Actions (old groups) ************/
export function addSelectedTeam(team) {
  return {
    type: ActionTypes.ADD_SELECTED_TEAM,
    team,
  };
}
export function editTeam(team) {
  //alert(team)
  return (dispatch) => {
    fetch(`${baseURL}/api/editteam`, {
      method: 'post',
      body: JSON.stringify({
        team :{
          _id:team.id,
          groupname: team.name,
          groupdescription: team.desc,
          status : team.status,
        },
        teamagents: team.teamagents

      })
      ,
      headers: new Headers({
         'Authorization': team.token,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
         console.log(res.statusCode);
      //   alert(res.message);
         browserHistory.push('/teams');

        }
    );
  };
}


export function getTeamRequest(team,usertoken) {
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
export function deleteTEAM(team) {
  return {
    type: ActionTypes.DELETE_TEAM,
    team,
  };


}

export function deleteteam(team,id,usertoken) {
  if(confirm("Do you want to delete this Team?"))
  {
  return (dispatch) => {
    return fetch(`${baseURL}/api/deleteTeam?id=${id}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(deleteTEAM(team)));
  };
}
else{
  browserHistory.push('/teams');

}

}

export function jointeam(team,userid,usertoken) {

  if(confirm("Do you want to join this Team?"))
  {
  return (dispatch) => {
    return fetch(`${baseURL}/api/joinTeam`, {
      method: 'post',
      body: JSON.stringify({
            groupid : team.get('_id'),
            agentid : userid,

      }),

      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
   }).then((res) => res.json()).then((res) => res).then((res) => {
         console.log(res.statusCode);
         alert(res.message);
         browserHistory.push('/dashboard');

        }
    );
  };
}
}


export function getTeamAgents(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/teamagents`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token,
        'Pragma': 'no-cache'
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showTeamAgents(res)));
  };
}
/********************* Team Related Actions ************/
export function createteamError(message) {
  return {
    type: ActionTypes.CREATETEAM_FAILURE,
    message,
  }
}
export function createTeam(team,usertoken) {
//  console.log('createTeam is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/createteam`, {
      method: 'post',

      body: JSON.stringify({
          groupname: team.groupname,
          groupdescription: team.groupdescription,
          status : team.status,


      }),

      headers: new Headers({
         'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),

    }).then((res) => res.json()).then((res) => res).then((res) => {
     // dispatch(createteamError(res))
     browserHistory.push('/teams');
      }
     );
  };
}

export function showTeams(teams) {
  return {
    type: ActionTypes.ADD_TEAMS,
    teams,

  };
}

export function getteams(token) {
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



/*************************************************************************************************/
/*                      Subgroup Related Actions                                                  */

/*************************************************************************************************/

export function createSubgroup(subgroup,usertoken,customers){
  console.log(subgroup);
  console.log(usertoken);
  console.log('create message subgroup is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/createSubgroup`, {
      method: 'post',
      headers: new Headers({
         'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
      subgroup : subgroup,
      customers:customers,
      }),
 }).then((res) => res.json()).then((res) => res).then((res) => {
        console.log(res.statusCode);
        browserHistory.push('/subgroups');

        }
    );
  };
}



export function editSubgroup(subgroup,usertoken,customers){
  console.log(subgroup);
  console.log(usertoken);
  console.log('edit message subgroup is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/editSubgroup`, {
      method: 'post',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
      subgroup : subgroup,
      customers:customers,
      })

      ,
    }).then((res) => res.json()).then((res) => res).then((res) => {

        browserHistory.push('/subgroups');

        }
    );
  };
}


export function updatesubgrouplist(id){
   return {
    type: ActionTypes.FILTER_SUBGROUPS,
    id,

  };
}
export function showSubgroups(subgroups) {
  console.log(subgroups);
  return {
    type: ActionTypes.ADD_SUBGROUPS,
    subgroups,

  };
}

export function showCustomerSubgroups(subgroups) {
  console.log(subgroups);
  return {
    type: ActionTypes.ADD_CUSTOMER_SUBGROUPS,
    subgroups,

  };
}

/*** get subgroups ***/
export function getcustomersubgroups(appid,appsecret,companyid){
  return (dispatch) => {
    fetch(`${baseURL}/api/getcustomersubgroups/`, {
        method: 'post',
        body: JSON.stringify({
          appid: appid,
          appsecret : appsecret,
          clientid:companyid,


      })
        ,
        headers: new Headers({
        'Content-Type': 'application/json',
      }),

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showCustomerSubgroups(res)));
  };
}
export function getsubgroups(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getsubgroups`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showSubgroups(res)));
  };
}


export function getSessionDetailsRequest(id,usertoken)
{
  return {
    type: ActionTypes.ADD_SELECTED_SESSIONSUMMARY,
    id,
  };
}
export function getSubgroupRequest(id,usertoken) {
  console.log(id)
  return {
    type: ActionTypes.ADD_SELECTED_SUBGROUP,
    id,
  };
}

export function deleteSUBGROUP(subgroup) {
  alert('Subgroup deleted successfully');
  return {
    type: ActionTypes.DELETE_SUBGROUP,
   subgroup,
  };
}
export function deletesubgroup(subgroup,usertoken,customers) {
  console.log('deletesubgroup Action is called '+ subgroup._id + 'your token : '  + usertoken);
  if(confirm("Do you want to delete this subgroup?"))
  {
  return (dispatch) => {
    return fetch(`${baseURL}/api/deleteSubgroup?id=${subgroup._id}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
      subgroup : subgroup,
      customers:customers,
      })
    }).then((res) => res).then(res => dispatch(deleteSUBGROUP(subgroup)));
  };
}
else{
  browserHistory.push('/subgroups');

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
  console.log(cr);
  console.log('create canned response is called');
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

/*** get subgroups ***/
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
  alert('Canned Response deleted successfully');
  alert(response._id);
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

export function getsessionsfromsocket(customerchat,selected_chat){
  var customer_not_left = false;
  if(selected_chat)
  {
        for(var i=0;i<customerchat.length;i++){
          if(customerchat[i].request_id == selected_chat.request_id){
              selected_chat = customerchat[i];
              customer_not_left = true;
              break;
          }
        }
}
  var current_chat;
  if(customer_not_left == true){
      current_chat = selected_chat;

  }

  return {
    type: ActionTypes.SHOW_ALL_CHAT,
    customerchat,
    customerchat_selected:  current_chat,

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
/* var customerchat = [{'id': '1','username' : 'John','group' :'IT','msg' :'I need help in software installation' },
                  {'id': '2','username' : 'Alice','group' :'Sales','msg' :'I didnt get my order yet' },
                  {'id': '3','username' : 'Joe','group' :'Payment','msg' :'Please confirm Payment status' }]

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

export function filterbySubgroup(id,customerchat) {

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
    type: ActionTypes.FILTER_BY_SUBGROUP,
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

    filtered = customerchat.filter((c) => c.agent_ids[c.agent_ids.length-1].id == id)

  }
    console.log(filtered);

  console.log(customerchat);
  return {
    type: ActionTypes.FILTER_BY_AGENT,
    filtered,
    customerchat,

  };
}

export function updatefbstatus(id,fbchats){
  for(var i=0;i<fbchats.length;i++){
    if(fbchats[i].senderid == id){
      fbchats[i].seen = true;
    }
  }

  return{
    fbchats: fbchats,
    type: ActionTypes.FB_CHAT_STATUS,
  }
}
export function selectFbCustomerChat(id,fbchat){
  var newfbChat = []
  var temp = fbchat.filter((c)=>c.senderid == id || c.recipientid == id);
  for(var i=0;i<temp.length;i++){
    if(temp[i].message){
    newfbChat.push(
      {
        message: temp[i].message.text,
        inbound: true,
        backColor: '#3d83fa',
        textColor: "white",
        avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
        duration: 0,
        timestamp:temp[i].timestamp,
        senderid:temp[i].senderid,
        recipientid:temp[i].recipientid,
        mid:temp[i].message.mid,
        attachments:temp[i].message.attachments,
        seen:false
      })
  }
  }
  return{
    fbchatSelected: newfbChat,
    type: ActionTypes.FB_CHAT_SELECTED,
  }
}


export function add_socket_fb_message(data,fbchats,id){

fbchats.push(data);

var newfbChat = []
var temp = fbchats.filter((c)=>c.senderid == id || c.recipientid == id );
  for(var i=0;i<temp.length;i++){
    if(temp[i].message){
    newfbChat.push(
      {
        message: temp[i].message.text,
        inbound: true,
        backColor: '#3d83fa',
        textColor: "white",
        avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
        duration: 0,
        timestamp:temp[i].timestamp,
        senderid:temp[i].senderid,
        recipientid:temp[i].recipientid,
        mid:temp[i].message.mid,
        attachments:temp[i].message.attachments,
        seen:false,
      })
  }
  }

   return{
    fbchatSelected: newfbChat,
    fbchats:fbchats,
    type: ActionTypes.FB_CHAT_ADDED,
  }


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

export function chatmessageSent(res){
    return {
    type: ActionTypes.CHAT_SENT_TO_AGENT,
    status : res.status,
  //  customerid,

  };
}

//send message to customer
export function getchatfromAgent(chat){
 return (dispatch) => {
    fetch(`${baseURL}/api/getchatfromagent`, {
        method:'post',
        body: JSON.stringify(chat),
        headers: new Headers({
        'Content-Type': 'application/json',

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(chatmessageSent(res)));
  };
}
//send messsage to agent
export function sendmessageToAgent(chat){
 console.log('sendmessageToAgent');
 console.log(chat);
  return (dispatch) => {
    fetch(`${baseURL}/api/getchat`, {
        method:'post',
        body: JSON.stringify(chat),
        headers: new Headers({
        'Content-Type': 'application/json',

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(chatmessageSent(res)));
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
    /*fetch(`${baseURL}/api/getsessions`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(getsessionsfromserver([])));
  };*/
    dispatch(getsessionsfromserver([]))

};
}

export function previousChat(previouschat,chatlist){
    var newchatlist = [...previouschat,...chatlist];

    //removing duplicates
    var newArray = [];
     var lookupObject  = {};

     for(var i in newchatlist) {
        lookupObject[newchatlist[i]['uniqueid']] = newchatlist[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
    return {
    type: ActionTypes.SHOW_CHAT_HISTORY,
    chatlist: newArray,
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
  console.log("update chat list is called.");
  console.log(message);
  console.log(ch);
  console.log(id_not_added);
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
  var temp = ch[0];
  for(var i=1;i<ch.length; i++){
    if(ch[i] === temp){
      ch.splice(i, 1);
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

export function showfilesuccess(res){
  alert('file shared successfully');
}

export function uploadChatfile(fileData,usertoken) {
  console.log(fileData);
  return (dispatch) => {
    fetch(`${baseURL}/api/uploadchatfileAgent`, {
      method: 'post',
        body : fileData,
        headers: new Headers({
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showfilesuccess(res))


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



export function resendNotification(notification) {
  return (dispatch) => {
    fetch(`${baseURL}/api/resendNotification`, {
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
        alert('Notification resent!')
       // browserHistory.push('/notifications');
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

export function showcountryname(countryinfo) {
  console.log(countryinfo);
  return {
    type: ActionTypes.SHOW_COUNTRY_NAME,
    countryinfo,
  };
}

export function getcountryname(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getCountryName`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showcountryname(res)));
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
     var newArray = [];
     var lookupObject  = {};

     for(var i in onlineAgents) {
        lookupObject[onlineAgents[i]['email']] = onlineAgents[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
  return {
    type : ActionTypes.ONLINE_AGENTS,
    onlineAgents:newArray,
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

export function savechatResponse(chat){
  return {
    type : ActionTypes.CHAT_SAVE_RESPONSE,
    tempMessage : chat,
    ismessageSaved : 'true',
  }
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
        dispatch(savechatResponse(chat));

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

export function movedToMessageSubgroupResponse(session){
  console.log('assignToSubgroupResponse is called');
   return {
    type : ActionTypes.MOVE_TO_MESSAGESUBGROUP,
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

export function assignToAgent(session,usertoken,agentemail,assignmentType) {
  return (dispatch) => {
    fetch(`${baseURL}/api/assignToAgent`, {
      method: 'post',
      body: JSON.stringify({
        companyid : session.companyid,
        sessionid : session.sessionid,
        agentAssignment : session,
        type : session.type,
        agentemail:agentemail,
        assignmentType:assignmentType,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then(res => dispatch(assignToAgentResponse(session)));
  };
}

//moved to message subgroup
export function movedToMessageSubgroup(session,usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/movedToMessageSubgroup`, {
      method: 'post',
      body: JSON.stringify({
        companyid : session.companyid,
        sessionid : session.sessionid,
        subgroupAssignment : session,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then(res => dispatch(movedToMessageSubgroupResponse(session)));
  };
}


export function setsocketid(yoursocketid){
  return {
    type: ActionTypes.SET_SOCKET_ID,
    yoursocketid,


  };
}

export function getchatsfromsocket(originalArray,newchats){

    alert('state type');
     var newArray = originalArray.push.apply(originalArray,newchats);
     var lookupObject  = {};
     var prop = 'uniqueid';
     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
   return {
    type: ActionTypes.ADD_USER_CHATS,
    userchats : newArray,
    chatlist: newArray,


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

var sortBy = (function () {

  //cached privated objects
  var _toString = Object.prototype.toString,
      //the default parser function
      _parser = function (x) { return x; },
      //gets the item to be sorted
      _getItem = function (x) {
        return this.parser((x !== null && typeof x === "object" && x[this.prop]) || x);
      };

  // Creates a method for sorting the Array
  // @array: the Array of elements
  // @o.prop: property name (if it is an Array of objects)
  // @o.desc: determines whether the sort is descending
  // @o.parser: function to parse the items to expected type
  return function (array, o) {
    if (!(array instanceof Array) || !array.length)
      return [];
    if (_toString.call(o) !== "[object Object]")
      o = {};
    if (typeof o.parser !== "function")
      o.parser = _parser;
    o.desc = !!o.desc ? -1 : 1;
    return array.sort(function (a, b) {
      a = _getItem.call(o, a);
      b = _getItem.call(o, b);
      return o.desc * (a < b ? -1 : +(a > b));
    });
  };

}());
export function showuserchatspecific_mobile(userchats) {
  var sort_us = sortBy(userchats, { desc: false, prop: "datetime" });//userchats.sort(sortFunction);​
  return {
    type: ActionTypes.ADD_USER_CHATS_SPECIFIC_MOBILE,
    mobileuserchat : sort_us,


  };
}
export function getuserchats(token) {
  console.log(token);
  return (dispatch) => {
    //uncomment for mobile sessions
    fetch(`${baseURL}/api/getuserchats`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showuserchat(res.userchats)));
    //dispatch(showuserchat([]));
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

// My Groups
export function showMyGroups(mygroups) {
  console.log(mygroups);
  return {
    type: ActionTypes.ADD_MY_GROUPS,
    mygroups,

  };
}
export function getmyusergroups(token) {
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getmyusergroups`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then(res => dispatch(showMyGroups(res.depts)));
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

//update profile
export function showUpdateSettings(msg){
  console.log(msg);
  return {
    type: ActionTypes.ADD_UPDATE_SETTINGS,
    errormessage : msg,
    companysettings:msg.company,

  };
}
export function showCreatePage(msg){
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

export function createPage(fbpage,token) {
  console.log(fbpage);
  return (dispatch) => {
    fetch(`${baseURL}/api/createfbPage`, {
      method: 'post',
      body: JSON.stringify({
        fbpage:fbpage,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showCreatePage(res))


      );
  };
}

export function updatesettings(file,companyprofile,token,logoAlready) {
 var fileData = new FormData();
  if(logoAlready == true){
        fileData.append('companyprofile',JSON.stringify(companyprofile));

  }
  else{
  fileData.append('file', file);
  fileData.append('filename', file.name);
  fileData.append('filetype', file.type);
  fileData.append('filesize', file.size);
  fileData.append('companyprofile',JSON.stringify(companyprofile));
  }
  console.log(fileData);

  return (dispatch) =>
    fetch(`${baseURL}/api/updatesettings`, {

      method: 'post',
      body:fileData,
        headers: new Headers({
        'Authorization': token,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showUpdateSettings(res))
      );
  };


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

export function filterbysessionMedium(medium, sessionsummary) {
//  alert(medium)
  var sessionsummaryfiltered;
  if(medium == "all")
  {
    sessionsummaryfiltered = sessionsummary
  }
  else{
    sessionsummaryfiltered = sessionsummary.filter((c) => c.platform == medium)
  }

  return {
    type: ActionTypes.FILTER_BY_SESSION,
    sessionsummaryfiltered,
    sessionsummary,

  };
}
export function filterbysessionSubgroup(id,sessionsummary) {

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

    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length >0).filter((c) => c.agent_ids[c.agent_ids.length-1].id == id)

  }
   return {
    type: ActionTypes.FILTER_BY_SESSION,
    sessionsummaryfiltered,
   sessionsummary,

  };
}




/****** High Charts
**/
export function subgroupwisestats(subgroupwisestats){
  return {
    type: ActionTypes.SUBGROUP_STATS,
    subgroupwisestats,

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

export function getsubgroupwisestats(departmentid,token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getsubgroupwisecalls`, {
      method: 'post',
      body: JSON.stringify({
        departmentid:departmentid,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,

      }),
    }).then((res) => res.json()).then(res => dispatch(subgroupwisestats(res.body)));
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





/**** News related actions*****/
export function createnews(news,usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/createnews`, {
      method: 'post',
      body: JSON.stringify({
        news: news,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then(res => {

        console.log(res);
    });
  };
}

export function showNews(news,userid) {
  news = news.filter((c) => c.target == userid && c.unread == "true");
  return {
    type: ActionTypes.ADD_NEWS,
    news,

  };
}

export function getnews(userid,usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getnews`, {
      method: 'post',
      body: JSON.stringify({
        target : userid
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showNews(res,userid)));
  };
}


export function updatenews(news,usertoken){
   return (dispatch) => {
    fetch(`${baseURL}/api/updatenews`, {
      method: 'post',
      body: JSON.stringify({
        newsid : news._id,
        unread : "false",
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
         browserHistory.push(news.url);
        // dispatch(editgroupError(res.message));


        }
    );
  };
}



export function UpdateChatStatusUI(messages,mobileuserchat) {
   //alert('called')
  for(var i = 0;i<messages.length;i++){
    var obj = messages[i];

    for(var j=0;j<mobileuserchat.length;j++){
        if(obj.uniqueid == mobileuserchat[j].uniqueid){
        //  alert('setting status')
          mobileuserchat[j].status = obj.status;
          break;
        }
    }
  }
  return {
    type: ActionTypes.ADD_USER_CHATS_SPECIFIC_MOBILE,
    mobileuserchat : mobileuserchat,


  };
}
export function downloadfile(body,usertoken){
   fetch(`${baseURL}/api/downloadchatfile`, {
      method: 'post',
      body: JSON.stringify({
          uniqueid : body.uniqueid,

      }),

      headers: new Headers({
       'Authorization': usertoken,
       'Content-Type': 'application/json',
       'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
       'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
       'kibo-client-id': 'cd89f71715f2014725163952',


      }),

    })
}
export function updatechatstatus(messages,customerid,usertoken,mobileuserchat) {

  return (dispatch) => {
    fetch(`${baseURL}/api/updatechatstatus`, {
      method: 'post',
      body: JSON.stringify({
          messages: messages,
          customerid: customerid,


      }),

      headers: new Headers({
         'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),

    }).then((res) => res.json()).then((res) => res).then((res) => {
        console.log(res.statusCode);

        if(res.statusCode == 201 && mobileuserchat){
           dispatch(UpdateChatStatusUI(messages,mobileuserchat))
        }
        }
    );
  };
}


/***** function to remove duplicate chat messages from UI *******/

export function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
  return {
    type: ActionTypes.ADD_USER_CHATS_SPECIFIC_MOBILE,
    mobileuserchat : newArray,


  };
 }

 export function removeDuplicatesWebChat(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
  return {
    type: ActionTypes.ADD_USER_CHATS_SPECIFIC_WEB,
    userchats : newArray,


  };
 }


 /***** Facebook actions ***/
export function showFbPages(fbpages) {
  console.log('showFbpages');
  console.log(fbpages);
  return {
    type: ActionTypes.ADD_FB_PAGES,
    fbpages,

  };
}

export function getfbpages(token) {
  console.log('getfbpages is called');
  console.log(token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getfbpages`, {
        method: 'get',
        headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showFbPages(res)));
  };
}


export function addSelectedPage(fbpage) {
  alert(fbpage.pageid);
  return {
    type: ActionTypes.ADD_SELECTED_PAGE,
    fbpage,
  };
}


export function getfbpage(usertoken,pageid) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/getfbpage?id=${pageid}`, {
      method: 'get',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(addSelectedPage(res)));
  };
}
export function editPage(fbpage,token) {
  console.log(fbpage);
  return (dispatch) => {
    fetch(`${baseURL}/api/editfbPage`, {
      method: 'post',
      body: JSON.stringify({
        fbpage:fbpage,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showCreatePage(res))


      );
  };
}



export function deletePage(fbpage) {
  alert('Facebook Page deleted successfully');
  return {
    type: ActionTypes.DELETE_SELECTED_PAGE,
    fbpage,
  };
}
export function deletefbpage(fbpage,usertoken) {
  if(confirm("Are you sure you want to remove this page?"))
  {
  return (dispatch) => {
    return fetch(`${baseURL}/api/deletefbpage?id=${fbpage.pageid}`, {
      method: 'delete',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res).then(res => dispatch(deletePage(fbpage)));
  };
}
else{
  browserHistory.push('/cannedresponses');

}

}
/***** Facebook actions ***/
export function showFbCustomers(fbcustomers) {

  return {
    type: ActionTypes.ADD_FB_CUSTOMERS,
    fbcustomers,

  };
}

export function showFbChats(fbchats) {

  return {
    type: ActionTypes.ADD_FB_CHATS,
    fbchats,

  };
}

export function getfbCustomers(usertoken){
  return (dispatch) => {
    fetch(`${baseURL}/api/getfbCustomers`, {
      method: 'get',

      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showFbCustomers(res))


      );
  };
}


export function getfbChats(usertoken){
  return (dispatch) => {
    fetch(`${baseURL}/api/getfbChats`, {
      method: 'get',

      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showFbChats(res))


      );
  };
}

// update customer list
export function updateCustomerList(data,customerlist){
  customerlist.push(data);
   var newArray = [];
     var lookupObject  = {};

     for(var i in customerlist) {
        lookupObject[customerlist[i]['user_id']] = customerlist[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
  return{
    type:ActionTypes.ADD_NEW_FB_CUSTOMER,
    fbcustomers:newArray,
  }
}
//send chat to facebook customer

//send message to customer
export function getfbchatfromAgent(chat){
 return (dispatch) => {
    fetch(`${baseURL}/api/sendfbchat`, {
        method:'post',
        body: JSON.stringify(chat),
        headers: new Headers({
        'Content-Type': 'application/json',

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(fbchatmessageSent(res)));
  };
}


export function fbchatmessageSent(res){
    return {
    type: ActionTypes.FBCHAT_SENT_TO_AGENT,
    status : res.status,
  //  customerid,

  };
}

export function showfbfilesuccess(chat,fbchats,id){
  fbchats.push(chat.chatmsg);
  var newfbChat = []
  var temp = fbchats.filter((c)=>c.senderid == id || c.recipientid == id );
    for(var i=0;i<temp.length;i++){
      if(temp[i].message){
      newfbChat.push(
        {
          message: temp[i].message.text,
          inbound: true,
          backColor: '#3d83fa',
          textColor: "white",
          avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
          duration: 0,
          timestamp:temp[i].timestamp,
          senderid:temp[i].senderid,
          recipientid:temp[i].recipientid,
          mid:temp[i].message.mid,
          attachments:temp[i].message.attachments,
          seen:false,
        })
    }
    }

     return{
      fbchatSelected: newfbChat,
      fbchats:fbchats,
      type: ActionTypes.FB_CHAT_ADDED,
    }

}

export function uploadFbChatfile(fileData,usertoken,fbchats,id) {
  console.log(fileData);
  return (dispatch) => {
    fetch(`${baseURL}/api/uploadchatfilefb`, {
      method: 'post',
        body : fileData,
        headers: new Headers({
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showfbfilesuccess(res,fbchats,id))


      );
  };

};


/*** reseting joined state ***/
export function setjoinedState(stateVar){
   return{
      userjoinedroom:stateVar,
      type: ActionTypes.JOINED_MEETING,
    }
}


export function showCompanylogo(res){
   return{
      companylogo:res.logourl,
      type: ActionTypes.COMPANY_LOGO,
    }
}
//this is without-token version of getting grouplist for Chat widget
export function getcompanylogo(appid,appsecret,companyid){

  return (dispatch) => {
    fetch(`${baseURL}/api/getcompanylogo/`, {
        method: 'post',
        body: JSON.stringify({
          appid: appid,
          appsecret : appsecret,
          clientid:companyid,


      })
        ,
        headers: new Headers({
        'Content-Type': 'application/json',
      }),

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showCompanylogo(res)));
  };

}



/******* chat bot actions*****/
export function chatbotChatAdd(message){
  console.log(message);
   return{
      message:message,
      type: ActionTypes.BOT_RESPONSE,
    }
}

export function chatbotsession(sessionid){
    
   return{
      chatbotsessionid:sessionid,
      type: ActionTypes.BOT_SESSION,
    }
}
export function chatbotResponse(res){
  console.log(res);
  var message = {
                      lang:'en',
                      sessionId: res.sessionId ,
                      from: 'bot',
                      msg:res.result.speech,
                      timestamp:res.timestamp,
                      
                    
  }
   return{
      message:message,
      type: ActionTypes.BOT_RESPONSE,
    }
}
export function sendchatToBot(message)
{
   return (dispatch) => {
    fetch('https://api.api.ai/v1/query', {
        method: 'post',
        headers:new Headers({
          'Authorization':' Bearer 23faab6fda14491294154d954eeede9c',
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
                      query: message.query,
                      lang: message.lang,
                      sessionId: message.sessionId,
                      from: message.from,
                      msg: message.msg,
                      timestamp: message.timestamp,
})
       

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(chatbotResponse(res)));
  };

}