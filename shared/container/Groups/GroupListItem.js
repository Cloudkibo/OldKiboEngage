import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';


function GroupListItem(props) {

  
  return (
  
    <tr className = "odd">
      <td>{props.group.deptname}</td>
      <td>{props.group.deptdescription}</td>
      <td>{props.group.createdby.firstname}</td>
      <td>{props.group.creationdate}</td>
     
      <td>
        <Link to={`/group/${props.group._id}`} className="btn blue-madison" >
         View
        </Link>
        <Link to={`/editgroup/${props.group._id}`} className="btn blue-madison" >
         Edit
        </Link>
        <button className="btn blue-madison" onClick={props.onDelete}> Delete </button>

      </td>

    
    </tr>
    
  );
}

GroupListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,
 
};


export default GroupListItem;