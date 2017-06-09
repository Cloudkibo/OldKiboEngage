import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}
function TeamListItem(props) {
var useringroup = false
for(var i=0;i<props.teamagents.length;i++){
  if(props.teamagents[i].agentid._id == props.userdetails._id && props.teamagents[i].groupid._id == props.team._id){
    useringroup = true

    break
  }
}

  return (

    <tr className = "odd">
      <td>{props.team.groupname}</td>
      <td>{props.team.groupdescription}</td>
      <td>{props.team.createdby.firstname}</td>
      <td>{handleDate(props.team.creationdate)}</td>
       <td>{props.team.status}</td>

      <td>
      {
        props.userdetails._id == props.team.createdby._id?
        <span>
        <Link to={`/team/${props.team.get_id}`} className="btn blue-madison" >
         View
        </Link>

        <Link to={`/editteam/${props.team._id}`} className="btn blue-madison" >
         Edit
        </Link>
        <button className="btn blue-madison" onClick={props.onDelete}> Delete </button>
        </span> :
         <span>
         {
          props.team.status == "public" && useringroup == false?
          <button className="btn blue-madison" onClick={props.onJoin}> Join Team </button>

        :
        <span></span>


         }

          {
          props.userdetails._id != props.team.createdby._id && useringroup == true?
          <Link to={`/team/${props.team._id}`} className="btn blue-madison" >
         View
        </Link>
        :
        <span></span>


         }
         </span>

        }
      </td>


    </tr>

  );
}

TeamListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,

};


export default TeamListItem;
