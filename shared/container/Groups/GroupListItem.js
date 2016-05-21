import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

function GroupListItem(props) {
  return (
    <tr>
      <td>props.group.deptname</td>
      <td>props.group.deptdescription</td>
      <td>props.group.deptname</td>
       <td>props.group.deptname</td>
        <td>props.group.deptname</td>
     
    </tr>
  );
}



export default GroupListItem;