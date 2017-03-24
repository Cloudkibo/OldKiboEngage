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
  if(props.teamagents[i].agentid._id == props.userdetails._id && props.teamagents[i].groupid._id == props.team.get('_id')){
    useringroup = true
   
    break
  }
}
  
  return (
  
    <tr className = "odd">
      <td>{props.team.get('groupname')}</td>
      <td>{props.team.get('groupdescription')}</td>
      <td>{props.team.get('createdby').get('firstname')}</td>
      <td>{handleDate(props.team.get('creationdate'))}</td>
       <td>{props.team.get('status')}</td>
     
      <td>
      {
        props.userdetails._id == props.team.get('createdby').get('_id')?
        <span>
        <Link to={`/team/${props.team.get('_id')}`} className="btn blue-madison" >
         View
        </Link>
       
        <Link to={`/editteam/${props.team.get('_id')}`} className="btn blue-madison" >
         Edit
        </Link>
        <button className="btn blue-madison" onClick={props.onDelete}> Delete </button>
        </span> :
         <span>
         {
          props.team.get('status') == "public" && useringroup == false?
          <button className="btn blue-madison" onClick={props.onJoin}> Join Team </button>
        
        :
        <span></span>


         }

          {
          props.userdetails._id != props.team.get('createdby').get('_id') && useringroup == true?
          <Link to={`/team/${props.team.get('_id')}`} className="btn blue-madison" >
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