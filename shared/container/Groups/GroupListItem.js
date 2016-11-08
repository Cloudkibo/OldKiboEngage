import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}
function GroupListItem(props) {
var useringroup = false
for(var i=0;i<props.groupagents.length;i++){
  if(props.groupagents[i].agentid._id == props.userdetails._id && props.groupagents[i].groupid._id == props.group.get('_id')){
    useringroup = true
   
    break
  }
}
  
  return (
  
    <tr className = "odd">
      <td>{props.group.get('groupname')}</td>
      <td>{props.group.get('groupdescription')}</td>
      <td>{props.group.get('createdby').get('firstname')}</td>
      <td>{handleDate(props.group.get('creationdate'))}</td>
       <td>{props.group.get('status')}</td>
     
      <td>
      {
        props.userdetails._id == props.group.get('createdby').get('_id')?
        <span>
        <Link to={`/group/${props.group.get('_id')}`} className="btn blue-madison" >
         View
        </Link>
       
        <Link to={`/editgroup/${props.group.get('_id')}`} className="btn blue-madison" >
         Edit
        </Link>
        <button className="btn blue-madison" onClick={props.onDelete}> Delete </button>
        </span> :
         <span>
         {
          props.group.get('status') == "public" && useringroup == false?
          <button className="btn blue-madison" onClick={props.onJoin}> Join Group </button>
        
        :
        <span></span>


         }

          {
          props.userdetails._id != props.group.get('createdby').get('_id') && useringroup == true?
          <Link to={`/group/${props.group.get('_id')}`} className="btn blue-madison" >
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

GroupListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,
 
};


export default GroupListItem;