import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}
function GroupListItem(props) {

  
  return (
  
    <tr className = "odd">
      <td>{props.group.groupname}</td>
      <td>{props.group.groupdescription}</td>
      <td>{props.group.createdby.firstname}</td>
      <td>{handleDate(props.group.creationdate)}</td>
       <td>{props.group.status}</td>
     
      <td>
        <Link to={`/group/${props.group._id}`} className="btn blue-madison" >
         View
        </Link>
         {
        props.userdetails.isAdmin == "Yes" ?
        <span>
        <Link to={`/editgroup/${props.group._id}`} className="btn blue-madison" >
         Edit
        </Link>
        <button className="btn blue-madison" onClick={props.onDelete}> Delete </button>
        </span> : <span></span>

        }
      </td>

    
    </tr>
    
  );
}

GroupListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,
 
};


export default GroupListItem;