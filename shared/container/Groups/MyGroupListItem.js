import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}
function MyGroupListItem(props) {

  
  return (
  
    <tr className = "odd">
      <td>{props.group.deptname}</td>
      <td>{props.group.deptdescription}</td>
      <td>{handleDate(props.group.creationdate)}</td>
     
      <td>
        <Link to={`/group/${props.group._id}/'profile'`} className="btn blue-madison"  >
         View
        </Link>
       
      </td>

    
    </tr>
    
  );
}




export default MyGroupListItem;