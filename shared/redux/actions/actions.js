import * as ActionTypes from '../constants/constants';
import Config from '../../../server/config';
import fetch from 'isomorphic-fetch';
import cookie from 'react-cookie';
import {browserHistory} from 'react-router';
import {printlogs} from '../../services/clientlogging';

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
  printlogs('log', message);
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
  printlogs('log', creds);
  let config = {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'email': creds.email,
      'password': creds.password,
      'website': creds.website

    })
  }

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))
    return fetch(`${baseURL}/api/getlogin`, config)
      .then(response =>
        response.json()
          .then(user => ({user, response}))
      ).then(({user, response}) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(loginError(user.message))
          return Promise.reject(user)
        }
        else {
          // If login was successful, set the token in local storage
          cookie.save('token', user.token.token, {path: '/'});
          printlogs('log', cookie.load('token'));
          browserHistory.push('/dashboard')

          // Dispatch the success action
          //  dispatch(receiveLogin(user))
        }
      }).catch(err => console.log("Error: ", err))
  }
}


//forgot password

export function showForgotPassword(msg) {

  return {
    type: ActionTypes.ADD_FORGOTPASSWORD_WARNINGS,
    errormessage: msg,

  };
}


export function forgotpassword(creds) {
  printlogs('log', creds);
  return (dispatch) => {
    fetch(`${baseURL}/api/forgotpassword`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        'email': creds.email,
        'website': creds.website

      })

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showForgotPassword(res)));
  };

}


export function resetpassword(creds) {
  printlogs('log', creds);
  return (dispatch) => {
    fetch(`${baseURL}/api/changepassword`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        'token': creds.token,
        'password': creds.password

      })

    }).then((res) => res.json()).then((res) => res).then(res => {

      cookie.remove('token', {path: '/'});
      dispatch(setjoinedState('notjoined'));
      dispatch(showForgotPassword(res))
    });
  };

}


// verify password reset token

export function showTokenResponse(status) {
  var s = '';
  if (status == 200) {
    printlogs('log', 'status is ' + status);
    s = 'Successfully verified.';

  }
  else {
    s = 'Not verified';
  }

  return {
    type: ActionTypes.SHOW_TOKEN_RESPONSE,
    errormessage: s,

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
    cookie.remove('token', {path: '/'});
    dispatch(receiveLogout())

    dispatch(setjoinedState('notjoined'));
    browserHistory.push('/login')
    window.location.reload();
  }
}

/*************** signup actions ***********/

export function showSignupResponse(res) {
  printlogs('log', res);
  return {
    type: ActionTypes.ADD_WARNINGS,
    signup: res,

  };
}

export function showUsername(user) {
  printlogs('log', user);
  return {
    type: ActionTypes.ADD_USER_DETAILS,
    user,

  };
}


export function showSpecificChat(chat) {
  printlogs('log', chat);
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
        printlogs('log', res.statusCode);
        if (res.statusCode != 200) {
          dispatch(showSpecificChat_Error(res.message));
        }
        else {
          dispatch(showSpecificChat(res.message))
        }
      }
    );
  };
}

export function showSpecificChat_Error(chat_error) {
  printlogs('log', chat_error);
  return {
    type: ActionTypes.SHOW_SPECIFIC_CHAT_ERROR,
    chat_error,

  };
}


