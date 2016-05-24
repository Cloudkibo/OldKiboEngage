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
        <Link to={`/group/${props.group._id}`} onClick={props.onClick} className="btn blue-madison" >
         View
        </Link>

        <a className="btn blue-madison" href='/managegroup/{props.group.department._id}'> Edit </a>
        <a className="btn blue-madison" href="#"> Delete </a>
      </td>

    
    </tr>
    
  );
}

GroupListItem.propTypes = {
  onClick: PropTypes.func.isRequired
 
};


export default GroupListItem;