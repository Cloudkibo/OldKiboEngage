import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactTooltip from 'react-tooltip';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}
function TeamListItem(props) {
var useringroup = false
for(var i=0;i<props.teamagents.length;i++){
  if(!props.teamagents[i].agentid){
    alert(i);
  }
  if(props.teamagents[i].agentid._id == props.userdetails._id && props.teamagents[i].groupid._id == props.team._id){
    useringroup = true

    break
  }
}

  var isChecked = props.isChecked;

  return (

    <tr className = "odd">
      <td>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {
            isChecked = !isChecked;
            props.selectCheckedItem(props.team);
            TeamListItem.forceUpdate();
          }}
        />
      </td>
      <td>{props.team.groupname}</td>
      <td>{props.team.groupdescription}</td>
      <td>{props.team.createdby.firstname}</td>
      <td>{handleDate(props.team.creationdate)}</td>
       <td>{props.team.status}</td>

      <td>
      <ReactTooltip />
      {
        props.userdetails._id == props.team.createdby._id?
        <span>
        <Link data-tip="View Team"  to={`/team/${props.team._id}`} style={{padding: 5}}>
         <img src="/img/view.svg" style={{maxWidth: 25, maxHeight: 25}} />
        </Link>

        <Link data-tip="Edit Team" to={`/editteam/${props.team._id}`} style={{padding: 5}} >
        <img src="/img/edit.svg" style={{maxWidth: 25, maxHeight: 25}} />

        </Link>

        <img data-tip="Delete Team" src="/img/trash.png" style={{maxWidth: 25, maxHeight: 25}} onClick={props.onDelete} />
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