export function signupuser(user) {
  printlogs('log', user);
  return (dispatch) => {
    fetch(`${baseURL}/api/signupUser`, {
      method: 'post',
      body: JSON.stringify({
        'firstname': user.firstname,
        'lastname': user.lastname,
        'email': user.email,
        'phone': user.phone,
        'password': user.password,
        'companyName': user.companyName,
        'website': user.website,
        'token': user.token,
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
          cookie.save('token', res.token, {path: '/'});
          printlogs('log', cookie.load('token'));
          browserHistory.push('/dashboard');
          window.location.reload();
        }
      }
    );


  }
}


/****** get user details ***/
export function getuser(token) {
  printlogs('log', token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getuser`, {
      method: 'get',
      headers: new Headers({
        'Authorization': token,
        'Pragma': 'no-cache'
      }),
    }).then((res) => res.json()).then((res) => res).then(res => {
      if (res.status == 200) {
        dispatch(showUsername(res.info));
      }
      else {
        cookie.remove('token', {path: '/'});
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
  printlogs('log', token);
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
export function getcustomergroups(appid, appsecret, companyid) {

  return (dispatch) => {
    fetch(`${baseURL}/api/getcustomergroups/`, {
      method: 'post',
      body: JSON.stringify({
        appid: appid,
        appsecret: appsecret,
        clientid: companyid,


      })
      ,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showCustomerGroups(res)));
  };
}

export function getspecificsession(requestid) {
  printlogs('log', 'requestid is ' + requestid);
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
  printlogs('log', message);
  return {
    type: ActionTypes.CREATEGROUP_FAILURE,
    message,
  }
}

export function editgroupError(message) {
  printlogs('log', message);
  return {
    type: ActionTypes.EDITGROUP_RESPONSE,
    message,
  }
}

export function showGroups(groups) {
  //printlogs('log', groups);
  return {
    type: ActionTypes.ADD_GROUPS,
    groups,

  };
}

export function showCustomerGroups(groups) {
  return {
    type: ActionTypes.ADD_CUSTOMER_GROUPS,
    groups,

  };
}

export function showCustomerSession(specificsession) {
  return {
    type: ActionTypes.ADD_CUSTOMER_SESSION,
    specificsession,


  };
}

export function showCustomerDetails(specificcustomer) {
  return {
    type: ActionTypes.ADD_CUSTOMER_DETAILS,
    specificcustomer,


  };
}
export function addGroup(group) {
  // printlogs('log',group);
  return {
    type: ActionTypes.ADD_GROUP,
    deptname: group.deptname,
    deptdescription: group.deptdescription,

  };
}


export function creategroup(group, customers) {

  return (dispatch) => {
    fetch(`${baseURL}/api/creategroup`, {
      method: 'post',
      body: JSON.stringify({
        deptname: group.name,
        deptdescription: group.description,
        teamagents: group.teamagents,
        customers: customers,

      }),

      headers: new Headers({
        'Authorization': group.usertoken,
        'Content-Type': 'application/json',
      }),

    }).then((res) => res.json()).then((res) => res).then((res) => {
        printlogs('log', res.statusCode);
        if (res.statusCode != 200) {
          dispatch(creategroupError(res.message));
        }
        else {
          dispatch(showGroups(res.message))
        }
      //  alert(res.message);
      }
    );
  };
}


export function editGroup(group, customers) {
//  printlogs('log','editGroup action called');
  // printlogs('log',group.deptagents);
//  printlogs('log',group);
  //alert(group)
  return (dispatch) => {
    fetch(`${baseURL}/api/editgroup`, {
      method: 'post',
      body: JSON.stringify({
        dept: {
          _id: group.id,
          deptname: group.name,
          deptdescription: group.desc,
        },
        teamagents: group.teamagents,
        customers: customers

      })
      ,
      headers: new Headers({
        'Authorization': group.token,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
        printlogs('log', res.statusCode);
        alert(res.message);
        browserHistory.push('/groups');
        // dispatch(editgroupError(res.message));


      }
    );
  };
}


export function addSelectedGroup(group) {
  //printlogs('log',group)
  return {
    type: ActionTypes.ADD_SELECTED_GROUP,
    group,
  };
}


export function getGroupRequest(group, usertoken) {
  printlogs('log', 'getGroupRequest is called ' + group);
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

export function updateActive(active) {
  // alert("Update.active was called");
  return {
    type: ActionTypes.UPDATE_ACTIVE,
    payload: active,
  };
}

export function deletegroup(group, usertoken, customers) {
  if (confirm("Do you want to delete this group?")) {
    return (dispatch) => {
      return fetch(`${baseURL}/api/deleteGroup?id=${group._id}`, {
        method: 'delete',
        headers: new Headers({
          'Authorization': usertoken,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          group: group,
          customers: customers,

        }),

      }).then((res) => res.json()).then((res) => res).then(res => dispatch(deleteGroup(group)));
    };
  }
  else {
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
export function getinvitedagents(usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getinvitedagents`, {
      method: 'get',
      headers: new Headers({
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showInvitedAgents(res)));
  };
}
export function getAgentRequest(id, usertoken) {
  printlogs('log', id)
  return {
    type: ActionTypes.ADD_SELECTED_AGENT,
    id,
  };
}
export function showAgents(agents) {
  printlogs('log', agents);
  return {
    type: ActionTypes.ADD_AGENTS,
    agents,

  };
}

export function showDeptAgents(agents) {
  printlogs('log', agents);
  return {
    type: ActionTypes.ADD_DEPTAGENTS,
    agents,

  };
}

export function showDeptTeams(teams) {
  printlogs('log', teams);
  return {
    type: ActionTypes.ADD_DEPTTEAMS,
    teams,

  };
}

export function showfbTeams(teams) {
  printlogs('log', teams);
  return {
    type: ActionTypes.ADD_FBTEAMS,
    teams,

  };
}

export function showTeamAgents(agents) {
  printlogs('log', agents);
  return {
    type: ActionTypes.ADD_TEAMAGENTS,
    agents,

  };
}
export function editagentError(message) {
  printlogs('log', message);
  return {
    type: ActionTypes.EDITAGENT_RESPONSE,
    message,
  }
}
export function inviteAgentResponse(res) {
  alert(res.message);
  return {
    type: ActionTypes.INVITE_AGENT_RESPONSE,
    message: res.message,
    inviteurl: res.url,
  }
}


/****** get user details ***/
export function getAgents(token) {
  printlogs('log', token);
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
  printlogs('log', token);
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
export function getDeptTeams(token) {
  printlogs('log', token);
  return (dispatch) => {
    fetch(`${baseURL}/api/deptteams`, {
      method: 'get',
      headers: new Headers({
        'Authorization': token,
        'Pragma': 'no-cache'
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showDeptTeams(res)));
  };
}

/****** get user details ***/
export function getfbTeams(token) {
  printlogs('log', token);
  return (dispatch) => {
    fetch(`${baseURL}/api/fbteams`, {
      method: 'get',
      headers: new Headers({
        'Authorization': token,
        'Pragma': 'no-cache'
      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showfbTeams(res)));
  };
}

/****** get user details ***/


export function editAgent(id, role, token) {
  printlogs('log', 'editAgent action called');
  //alert(role)
  return (dispatch) => {
    fetch(`${baseURL}/api/editagent`, {
      method: 'post',
      body: JSON.stringify({

        personid: id,
        role: role

      })
      ,
      headers: new Headers({
        'Authorization': token,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
        printlogs('log', res.statusCode);
        if (res.message === 'success')
          dispatch(editagentError('User is successfully updated.'));
        else
          dispatch(editagentError('User not updated. Please try again.'));


      }
    );
  };
}

export function inviteagent(email, token) {
  printlogs('log', 'invite agent action called');
  return (dispatch) => {
    fetch(`${baseURL}/api/inviteAgent`, {
      method: 'post',
      body: JSON.stringify({
        email: email

      })
      ,
      headers: new Headers({
        'Authorization': token,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
        printlogs('log', res.statusCode);
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
  printlogs('log', 'getInviteEmail is called ' + token);
  return (dispatch) => {
    return fetch(`${baseURL}/api/invitetoken?id=${token}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
      printlogs('log', res.statusCode);
      if (res.statusCode == 200) {

        dispatch(joinCompanyResponse(res.body));

      }
      else {
        browserHistory.push('/joincompanyfailure')
      }
    })

  };
}

export function verifyEmail(token) {
  printlogs('log', 'verifyEmail is called ' + token);
  return (dispatch) => {
    return fetch(`${baseURL}/api/verifytoken?id=${token}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
      printlogs('log', res.statusCode);
      if (res.statusCode != 200) {

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
export function deleteagent(agent, usertoken) {
  printlogs('log', 'deleteagent Action is called ' + agent._id + 'your token : ' + usertoken);
  if (confirm("Do you want to delete this agent?")) {
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
  else {
    browserHistory.push('/agents');

  }

}


/************************* Team Related Actions (old groups) ************/
export function addSelectedTeam(team) {
  printlogs('log', team);
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
        team: {
          _id: team.id,
          groupname: team.name,
          groupdescription: team.desc,
          status: team.status,
        },
        teamagents: team.teamagents

      })
      ,
      headers: new Headers({
        'Authorization': team.token,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
        printlogs('log', res.statusCode);
        //   alert(res.message);
        browserHistory.push('/teams');

      }
    );
  };
}


export function getTeamRequest(team, usertoken) {
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

export function deleteteam(team, id, usertoken) {

  if (confirm("Do you want to delete this Team?")) {
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
  else {
    browserHistory.push('/teams');

  }

}

export function jointeam(team, userid, usertoken) {

  if (confirm("Do you want to join this Team?")) {
    return (dispatch) => {
      return fetch(`${baseURL}/api/joinTeam`, {
        method: 'post',
        body: JSON.stringify({
          groupid: team.get('_id'),
          agentid: userid,

        }),

        headers: new Headers({
          'Authorization': usertoken,
          'Content-Type': 'application/json',
        }),
      }).then((res) => res.json()).then((res) => res).then((res) => {
          printlogs('log', res.statusCode);
          if (res.statusCode == 200) {
            alert("You have joined the team");
          } else {
            alert("Failed to join the team");
          }
          printlogs('log', "Team Joining", res.message);
          browserHistory.push('/dashboard');

        }
      );
    };
  }
}


export function getTeamAgents(token) {
  printlogs('log', token);
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
export function createTeam(team, usertoken) {
//  printlogs('log','createTeam is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/createteam`, {
      method: 'post',

      body: JSON.stringify({
        groupname: team.groupname,
        groupdescription: team.groupdescription,
        status: team.status,


      }),

      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),

    }).then((res) => res.json()).then((res) => res).then((res) => {
        // dispatch(createteamError(res))
        printlogs('log', "Response", res);
        // alert("Response", res);
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
  printlogs('log', token);
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

export function createSubgroup(subgroup, usertoken, customers) {
  printlogs('log', subgroup);
  printlogs('log', usertoken);
  printlogs('log', 'create message subgroup is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/createSubgroup`, {
      method: 'post',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        subgroup: subgroup,
        customers: customers,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
        printlogs('log', res.statusCode);
        browserHistory.push('/subgroups');

      }
    );
  };
}


export function editSubgroup(subgroup, usertoken, customers) {
  printlogs('log', subgroup);
  printlogs('log', usertoken);
  printlogs('log', 'edit message subgroup is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/editSubgroup`, {
      method: 'post',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        subgroup: subgroup,
        customers: customers,
      })

      ,
    }).then((res) => res.json()).then((res) => res).then((res) => {

        browserHistory.push('/subgroups');

      }
    );
  };
}


export function updatesubgrouplist(id) {
  return {
    type: ActionTypes.FILTER_SUBGROUPS,
    id,

  };
}
export function showSubgroups(subgroups) {
  printlogs('log', subgroups);
  return {
    type: ActionTypes.ADD_SUBGROUPS,
    subgroups,

  };
}

export function showCustomerSubgroups(subgroups) {
  printlogs('log', subgroups);
  return {
    type: ActionTypes.ADD_CUSTOMER_SUBGROUPS,
    subgroups,

  };
}

/*** get subgroups ***/
export function getcustomersubgroups(appid, appsecret, companyid) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getcustomersubgroups/`, {
      method: 'post',
      body: JSON.stringify({
        appid: appid,
        appsecret: appsecret,
        clientid: companyid,


      })
      ,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showCustomerSubgroups(res)));
  };
}
export function getsubgroups(token) {
  printlogs('log', token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getsubgroups`, {
      method: 'get',
      headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showSubgroups(res)));
  };
}


export function getSessionDetailsRequest(id, usertoken) {
  return {
    type: ActionTypes.ADD_SELECTED_SESSIONSUMMARY,
    id,
  };
}
export function getSubgroupRequest(id, usertoken) {
  printlogs('log', id)
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
export function deletesubgroup(subgroup, usertoken, customers) {
  printlogs('log', 'deletesubgroup Action is called ' + subgroup._id + 'your token : ' + usertoken);
  if (confirm("Do you want to delete this subgroup?")) {
    return (dispatch) => {
      return fetch(`${baseURL}/api/deleteSubgroup?id=${subgroup._id}`, {
        method: 'delete',
        headers: new Headers({
          'Authorization': usertoken,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          subgroup: subgroup,
          customers: customers,
        })
      }).then((res) => res).then(res => dispatch(deleteSUBGROUP(subgroup)));
    };
  }
  else {
    browserHistory.push('/subgroups');

  }

}


/**********************************************************************************************/
/*          CANNED RESPONSE RELATED Actions                                                   */
/*********************************************************************************************/

export function showResponse(response) {
  printlogs('log', response);
  return {
    type: ActionTypes.ADD_NEW_RESPONSE,
    response,

  };
}


export function createResponse(cr) {
  printlogs('log', cr);
  printlogs('log', 'create canned response is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/createResponse`, {
      method: 'post',
      body: JSON.stringify({
        shortcode: cr.shortcode,
        message: cr.message,
        companyid: cr.companyid
      }),
      headers: new Headers({
        'Authorization': cr.usertoken,
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => {
        printlogs('log', res.statusCode);
        if (res.statusCode != 200) {
          browserHistory.push('/cannedresponses');
        }
        else {
          browserHistory.push('/cannedresponses');
        }
      }
    );
  };
}


export function editResponse(response, usertoken) {
  printlogs('log', response);
  printlogs('log', usertoken);
  printlogs('log', 'edit response is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/editResponse`, {
      method: 'post',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        response: response
      })

      ,
    }).then((res) => res.json()).then((res) => res).then((res) => {
        printlogs('log', res.statusCode);
        browserHistory.push('/cannedresponses');

      }
    );
  };
}

export function showResponses(responses) {
  printlogs('log', responses);
  return {
    type: ActionTypes.ADD_RESPONSES,
    responses,

  };
}

/*** get subgroups ***/
export function getresponses(token) {
  printlogs('log', token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getresponses`, {
      method: 'get',
      headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showResponses(res)));
  };
}


export function getResponseRequest(id, usertoken) {
  printlogs('log', id)
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
export function deleteresponse(response, usertoken) {
  printlogs('log', 'deleteresponse Action is called ' + response._id + 'your token : ' + usertoken);
  if (confirm("Do you want to delete this canned response?")) {
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
  else {
    browserHistory.push('/cannedresponses');

  }

}


/***************** Chat Actions ********************/

export function getsessionsfromsocket(customerchat, selected_chat) {
  var customer_not_left = false;
  if (selected_chat) {
    for (var i = 0; i < customerchat.length; i++) {
      if (customerchat[i].request_id == selected_chat.request_id) {
        selected_chat = customerchat[i];
        customer_not_left = true;
        break;
      }
    }
  }
  var current_chat;
  if (customer_not_left == true) {
    current_chat = selected_chat;

  }

  return {
    type: ActionTypes.SHOW_ALL_CHAT,
    customerchat,
    customerchat_selected: current_chat,

  };
}

export function getsessionsfromserver(customerchat) {
// add a filter here to filter only mobile clients sessions
  customerchat = customerchat.filter((c) => c.platform == "mobile")

  return {
    type: ActionTypes.SHOW_ALL_CHAT,
    customerchat,
    serverresponse: 'received',

  };
}

export function showChatSummary(sessions) {
  return {
    type: ActionTypes.SHOW_CHAT_SUMMARY,
    sessionsummary: sessions,

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

export function showMyPickChatSessions(sessions, userid) {
  var mypickedsessions = sessions.filter((c) => c.status != "new" && c.agent_ids.length > 0 && c.agent_ids[c.agent_ids.length - 1].id == userid)
  return {
    type: ActionTypes.SHOW_MY_PICKED_SESSIONS,
    mypickedsessions: mypickedsessions,

  };
}


export function showNewChatSessions(sessions) {
  var newsessions = sessions.filter((c) => c.status == "new")
  return {
    type: ActionTypes.SHOW_NEW_SESSIONS,
    newsessions: newsessions,

  };
}

export function showAssignedChatSessions(sessions) {
  var assignedsessions = sessions.filter((c) => c.status == "assigned" && c.agent_ids.length > 0)
  return {
    type: ActionTypes.SHOW_ASSIGNED_SESSIONS,
    assignedsessions: assignedsessions,

  };
}

export function showResolvedChatSessions(sessions) {
  var resolvedsessions = sessions.filter((c) => c.status == "resolved" && c.agent_ids.length > 0)
  return {
    type: ActionTypes.SHOW_RESOLVED_SESSIONS,
    resolvedsessions: resolvedsessions,

  };
}


export function getresolvedsessionsfromsocket(sessions, serversessions) {
  var resolvedsocketsessions = sessions.filter((c) => c.status == "resolved")
  for (var j = 0; j < resolvedsocketsessions.length - 1; j++) {
    for (var i = 0; i < serversessions.length - 1; i++) {

      if (serversessions[i].request_id == resolvedsocketsessions[j].request_id) {
        serversessions.splice(i, 1);
        break;
      }
    }
  }
  return {
    type: ActionTypes.SHOW_RESOLVED_SOCKET_SESSIONS,
    resolvedsocketsessions: resolvedsocketsessions,
    resolvedsessions: serversessions,
  };
}

export function getnewsessionsfromsocket(sessions, serversessions) {
  var newsocketsessions = sessions.filter((c) => c.status == "new")
  for (var j = 0; j < newsocketsessions.length - 1; j++) {
    for (var i = 0; i < serversessions.length - 1; i++) {

      if (serversessions[i].request_id == newsocketsessions[j].request_id) {
        serversessions.splice(i, 1);
        break;
      }
    }
  }
  return {
    type: ActionTypes.SHOW_NEW_SOCKET_SESSIONS,
    newsocketsessions: newsocketsessions,
    newsessions: serversessions,
  };
}

export function getassignedsessionsfromsocket(sessions, serversessions) {
  var assignedsocketsessions = sessions.filter((c) => c.status == "assigned")
  for (var j = 0; j < assignedsocketsessions.length - 1; j++) {
    for (var i = 0; i < serversessions.length - 1; i++) {

      if (serversessions[i].request_id == assignedsocketsessions[j].request_id) {
        serversessions.splice(i, 1);
        break;
      }
    }
  }
  return {
    type: ActionTypes.SHOW_ASSIGNED_SOCKET_SESSIONS,
    assignedsocketsessions: assignedsocketsessions,
    assignedsessions: serversessions,
  };
}
export function filterbystatus(status, customerchat) {

  var filtered;
  if (status == "all") {
    filtered = customerchat
  }
  else {
    filtered = customerchat.filter((c) => c.status == status)

  }

  printlogs('log', filtered);

  printlogs('log', customerchat);
  return {
    type: ActionTypes.FILTER_BY_STATUS,
    filtered,
    customerchat,

  };
}


export function filterbyDept(id, customerchat) {
  var filtered;
  if (id == "all") {
    filtered = customerchat
  }
  else {
    filtered = customerchat.filter((c) => c.departmentid == id)

  }
  printlogs('log', filtered);

  printlogs('log', customerchat);
  return {
    type: ActionTypes.FILTER_BY_DEPT,
    filtered,
    customerchat,

  };
}

export function filterbySubgroup(id, customerchat) {

  var filtered;
  if (id == "all") {
    filtered = customerchat
  }
  else {

    filtered = customerchat.filter((c) => c.messagechannel == id)

  }
  printlogs('log', filtered);

  printlogs('log', customerchat);
  return {
    type: ActionTypes.FILTER_BY_SUBGROUP,
    filtered,
    customerchat,

  };
}

export function filterbyAgent(id, customerchat) {

  printlogs('log', "In Filter Agent");
  var filtered;
  if (id == "all") {
    filtered = customerchat
  }
  else {

    filtered = customerchat.filter((c) => {
      printlogs('log', c.agent_ids);
      if (c.agent_ids.length != 0) {
        return c.agent_ids[c.agent_ids.length - 1].id == id;
      }
      // return id;
    });

  }
  printlogs('log', "Filtered", filtered);

  printlogs('log', "unfiltered", customerchat);
  return {
    type: ActionTypes.FILTER_BY_AGENT,
    filtered,
    customerchat,

  };
}

export function updatefbstatus(id, fbchats) {
  for (var i = 0; i < fbchats.length; i++) {
    if (fbchats[i].senderid == id) {
      fbchats[i].seen = true;
    }
  }

  return {
    fbchats: fbchats,
    type: ActionTypes.FB_CHAT_STATUS,
  }
}
export function selectFbCustomerChat(id, fbchat, profile_pic, selectedsession) {
  var newfbChat = []
  var temp = fbchat.filter((c) => c.senderid == id || c.recipientid == id);
  for (var i = 0; i < temp.length; i++) {
    if (temp[i].message) {
      newfbChat.push(
        {
          message: temp[i].message.text,
          inbound: true,
          backColor: '#3d83fa',
          textColor: "white",
          avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
          duration: 0,
          timestamp: temp[i].timestamp,
          senderid: temp[i].senderid,
          recipientid: temp[i].recipientid,
          mid: temp[i].message.mid,
          attachments: temp[i].message.attachments,
          seen: false,
          urlmeta: temp[i].urlmeta,
        })
    }
  }
  return {
    fbchatSelected: newfbChat,
    profile_pic: profile_pic,
    fbsessionSelected: selectedsession,
    type: ActionTypes.FB_CHAT_SELECTED,
  }
}


export function add_socket_fb_message(data, fbchats, id, fbsessions, order) {
  printlogs('log', id);

  fbchats.push(data);

  for (var i = 0; i < fbsessions.length; i++) {
    if (fbsessions[i].user_id.user_id == data.senderid && fbsessions[i].pageid.pageid == data.recipientid && fbsessions[i].status == "resolved") {
      fbsessions[i].status = "assigned";
      printlogs('log', 'reopening the fbsession');
      break;
    }
  }
  var newfbChat = []
  var temp = fbchats.filter((c) => c.senderid == id || c.recipientid == id);
  printlogs('log', temp.length)
  for (var i = 0; i < temp.length; i++) {
    if (temp[i].message) {
      newfbChat.push(
        {
          message: temp[i].message.text,
          inbound: true,
          backColor: '#3d83fa',
          textColor: "white",
          avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
          duration: 0,
          timestamp: temp[i].timestamp,
          senderid: temp[i].senderid,
          recipientid: temp[i].recipientid,
          mid: temp[i].message.mid,
          attachments: temp[i].message.attachments,
          seen: false,
          urlmeta: temp[i].urlmeta,
        })
    }
  }
// removing duplicates
  var newArray = [];
  var lookupObject = {};

  for (var i in newfbChat) {
    lookupObject[newfbChat[i]['mid']] = newfbChat[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }


//update last message field
  var newArrayC = []
  for (var i = 0; i < fbsessions.length; i++) {
    var selectedchat = fbchats.filter((c) => c.senderid == fbsessions[i].user_id.user_id || c.recipientid == fbsessions[i].user_id.user_id);
    var lastmessage = selectedchat[selectedchat.length - 1];
    printlogs('log', 'lastmessage');
    printlogs('log', lastmessage);
    var newfbsession = fbsessions[i];
    if (!newfbsession.lastmessage) {
      printlogs('log', 'newfbsession.lastmessage was not defined');
      newfbsession['lastmessage'] = lastmessage;
      printlogs('log', newfbsession);
    }
    else {
      newfbsession.lastmessage = lastmessage;

    }
    newArrayC.push(newfbsession);
  }

  var sorted = orderByDate(newArrayC, 'timestamp', Number(order));

  return {
    fbchatSelected: newArray,
    fbchats: fbchats,
    fbsessions: sorted,
    type: ActionTypes.FB_CHAT_ADDED,
  }


}

export function sortSessionsList(fbsessions, order) {

  var sorted = orderByDate(fbsessions, 'timestamp', Number(order));

  return {
    fbsessions: sorted,
    order: order,
    type: ActionTypes.FB_SORT_SESSIONS,

  }
}
export function selectCustomerChat(id, customerchat, new_message_arrived_rid) {
  if (new_message_arrived_rid && new_message_arrived_rid.length > 0) {

    for (var i = new_message_arrived_rid.length - 1; i >= 0; i--) {
      if (new_message_arrived_rid[i] == id) {
        //remove item from array
        new_message_arrived_rid.splice(i, 1);
      }
    }

  }
  else {
    new_message_arrived_rid = []
  }
  var customerchat_selected = customerchat.filter((c) => c.request_id == id)
  return {
    type: ActionTypes.SELECT_CUSTOMERCHAT,
    customerchat_selected,
    new_message_arrived_rid,
  };
}


export function getmypickedsessions(token, userid) {
  printlogs('log', token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getsessions`, {
      method: 'get',
      headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showMyPickChatSessions(res, userid)));
  };
}


//get new sessions list

export function getnewsessions(token) {
  printlogs('log', token);


  return (dispatch) => {
    fetch(`${baseURL}/api/getsessions`, {
      method: 'get',
      headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showNewChatSessions(res)));
  };
}

export function chatmessageSent(res) {
  return {
    type: ActionTypes.CHAT_SENT_TO_AGENT,
    status: res.status,
    //  customerid,

  };
}

//send message to customer
export function getchatfromAgent(chat) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getchatfromagent`, {
      method: 'post',
      body: JSON.stringify(chat),
      headers: new Headers({
        'Content-Type': 'application/json',

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(chatmessageSent(res)));
  };
}
//send messsage to agent
export function sendmessageToAgent(chat) {
  printlogs('log', 'sendmessageToAgent');
  printlogs('log', chat);
  return (dispatch) => {
    fetch(`${baseURL}/api/getchat`, {
      method: 'post',
      body: JSON.stringify(chat),
      headers: new Headers({
        'Content-Type': 'application/json',

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(chatmessageSent(res)));
  };
}
export function getresolvedsessions(token) {
  printlogs('log', token);


  return (dispatch) => {
    fetch(`${baseURL}/api/getsessions`, {
      method: 'get',
      headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showResolvedChatSessions(res)));
  };
}


export function getassignedsessions(token) {
  printlogs('log', token);


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
  printlogs('log', token);
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
  printlogs('log', token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getsessions`, {
      method: 'get',
      headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(getsessionsfromserver(res)));
  };
  //  dispatch(getsessionsfromserver())


}

export function previousChat(previouschat, chatlist) {
  var newchatlist = [...previouschat, ...chatlist];

  //removing duplicates
  var newArray = [];
  var lookupObject = {};

  for (var i in newchatlist) {
    lookupObject[newchatlist[i]['uniqueid']] = newchatlist[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return {
    type: ActionTypes.SHOW_CHAT_HISTORY,
    chatlist: newArray,
    //  customerid,

  };
}

export function getChatRequest(customerid, token, chlist) {
  var chatlist = [];

  if (chlist) {
    chatlist = chlist;
  }
  // var customerid = 1;
  printlogs('log', chatlist);
  return {
    type: ActionTypes.SHOW_CHAT_HISTORY,
    chatlist,
    //  customerid,

  };
}


export function updateChatList(message, ch, id_not_added) {
  printlogs('log', "update chat list is called.");
  printlogs('log', message);
  printlogs('log', ch);
  printlogs('log', id_not_added);
  printlogs('log', message.request_id);
  // id_not_added is the request_id of the customer with whom agent is already having chat
  var new_message_arrived_rid = message.request_id;
  if (!id_not_added) {
    if (ch) {
      printlogs('log', "this one");
      ch.push(new_message_arrived_rid);
    }
    else {
      ch = [];
      ch.push(new_message_arrived_rid);
    }
  }
  else {
    if (ch) {
      if (new_message_arrived_rid != id_not_added) {
        printlogs('log', "message added");
        ch.push(new_message_arrived_rid);
      }
    }
    else {
      ch = [];
      if (new_message_arrived_rid != id_not_added) {
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

export function updateSessionList(customerchat) {
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

export function uploadpicture(data, fname, token, picture) {
  //printlogs('log',data);
  printlogs('log', fname);
  var values = {
    file: data,
    fileName: fname,
    oldprofile: picture

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

export function showfilesuccess(res) {
  alert('file shared successfully');
}

export function uploadChatfile(fileData, usertoken) {
  printlogs('log', fileData);
  return (dispatch) => {
    fetch(`${baseURL}/api/uploadchatfileAgent`, {
      method: 'post',
      body: fileData,
      headers: new Headers({
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showfilesuccess(res))
    );
  };

};


/*** get notifications ***/
export function getnotifications(token) {
  printlogs('log', token);
  return (dispatch) => {
    fetch(`${baseURL}/api/getnotifications`, {
      method: 'get',
      headers: new Headers({
        'Authorization': token

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showNotifications(res)));
  };
}


export function confirmNotification(res) {
  printlogs('log', res);
  return {
    type: ActionTypes.CONFIRM_NOTIFICATION,
    msg: 'success',

  };
}


export function createNotification(notification) {
  return (dispatch) => {
    fetch(`${baseURL}/api/createNotification`, {
      method: 'post',
      body: JSON.stringify({
        notification: notification.notification,
        customers: notification.customers
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
        customers: notification.customers
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
export function deletenotification(notification, usertoken) {
  printlogs('log', 'deletenotification Action is called ' + notification._id + 'your token : ' + usertoken);
  if (confirm("Do you want to delete this notification?")) {
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
  else {
    browserHistory.push('/notifications');

  }

}


export function editNotification(notification, usertoken) {
  printlogs('log', notification);
  printlogs('log', usertoken);
  printlogs('log', 'edit notification is called');
  return (dispatch) => {
    fetch(`${baseURL}/api/editNotification`, {
      method: 'post',
      headers: new Headers({
        'Authorization': usertoken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        notification: notification
      })

      ,
    }).then((res) => res.json()).then((res) => res).then((res) => {
        printlogs('log', res.statusCode);
        browserHistory.push('/notifications');

      }
    );
  };
}


export function getNotificationRequest(id, usertoken) {
  printlogs('log', id)
  return {
    type: ActionTypes.ADD_SELECTED_NOTIFICATION,
    id,
  };
}

/******************* Customer Directory ****************/

export function getCustomerRequest(id) {
  printlogs('log', id)
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
  printlogs('log', countryinfo);
  return {
    type: ActionTypes.SHOW_COUNTRY_NAME,
    countryinfo,
  };
}

export function getcountryname(token) {
  printlogs('log', token);
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
  printlogs('log', token);
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
    customer: customer,
    msg: 'success',

  };
}


export function createcustomer(customer) {
  return (dispatch) => {
    fetch(`${baseURL}/api/createCustomer`, {
      method: 'post',
      body: JSON.stringify({
        customer: customer,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',

      }),
    }).then((res) => res.json()).then(res => dispatch(confirmCustomer(res.customer)));
  };
}


export function emailCustomer(customer) {
  printlogs('log', customer);
  return (dispatch) => {
    fetch(`${baseURL}/api/emailCustomer`, {
      method: 'post',
      body: JSON.stringify({
        to: customer.emailMsg.to,
        emailAdd: customer.emailMsg.emailAdd,
        subject: customer.emailMsg.subject,
        body: customer.emailMsg.body,
        from: customer.emailMsg.from,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': customer.usertoken,

      }),
    }).then((res) => res.json()).then(res => {
      printlogs('log', res.statusCode);
      if (res.statusCode == 200) {
        alert('Email sent successfully.');
        browserHistory.push('/customers');
      }
      else {
        alert('Email not sent to customer.There might be some errors.');
        browserHistory.push('/customers');
      }
    });
  };
}


export function submitemail(customer, redirect_url) {
  printlogs('log', customer);
  return (dispatch) => {
    fetch(`${baseURL}/api/rescheduleEmail`, {
      method: 'post',
      body: JSON.stringify({
        to: customer.emailMsg.to,
        emailAdd: customer.emailMsg.emailAdd,
        subject: customer.emailMsg.subject,
        body: customer.emailMsg.body,
        from: customer.emailMsg.from,
        url: customer.emailMsg.url
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': customer.usertoken,

      }),
    }).then((res) => res.json()).then(res => {
      printlogs('log', res.statusCode);
      if (res.statusCode == 200) {
        alert('Email sent successfully.');
        browserHistory.push(redirect_url);
      }
      else {
        alert('Email not sent to customer.There might be some errors.');
        browserHistory.push(redirect_url);
      }
    });
  };
}


export function updatereschedule(session, customer, redirect_url) {
  return (dispatch) => {
    fetch(`${baseURL}/api/updatereschedule`, {
      method: 'post',
      body: JSON.stringify({
        is_rescheduled: session.is_rescheduled,
        rescheduled_by: session.rescheduled_by,
        request_id: session.request_id,
        companyid: session.companyid,

      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': session.usertoken,

      }),
    }).then((res) => res.json()).then(res => dispatch(submitemail(customer, redirect_url)));
  };
}

export function confirmSession(session) {
  return {
    type: ActionTypes.CREATE_SESSION,
    session,
    msg: 'success',

  };
}

export function addRoom(room) {
  return {
    type: ActionTypes.ADD_ROOM_DETAILS,
    room,


  };
}

export function updateAgentList(onlineAgents) {
  var newArray = [];
  var lookupObject = {};

  for (var i in onlineAgents) {
    lookupObject[onlineAgents[i]['email']] = onlineAgents[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return {
    type: ActionTypes.ONLINE_AGENTS,
    onlineAgents: newArray,
  }
}

/***** session create ****/
export function createsession(session) {
  printlogs('log', session);
  return (dispatch) => {
    fetch(`${baseURL}/api/createsession`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',

      }),
      body: JSON.stringify({
        session: session
      }),


    }).then((res) => res.json()).then(res => {
      printlogs('log', res.statusCode);
      if (res.statusCode == 201) {
        // alert('session created successfully.');
        dispatch(confirmSession(session));
      }
      else {
        alert('Session not created');

      }
    });
  };
}

export function savechatResponse(chat) {
  return {
    type: ActionTypes.CHAT_SAVE_RESPONSE,
    tempMessage: chat,
    ismessageSaved: 'true',
  }
}
export function savechat(chat) {
  printlogs('log', chat);
  return (dispatch) => {
    fetch(`${baseURL}/api/savechat`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',

      }),
      body: JSON.stringify({
        chat: chat
      }),


    }).then((res) => res.json()).then(res => {
      printlogs('log', res.statusCode);
      if (res.statusCode == 201) {
        printlogs('log', 'chat saved.');
        dispatch(savechatResponse(chat));

      }
      else {
        printlogs('log', 'chat not saved.');

      }
    });
  };
}


/**** update chat status when the session is assigned to agent ***/

export function updateSessionStatus(session) {

  printlogs('log', 'updateSessionStatus is called');
  return {
    type: ActionTypes.UPDATE_SESSION_STATUS,
    session,
  }

}

export function assignToAgentResponse(session) {

  printlogs('log', 'assignToAgentResponse is called');
  return {
    type: ActionTypes.ASSIGN_CHAT_TO_AGENT,
    session,
  }
}
export function resolvesessionResponse(request_id, customerchat) {

  for (var i = 0; i < customerchat.length; i++) {
    if (customerchat[i].request_id == request_id) {
      customerchat[i].status = 'resolved';
      break;

    }
  }
  printlogs('log', 'resolvesession called');
  return {
    type: ActionTypes.RESOLVE_SESSION,
    customerchat: customerchat,

  }
}

export function movedToMessageSubgroupResponse(session) {
  printlogs('log', 'assignToSubgroupResponse is called');
  return {
    type: ActionTypes.MOVE_TO_MESSAGESUBGROUP,
    session,
  }
}
//this is for picking session
export function updatestatus(session) {
  return (dispatch) => {
    fetch(`${baseURL}/api/pickchatsession`, {
      method: 'post',
      body: JSON.stringify({
        request_id: session.request_id,

      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': session.usertoken,
      }),
    }).then((res) => res.json()).then(res => dispatch(updateSessionStatus(session)));
  };
}

/**** update agent assignment table when the session is assigned to agent ***/

export function assignToAgent(session, usertoken, agentemail, assignmentType) {
  return (dispatch) => {
    fetch(`${baseURL}/api/assignToAgent`, {
      method: 'post',
      body: JSON.stringify({
        companyid: session.companyid,
        sessionid: session.sessionid,
        agentAssignment: session,
        type: session.type,
        agentemail: agentemail,
        assignmentType: assignmentType,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then(res => dispatch(assignToAgentResponse(session)));
  };
}

//moved to message subgroup
export function movedToMessageSubgroup(session, usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/movedToMessageSubgroup`, {
      method: 'post',
      body: JSON.stringify({
        companyid: session.companyid,
        sessionid: session.sessionid,
        subgroupAssignment: session,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then(res => dispatch(movedToMessageSubgroupResponse(session)));
  };
}


export function setsocketid(yoursocketid) {
  return {
    type: ActionTypes.SET_SOCKET_ID,
    yoursocketid,


  };
}

export function getchatsfromsocket(originalArray, newchats) {

  var newchatlist = [...originalArray, ...newchats];

  var newArray = [];
  var lookupObject = {};
  var prop = 'uniqueid';
  for (var i in newchatlist) {
    lookupObject[newchatlist[i][prop]] = newchatlist[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return {
    type: ActionTypes.ADD_USER_CHATS,
    userchats: newArray,
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
    userchathistory: userchats,


  };
}

var sortBy = (function () {

  //cached privated objects
  var _toString = Object.prototype.toString,
    //the default parser function
    _parser = function (x) {
      return x;
    },
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
  var sort_us = sortBy(userchats, {desc: false, prop: "datetime"});//userchats.sort(sortFunction);​
  return {
    type: ActionTypes.ADD_USER_CHATS_SPECIFIC_MOBILE,
    mobileuserchat: sort_us,


  };
}
export function getuserchats(token) {
  printlogs('log', token);
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
export function resolvesession(request_id, usertoken, customerchat) {
  if (confirm("Are you sure,you want to mark session resolved?")) {
    return (dispatch) => {
      fetch(`${baseURL}/api/resolvechatsession`, {
        method: 'post',
        body: JSON.stringify({
          request_id: request_id,
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': usertoken,

        }),
      }).then((res) => res.json()).then(res => dispatch(resolvesessionResponse(request_id, customerchat)));
    };
  }
}


//for fetching history of mobile clients
export function getspecificuserchats_mobile(request_id, companyid, usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getspecificuserchats`, {
      method: 'post',
      body: JSON.stringify({
        request_id: request_id,
        companyid: companyid,
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


export function getspecificuserchats(request_id, companyid, usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getspecificuserchats`, {
      method: 'post',
      body: JSON.stringify({
        request_id: request_id,
        companyid: companyid,
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
  printlogs('log', mygroups);
  return {
    type: ActionTypes.ADD_MY_GROUPS,
    mygroups,

  };
}
export function getmyusergroups(token) {
  printlogs('log', token);
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
export function showUpdateProfile(msg) {
  printlogs('log', msg);
  return {
    type: ActionTypes.ADD_UPDATE_PROFILE_WARNINGS,
    errormessage: msg,

  };
}

//update profile
export function showUpdateSettings(msg) {
  printlogs('log', msg);
  return {
    type: ActionTypes.ADD_UPDATE_SETTINGS,
    errormessage: msg,
    companysettings: msg.company,

  };
}
export function showCreatePage(msg) {
  printlogs('log', msg);
  return {
    type: ActionTypes.ADD_UPDATE_PROFILE_WARNINGS,
    errormessage: msg,

  };
}
export function updateprofile(user, token) {
  printlogs('log', user);
  return (dispatch) => {
    fetch(`${baseURL}/api/updateprofile`, {
      method: 'post',
      body: JSON.stringify({
        'firstname': user.firstname,
        'lastname': user.lastname,
        'phone': user.phone,
        'country': user.country,
        'state': user.state,
        'city': user.city,


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

export function changepassword(user, token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/changenewpassword`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
      body: JSON.stringify({
        'email': user.email,
        'password': user.password,
        'newpassword': user.newpassword

      })

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showUpdateProfile(res)));
  };

}

export function createPage(fbpage, token,teamagents) {
  printlogs('log', fbpage);
  return (dispatch) => {
    fetch(`${baseURL}/api/createfbPage`, {
      method: 'post',
      body: JSON.stringify({
        fbpage: fbpage,
        teamagents:teamagents,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': token,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showCreatePage(res))
    );
  };
}

export function updatesettings(file, companyprofile, token, logoAlready) {
  var fileData = new FormData();
  if (logoAlready == true) {
    fileData.append('companyprofile', JSON.stringify(companyprofile));

  }
  else {
    fileData.append('file', file);
    fileData.append('filename', file.name);
    fileData.append('filetype', file.type);
    fileData.append('filesize', file.size);
    fileData.append('companyprofile', JSON.stringify(companyprofile));
  }
  printlogs('log', fileData);

  return (dispatch) =>
    fetch(`${baseURL}/api/updatesettings`, {

      method: 'post',
      body: fileData,
      headers: new Headers({
        'Authorization': token,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showUpdateSettings(res))
    );
};


export function showcompanyprofile(companysettings) {
  printlogs('log', companysettings);
  return {
    type: ActionTypes.COMPANY_PROFILE,
    companysettings,

  };
}
export function getcompanysettings(token, id) {
  printlogs('log', token);
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

/*********** filter abandoned sessions ***********/

export function filterAbandonedSession(groupID, subgroupID, newsessions) {
  var newsessionsfiltered;

  if (groupID !== 'all' && subgroupID !== 'all') {
    newsessionsfiltered = newsessions.filter((c) => c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (groupID !== 'all' && subgroupID == 'all') {
    newsessionsfiltered = newsessions.filter((c) => c.departmentid == groupID);
  }
  else if (groupID == 'all' && subgroupID !== 'all') {
    newsessionsfiltered = newsessions.filter((c) => c.departmentid == groupID);
  }
  else if (groupID == 'all' && subgroupID == 'all') {
    newsessionsfiltered = newsessions;
  }


  return {
    type: ActionTypes.FILTER_NEW_SESSION,
    newsessionsfiltered,
    newsessions,

  };
}

/*********** filter assigned sessions ***********/

export function filterAssignedSession(medium, groupID, subgroupID, agentID, assignedsessions) {
  var assignedsessionsfiltered;

  if (medium !== 'all' && groupID !== 'all' && subgroupID !== 'all' && agentID !== 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.platform == medium && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (medium !== 'all' && groupID !== 'all' && subgroupID !== 'all' && agentID == 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.platform == medium && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (medium !== 'all' && groupID !== 'all' && subgroupID == 'all' && agentID !== 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.platform == medium && c.departmentid == groupID);
  }
  else if (medium !== 'all' && groupID !== 'all' && subgroupID == 'all' && agentID == 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.platform == medium && c.departmentid == groupID);
  }
  else if (medium !== 'all' && groupID == 'all' && subgroupID !== 'all' && agentID !== 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.platform == medium && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (medium !== 'all' && groupID == 'all' && subgroupID !== 'all' && agentID == 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.platform == medium && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (medium !== 'all' && groupID == 'all' && subgroupID == 'all' && agentID !== 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.platform == medium);
  }
  else if (medium !== 'all' && groupID == 'all' && subgroupID == 'all' && agentID == 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.platform == medium);
  }
  else if (medium == 'all' && groupID !== 'all' && subgroupID !== 'all' && agentID !== 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (medium == 'all' && groupID !== 'all' && subgroupID !== 'all' && agentID == 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (medium == 'all' && groupID !== 'all' && subgroupID == 'all' && agentID !== 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.departmentid == groupID);
  }
  else if (medium == 'all' && groupID !== 'all' && subgroupID == 'all' && agentID == 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.departmentid == groupID);
  }
  else if (medium == 'all' && groupID == 'all' && subgroupID !== 'all' && agentID !== 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (medium == 'all' && groupID == 'all' && subgroupID !== 'all' && agentID == 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (medium == 'all' && groupID == 'all' && subgroupID == 'all' && agentID !== 'all') {
    assignedsessionsfiltered = assignedsessions.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID);
  }
  else if (medium == 'all' && groupID == 'all' && subgroupID == 'all' && agentID == 'all') {
    assignedsessionsfiltered = assignedsessions;
  }

  return {
    type: ActionTypes.FILTER_ASSIGNED_SESSION,
    assignedsessionsfiltered,
    assignedsessions,

  };
}

/*********** filter resolved sessions ***********/

export function filterResolvedSession(groupID, subgroupID, agentID, resolvedsessions) {
  var resolvedsessionsfiltered;

  if (groupID !== 'all' && subgroupID !== 'all' && agentID !== 'all') {
    resolvedsessionsfiltered = resolvedsessions.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (groupID !== 'all' && subgroupID !== 'all' && agentID == 'all') {
    resolvedsessionsfiltered = resolvedsessions.filter((c) => c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (groupID !== 'all' && subgroupID == 'all' && agentID !== 'all') {
    resolvedsessionsfiltered = resolvedsessions.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.departmentid == groupID);
  }
  else if (groupID !== 'all' && subgroupID == 'all' && agentID == 'all') {
    resolvedsessionsfiltered = resolvedsessions.filter((c) => c.departmentid == groupID);
  }
  else if (groupID == 'all' && subgroupID !== 'all' && agentID !== 'all') {
    resolvedsessionsfiltered = resolvedsessions.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (groupID == 'all' && subgroupID !== 'all' && agentID == 'all') {
    resolvedsessionsfiltered = resolvedsessions.filter((c) => c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (groupID == 'all' && subgroupID == 'all' && agentID !== 'all') {
    resolvedsessionsfiltered = resolvedsessions.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID);
  }
  else if (groupID == 'all' && subgroupID == 'all' && agentID == 'all') {
    resolvedsessionsfiltered = resolvedsessions;
  }

  return {
    type: ActionTypes.FILTER_RESOLVED_SESSION,
    resolvedsessionsfiltered,
    resolvedsessions,

  };
}

/*********** filter sessionsummary ***********/

export function filterSessionSummary(status, medium, agentID, groupID, subgroupID, sessionsummary) {
  var sessionsummaryfiltered;
  if (status !== 'all' && medium !== 'all' && agentID !== 'all' && groupID !== 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.status == status && c.platform == medium && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status !== 'all' && medium !== 'all' && agentID !== 'all' && groupID !== 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.status == status && c.platform == medium && c.departmentid == groupID);
  }
  else if (status !== 'all' && medium !== 'all' && agentID !== 'all' && groupID == 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.status == status && c.platform == medium && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status !== 'all' && medium !== 'all' && agentID !== 'all' && groupID == 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.status == status && c.platform == medium);
  }
  else if (status !== 'all' && medium !== 'all' && agentID == 'all' && groupID !== 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.status == status && c.platform == medium && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status !== 'all' && medium !== 'all' && agentID == 'all' && groupID !== 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.status == status && c.platform == medium && c.departmentid == groupID);
  }
  else if (status !== 'all' && medium !== 'all' && agentID == 'all' && groupID == 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.status == status && c.platform == medium && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status !== 'all' && medium !== 'all' && agentID == 'all' && groupID == 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.status == status && c.platform == medium);
  }
  else if (status !== 'all' && medium == 'all' && agentID !== 'all' && groupID !== 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.status == status && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status !== 'all' && medium == 'all' && agentID !== 'all' && groupID !== 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.status == status && c.departmentid == groupID);
  }
  else if (status !== 'all' && medium == 'all' && agentID !== 'all' && groupID == 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.status == status && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status !== 'all' && medium == 'all' && agentID !== 'all' && groupID == 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.status == status);
  }
  else if (status !== 'all' && medium == 'all' && agentID == 'all' && groupID !== 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.status == status && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status !== 'all' && medium == 'all' && agentID == 'all' && groupID !== 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.status == status && c.departmentid == groupID);
  }
  else if (status !== 'all' && medium == 'all' && agentID == 'all' && groupID == 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.status == status && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status !== 'all' && medium == 'all' && agentID == 'all' && groupID == 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.status == status);
  }
  else if (status == 'all' && medium !== 'all' && agentID !== 'all' && groupID !== 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.platform == medium && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status == 'all' && medium !== 'all' && agentID !== 'all' && groupID !== 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.platform == medium && c.departmentid == groupID);
  }
  else if (status == 'all' && medium !== 'all' && agentID !== 'all' && groupID == 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.platform == medium && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status == 'all' && medium !== 'all' && agentID !== 'all' && groupID == 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.platform == medium);
  }
  else if (status == 'all' && medium !== 'all' && agentID == 'all' && groupID !== 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.platform == medium && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status == 'all' && medium !== 'all' && agentID == 'all' && groupID !== 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.platform == medium && c.departmentid == groupID);
  }
  else if (status == 'all' && medium !== 'all' && agentID == 'all' && groupID == 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.platform == medium && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status == 'all' && medium !== 'all' && agentID == 'all' && groupID == 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.platform == medium);
  }
  else if (status == 'all' && medium == 'all' && agentID !== 'all' && groupID !== 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status == 'all' && medium == 'all' && agentID !== 'all' && groupID !== 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.departmentid == groupID);
  }
  else if (status == 'all' && medium == 'all' && agentID !== 'all' && groupID == 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status == 'all' && medium == 'all' && agentID !== 'all' && groupID == 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID);
  }
  else if (status == 'all' && medium == 'all' && agentID == 'all' && groupID !== 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status == 'all' && medium == 'all' && agentID == 'all' && groupID !== 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.departmentid == groupID);
  }
  else if (status == 'all' && medium == 'all' && agentID == 'all' && groupID == 'all' && subgroupID !== 'all') {
    sessionsummaryfiltered = sessionsummary.filter((c) => c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status == 'all' && medium == 'all' && agentID == 'all' && groupID == 'all' && subgroupID == 'all') {
    sessionsummaryfiltered = sessionsummary;
  }

  return {
    type: ActionTypes.FILTER_BY_SESSION,
    sessionsummaryfiltered,
    sessionsummary,

  };
}

/*********** filter chat ***********/

export function filterChat(status, agentID, groupID, subgroupID, customerchat) {
  var customerchatfiltered;
  if (status !== 'all' && agentID !== 'all' && groupID !== 'all' && subgroupID !== 'all') {
    customerchatfiltered = customerchat.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.status == status && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status !== 'all' && agentID !== 'all' && groupID !== 'all' && subgroupID == 'all') {
    customerchatfiltered = customerchat.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.status == status && c.departmentid == groupID);
  }
  else if (status !== 'all' && agentID !== 'all' && groupID == 'all' && subgroupID !== 'all') {
    customerchatfiltered = customerchat.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.status == status && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status !== 'all' && agentID !== 'all' && groupID == 'all' && subgroupID == 'all') {
    customerchatfiltered = customerchat.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.status == status);
  }
  else if (status !== 'all' && agentID == 'all' && groupID !== 'all' && subgroupID !== 'all') {
    customerchatfiltered = customerchat.filter((c) => c.status == status && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status !== 'all' && agentID == 'all' && groupID !== 'all' && subgroupID == 'all') {
    customerchatfiltered = customerchat.filter((c) => c.status == status && c.departmentid == groupID);
  }
  else if (status !== 'all' && agentID == 'all' && groupID == 'all' && subgroupID !== 'all') {
    customerchatfiltered = customerchat.filter((c) => c.status == status && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status !== 'all' && agentID == 'all' && groupID == 'all' && subgroupID == 'all') {
    customerchatfiltered = customerchat.filter((c) => c.status == status);
  }
  else if (status == 'all' && agentID !== 'all' && groupID !== 'all' && subgroupID !== 'all') {
    customerchatfiltered = customerchat.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status == 'all' && agentID !== 'all' && groupID !== 'all' && subgroupID == 'all') {
    customerchatfiltered = customerchat.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.departmentid == groupID);
  }
  else if (status == 'all' && agentID !== 'all' && groupID == 'all' && subgroupID !== 'all') {
    customerchatfiltered = customerchat.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status == 'all' && agentID !== 'all' && groupID == 'all' && subgroupID == 'all') {
    customerchatfiltered = customerchat.filter((c) => c.agent_ids.length > 0).filter((c) => c.agent_ids[c.agent_ids.length - 1].id == agentID);
  }
  else if (status == 'all' && agentID == 'all' && groupID !== 'all' && subgroupID !== 'all') {
    customerchatfiltered = customerchat.filter((c) => c.departmentid == groupID && c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status == 'all' && agentID == 'all' && groupID !== 'all' && subgroupID == 'all') {
    customerchatfiltered = customerchat.filter((c) => c.departmentid == groupID);
  }
  else if (status == 'all' && agentID == 'all' && groupID == 'all' && subgroupID !== 'all') {
    customerchatfiltered = customerchat.filter((c) => c.messagechannel[c.messagechannel.length - 1] == subgroupID);
  }
  else if (status == 'all' && agentID == 'all' && groupID == 'all' && subgroupID == 'all') {
    customerchatfiltered = customerchat;
  }

  return {
    type: ActionTypes.FILTER_BY_CHAT,
    customerchatfiltered,
    customerchat,

  };
}

/****** High Charts
 **/
export function subgroupwisestats(subgroupwisestats) {
  return {
    type: ActionTypes.SUBGROUP_STATS,
    subgroupwisestats,

  };
}

export function platformwisestats(platformwisestats) {
  return {
    type: ActionTypes.PLATFORM_STATS,
    platformwisestats,

  };
}

export function deptwisestats(deptwisestats) {
  return {
    type: ActionTypes.DEPT_STATS,
    deptwisestats,

  };
}


export function pagewisestats(pagewisestats) {
  return {
    type: ActionTypes.PAGE_STATS,
    pagewisestats,

  };
}

export function countrywisestats(countrywisestats) {
  return {
    type: ActionTypes.COUNTRY_STATS,
    countrywisestats,

  };
}


export function mobilewisestats(mobilewisestats) {
  return {
    type: ActionTypes.MOBILE_STATS,
    mobilewisestats,

  };
}


export function agentwisestats(agentwisestats) {
  return {
    type: ActionTypes.AGENT_STATS,
    agentwisestats,

  };
}


export function agentwisenotifications(agentwisenotifications) {
  return {
    type: ActionTypes.AGENT_NOTIFICATIONS,
    agentwisenotifications,

  };
}

export function customerstats(customerwisestats) {
  return {
    type: ActionTypes.CUSTOMER_STATS,
    customerwisestats,

  };
}

export function getsubgroupwisestats(departmentid, token) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getsubgroupwisecalls`, {
      method: 'post',
      body: JSON.stringify({
        departmentid: departmentid,
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
export function createnews(news, usertoken) {
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

      printlogs('log', res);
    });
  };
}

export function showNews(news, userid) {
  news = news.filter((c) => c.target == userid && c.unread == "true");
  return {
    type: ActionTypes.ADD_NEWS,
    news,

  };
}

export function getnews(userid, usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getnews`, {
      method: 'post',
      body: JSON.stringify({
        target: userid
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showNews(res, userid)));
  };
}


export function updatenews(news, usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/updatenews`, {
      method: 'post',
      body: JSON.stringify({
        newsid: news._id,
        unread: "false",
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


export function UpdateChatStatusUI(messages, mobileuserchat) {
  //alert('called')
  for (var i = 0; i < messages.length; i++) {
    var obj = messages[i];

    for (var j = 0; j < mobileuserchat.length; j++) {
      if (obj.uniqueid == mobileuserchat[j].uniqueid) {
        //  alert('setting status')
        mobileuserchat[j].status = obj.status;
        break;
      }
    }
  }
  return {
    type: ActionTypes.ADD_USER_CHATS_SPECIFIC_MOBILE,
    mobileuserchat: mobileuserchat,


  };
}
export function downloadfile(body, usertoken) {
  fetch(`${baseURL}/api/downloadchatfile`, {
    method: 'post',
    body: JSON.stringify({
      uniqueid: body.uniqueid,

    }),

    headers: new Headers({
      'Authorization': usertoken,
      'Content-Type': 'application/json',
      'kibo-app-id': '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
      'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
      'kibo-client-id': 'cd89f71715f2014725163952',


    }),

  })
}
export function updatechatstatus(messages, customerid, usertoken, mobileuserchat) {

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
        printlogs('log', res.statusCode);

        if (res.statusCode == 201 && mobileuserchat) {
          dispatch(UpdateChatStatusUI(messages, mobileuserchat))
        }
      }
    );
  };
}


/***** function to remove duplicate chat messages from UI *******/

export function removeDuplicates(originalArray, prop) {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return {
    type: ActionTypes.ADD_USER_CHATS_SPECIFIC_MOBILE,
    mobileuserchat: newArray,


  };
}

export function removeDuplicatesWebChat(originalArray, prop) {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return {
    type: ActionTypes.ADD_USER_CHATS_SPECIFIC_WEB,
    userchats: newArray,


  };
}


/***** Facebook actions ***/
export function showFbPages(fbpages) {
  printlogs('log', 'showFbpages');
  printlogs('log', fbpages);
  return {
    type: ActionTypes.ADD_FB_PAGES,
    fbpages,

  };
}

export function getfbpages(token) {
  printlogs('log', 'getfbpages is called');
  printlogs('log', token);
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
 // alert(fbpage.pageid);
  return {
    type: ActionTypes.ADD_SELECTED_PAGE,
    fbpage,
  };
}


export function getfbpage(usertoken, pageid) {
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
export function editPage(fbpage, token) {
  printlogs('log', fbpage);
  return (dispatch) => {
    fetch(`${baseURL}/api/editfbPage`, {
      method: 'post',
      body: JSON.stringify({
        fbpage: fbpage,
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
export function deletefbpage(fbpage, usertoken) {
  if (confirm("Are you sure you want to remove this page?")) {
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
  else {
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

export function showFbSessions(fbsessions) {

  return {
    type: ActionTypes.ADD_FB_SESSIONS,
    fbsessions,

  };
}

function orderByDateFbChats(arr, dateProp) {
  return arr.slice().sort(function (a, b) {
      return a[dateProp] - b[dateProp];

    }
  );
}
export function showFbChats(fbchats) {
  var sorted = orderByDateFbChats(fbchats, 'timestamp');
  return {
    type: ActionTypes.ADD_FB_CHATS,
    fbchats: sorted,

  };
}

export function getfbCustomers(usertoken) {
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

function orderByDate(arr, dateProp, order = 0) {
  return arr.slice().sort(function (a, b) {
    printlogs('log', a['lastmessage'][dateProp]);
    if (order == 0)
      return b['lastmessage'][dateProp] - a['lastmessage'][dateProp];
    else {
      return a['lastmessage'][dateProp] - b['lastmessage'][dateProp];
    }
  });
}
export function appendlastmessage(fbsessions, fbchats) {

  var newArray = []
  var newfbChat = []
  for (var i = 0; i < fbsessions.length; i++) {
    var selectedchat = fbchats.filter((c) => c.senderid == fbsessions[i].user_id.user_id || c.recipientid == fbsessions[i].user_id.user_id);
    var lastmessage = selectedchat[selectedchat.length - 1];
    var newfbsession = fbsessions[i];
    newfbsession.lastmessage = lastmessage;
    newArray.push(newfbsession);
  }

  var sorted = orderByDate(newArray, 'timestamp');
  var choosen_session = sorted.filter((c) => c.status != "resolved")[0];
  var newfbChat = []
  var temp = fbchats.filter((c) => c.senderid == choosen_session.user_id.user_id || c.recipientid == choosen_session.user_id.user_id);
  for (var i = 0; i < temp.length; i++) {
    if (temp[i].message) {
      newfbChat.push(
        {
          message: temp[i].message.text,
          inbound: true,
          backColor: '#3d83fa',
          textColor: "white",
          avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
          duration: 0,
          timestamp: temp[i].timestamp,
          senderid: temp[i].senderid,
          recipientid: temp[i].recipientid,
          mid: temp[i].message.mid,
          attachments: temp[i].message.attachments,
          seen: false,
          urlmeta: temp[i].urlmeta,
        })
    }
  }

  return {
    type: ActionTypes.ADD_LASTMESSAGE_FB_SESSION,
    fbchatSelected: newfbChat,
    profile_pic: choosen_session.user_id.profile_pic,
    fbsessionSelected: choosen_session,
    sorted,

  };

}


export function updatelastmessage(fbsessions, fbchats) {

  var newArray = []
  var newfbChat = []
  for (var i = 0; i < fbsessions.length; i++) {
    var selectedchat = fbchats.filter((c) => c.senderid == fbsessions[i].user_id.user_id || c.recipientid == fbsessions[i].user_id.user_id);
    var lastmessage = selectedchat[selectedchat.length - 1];
    var newfbsession = fbsessions[i];
    newfbsession.lastmessage = lastmessage;
    newArray.push(newfbsession);
  }

  var sorted = orderByDate(newArray, 'timestamp');


  return {
    type: ActionTypes.UPDATE_LASTMESSAGE_FB_SESSION,
    sorted,

  };

}
export function getfbSessions(usertoken) {
  return (dispatch) => {
    fetch(`${baseURL}/api/getfbSessions`, {
      method: 'get',

      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,
      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showFbSessions(res))
    );
  };
}

export function getfbChats(usertoken) {
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
export function updateCustomerList(data, customerlist, selectedchat) {
  printlogs('log', 'selectedchat');
  printlogs('log', selectedchat);
  data.lastmessage = {};
  customerlist.push(data);
  var newArray = [];
  var lookupObject = {};

  for (var i in customerlist) {
    lookupObject[customerlist[i]['user_id']['user_id']] = customerlist[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  if (!selectedchat.user_id) {
    printlogs('log', 'user_id not defined');
    printlogs('log', newArray[0]);
    return {
      type: ActionTypes.ADD_NEW_FB_CUSTOMER,
      fbsessions: newArray,
      fbsessionSelected: newArray[0],
    }
  }
  else {
    return {
      type: ActionTypes.ADD_NEW_FB_CUSTOMER,
      fbsessions: newArray,

    }
  }
}

export function updatefbsessionlist(data, customerlist, currentSession, fbchat, fbchatSelected) {
  var resetcurrent = false;
  for (var i = 0; i < customerlist.length; i++) {
    if (customerlist[i].pageid.pageid == data.pageid && customerlist[i].user_id.user_id == data.user_id) {
      customerlist[i].status = data.status;
      customerlist[i].agent_ids.push(data.agentid);
      break;
    }
  }

  if (currentSession.pageid.pageid == data.pageid && currentSession.user_id.user_id == data.user_id) {
    currentSession.status = data.status;
    currentSession.agent_ids.push(data.agentid);
  }

  if (currentSession.status == "resolved") {
    // we need to reset currentSession to the first (new/assigned session in the list) session
    var newfbChat = [];
    for (var j = 0; j < customerlist.length; j++) {
      if (customerlist[j].status != "resolved") {
        var newcurrentSession = customerlist[j];

        var temp = fbchat.filter((c) => c.senderid == currentSession.user_id.user_id || c.recipientid == currentSession.user_id.user_id);
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].message) {
            newfbChat.push(
              {
                message: temp[i].message.text,
                inbound: true,
                backColor: '#3d83fa',
                textColor: "white",
                avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
                duration: 0,
                timestamp: temp[i].timestamp,
                senderid: temp[i].senderid,
                recipientid: temp[i].recipientid,
                mid: temp[i].message.mid,
                attachments: temp[i].message.attachments,
                seen: false,
                urlmeta: temp[i].urlmeta,
              })
          }
        }
        break;
      }


    }
    resetcurrent = true;

  }

  return {
    type: ActionTypes.ADD_NEW_FB_CUSTOMER,
    fbsessions: customerlist,
    fbsessionSelected: resetcurrent == true ? newcurrentSession : currentSession,
    fbchatSelected: resetcurrent == true ? newfbChat : fbchatSelected,
  }
}
//send chat to facebook customer

//send message to customer
export function getfbchatfromAgent(chat) {
  return (dispatch) => {
    fetch(`${baseURL}/api/sendfbchat`, {
      method: 'post',
      body: JSON.stringify(chat),
      headers: new Headers({
        'Content-Type': 'application/json',

      }),
    }).then((res) => res.json()).then((res) => res).then(res => dispatch(fbchatmessageSent(res)));
  };
}


export function fbchatmessageSent(res) {
  return {
    type: ActionTypes.FBCHAT_SENT_TO_AGENT,
    status: res.status,
    loadingurl: false,
    urlLoading: '',
    //  customerid,

  };
}

export function showfbfilesuccess(chat, fbchats, id) {
  printlogs('log', 'showfbfilesuccess');
  printlogs('log', fbchats.length);
  fbchats.push(chat.chatmsg);
  var newfbChat = []
  var temp = fbchats.filter((c) => c.senderid == id || c.recipientid == id);
  for (var i = 0; i < temp.length; i++) {
    if (temp[i].message) {
      newfbChat.push(
        {
          message: temp[i].message.text,
          inbound: true,
          backColor: '#3d83fa',
          textColor: "white",
          avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
          duration: 0,
          timestamp: temp[i].timestamp,
          senderid: temp[i].senderid,
          recipientid: temp[i].recipientid,
          mid: temp[i].message.mid,
          attachments: temp[i].message.attachments,
          seen: false,
          urlmeta: temp[i].urlmeta,
        })
    }
  }

  // removing duplicates
  var newArray = [];
  var lookupObject = {};

  for (var i in newfbChat) {
    lookupObject[newfbChat[i]['mid']] = newfbChat[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }

  // removing duplicates from fbchats
  var newArrayfb = [];
  var lookupObject = {};

  for (var i in fbchats) {
    lookupObject[fbchats[i]['message']['mid']] = fbchats[i];
  }

  for (i in lookupObject) {
    newArrayfb.push(lookupObject[i]);
  }
  return {
    fbchatSelected: newArray,
    fbchats: newArrayfb,
    type: ActionTypes.FB_CHAT_ADDED,
  }

}

export function uploadFbChatfile(fileData, usertoken, fbchats, id) {
  printlogs('log', fileData);
  return (dispatch) => {
    fetch(`${baseURL}/api/uploadchatfilefb`, {
      method: 'post',
      body: fileData,
      headers: new Headers({
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(showfbfilesuccess(res, fbchats, id))
    );
  };

};


export function updatefileuploadStatus(status) {
  return {
    showFileUploading: status,
    type: ActionTypes.SHOW_FILE_UPLOAD_INDICATOR,
  }
}
/*** reseting joined state ***/
export function setjoinedState(stateVar) {
  return {
    userjoinedroom: stateVar,
    type: ActionTypes.JOINED_MEETING,
  }
}


export function showCompanylogo(res) {
  return {
    companylogo: res.logourl,
    type: ActionTypes.COMPANY_LOGO,
  }
}
//this is without-token version of getting grouplist for Chat widget
export function getcompanylogo(appid, appsecret, companyid) {

  return (dispatch) => {
    fetch(`${baseURL}/api/getcompanylogo/`, {
      method: 'post',
      body: JSON.stringify({
        appid: appid,
        appsecret: appsecret,
        clientid: companyid,


      })
      ,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),

    }).then((res) => res.json()).then((res) => res).then(res => dispatch(showCompanylogo(res)));
  };

}


/******* chat bot actions*****/
export function chatbotChatAdd(message) {
  printlogs('log', message);
  return {
    message: message,
    type: ActionTypes.BOT_RESPONSE,
  }
}

export function chatbotsession(sessionid) {

  return {
    chatbotsessionid: sessionid,
    type: ActionTypes.BOT_SESSION,
  }
}
export function chatbotResponse(res, username) {
  printlogs('log', res);
  var newresp;
  if (res.result.parameters && res.result.parameters.username) {
    newresp = res.result.speech.replace('chatbotuser', username);
  }
  else {
    newresp = res.result.speech
  }
  var message = {
    lang: 'en',
    sessionId: res.sessionId,
    from: 'Kitt',
    msg: newresp,
    timestamp: res.timestamp,


  }
  return {
    message: message,
    type: ActionTypes.BOT_RESPONSE,
  }
}


export function testingPractice(data) {
  return data;
}
export function sendchatToBot(message, username = '') {
  return (dispatch) => {
    fetch('https://api.api.ai/v1/query', {
      method: 'post',
      headers: new Headers({
        'Authorization': ' Bearer 7f81f5b6921f4749a0ec86c23407a4fe',
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


    }).then((res) => res.json()).then((res) => res).then(res => dispatch(chatbotResponse(res, username)));
  };


}


export function assignToAgentFB(session, usertoken, agentemail, assignmentType) {
  return (dispatch) => {
    fetch(`${baseURL}/api/assignToAgentFB`, {
      method: 'post',
      body: JSON.stringify({
        companyid: session.companyid,
        pageid: session.pageid,
        user_id: session.userid,
        agentAssignment: session,
        type: session.type,
        agentemail: agentemail,
        assignmentType: assignmentType,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then(res => dispatch(assignToAgentResponse(session)));
  };
}

export function resolvefbsessionResponse(fbsessionSelected, fbsession, fbchat) {

  var fbsessionSelected = fbsession.filter((c) => c.status != 'resolved')[0]
  var newfbChat = []
  if (fbsessionSelected) {

    var temp = fbchat.filter((c) => c.senderid == fbsessionSelected.user_id.user_id || c.recipientid == fbsessionSelected.user_id.user_id);
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].message) {
        newfbChat.push(
          {
            message: temp[i].message.text,
            inbound: true,
            backColor: '#3d83fa',
            textColor: "white",
            avatar: 'https://ca.slack-edge.com/T039DMJ6N-U0S6AEV5W-gd92f62a7969-512',
            duration: 0,
            timestamp: temp[i].timestamp,
            senderid: temp[i].senderid,
            recipientid: temp[i].recipientid,
            mid: temp[i].message.mid,
            attachments: temp[i].message.attachments,
            seen: false,
            urlmeta: temp[i].urlmeta,
          })
      }
    }
  }
  return {

    fbsessionSelected: fbsessionSelected,
    fbchatSelected: newfbChat,
    type: ActionTypes.FILTER_RESOLVED_SESSION_FB,
  }
}

//mark session resolve
export function resolvesessionfb(data, usertoken, fbsessionSelected, fbsession, fbchat) {
  printlogs('log', 'resolvesessionfb');
  printlogs('log', data);

  return (dispatch) => {
    fetch(`${baseURL}/api/resolvechatsessionfb`, {
      method: 'post',
      body: JSON.stringify({
        companyid: data.companyid,
        pageid: data.pageid,
        user_id: data.userid,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': usertoken,

      }),
    }).then((res) => res.json()).then(res => dispatch(resolvefbsessionResponse(fbsessionSelected, fbsession, fbchat)));
  };

}


export function metaurlReceived(meta) {
  return {

    urlMeta: meta,
    loadingurl: false,
    type: ActionTypes.GET_META_URL,
  }
}
export function loadingurlmeta(url) {
  return {

    urlLoading: url,
    loadingurl: true,
    type: ActionTypes.LOADING_META_URL,
  }
}
export function fetchurlmeta(url) {

  return (dispatch) => {
    dispatch(loadingurlmeta(url));
    fetch(`${baseURL}/api/fetchurlmeta`, {
      method: 'post',
      body: JSON.stringify({
        url: url,

      }),
      headers: new Headers({
        'Content-Type': 'application/json',


      }),
    }).then((res) => res.json()).then(res => {
      dispatch(metaurlReceived(res.url_meta));
    });
  };

}

export function updatechatsessionstatus(customerchat, customerchat_selected, userdetails, message) { // state being updated
  // update the status of session
  for (var i = 0; i < customerchat.length; i++) {
    if (customerchat[i].request_id == message[0].request_id) {
      customerchat[i].status = "assigned";
      customerchat[i].agent_ids.push({'id': userdetails._id, type: 'agent'});
      break;
    }
  }

  if (customerchat_selected.request_id == message[0].request_id) {
    customerchat_selected.status = "assigned";
    customerchat_selected.agent_ids.push({'id': userdetails._id, type: 'agent'});
  }

  return {

    customerchat: customerchat,
    customerchat_selected: customerchat_selected,
    type: ActionTypes.UPDATE_CHATSESSION_STATUS,
  }

}

export function update_userchats_list(message,oldchatlist){
  var new_array= [...oldchatlist,message];
  console.log('update-userchats-list');
  console.log(oldchatlist);

  return {

    userchats: new_array ,
    type: ActionTypes.UPDATE_USERCHATS_LIST,
  }
}
