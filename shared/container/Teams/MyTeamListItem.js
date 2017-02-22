import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}
function MyTeamListItem(props) {

  
  return (
  
    <tr className = "odd">
      <td>{props.team.deptname}</td>
      <td>{props.team.deptdescription}</td>
      <td>{handleDate(props.team.creationdate)}</td>
     
      <td>
        <Link to={`/team/${props.team._id}/'profile'`} className="btn blue-madison"  >
         View
        </Link>
       
      </td>

    
    </tr>
    
  );
}




export default MyTeamListItem;