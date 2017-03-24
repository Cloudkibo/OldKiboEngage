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
         alert(res.message);
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

    }).then((res) => res.json()).then((res) => res).then((res) => dispatch(createteamError(res)));
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



/****** Reducer states *****/
