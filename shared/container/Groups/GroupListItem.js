import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

function GroupListItem(props) {
  return (
  
    <tr className = "odd">
      <td>{props.group.deptname}</td>
      <td>{props.group.deptdescription}</td>
      <td>{props.group.deptname}</td>
      <td>{props.group.deptname}</td>
      <td>{props.group.deptname}</td>
      <td>
                    <a className="btn blue-madison" href='/viewgroup/{props.group.department._id}'> View</a>
                    <a className="btn blue-madison" href='/managegroup/{props.group.department._id}'> Edit </a>
                    <a className="btn blue-madison" href="#"> Delete </a>
      </td>

    
    </tr>
    
  );
}



export default GroupListItem;