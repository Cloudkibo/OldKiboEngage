import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}
function TeamListItem(props) {

  
  return (
  
    <tr className = "odd">
      <td>{props.team.deptname}</td>
      <td>{props.team.deptdescription}</td>
      <td>{props.team.createdby.firstname}</td>
      <td>{handleDate(props.team.creationdate)}</td>
     
      <td>
        <Link to={`/team/${props.team._id}`} className="btn blue-madison" >
         View
        </Link>
         {
        props.userdetails.isAdmin == "Yes" ?
        <span>
        <Link to={`/editteam/${props.team._id}`} className="btn blue-madison" >
         Edit
        </Link>
        <button className="btn blue-madison" onClick={props.onDelete}> Delete </button>
        </span> : <span></span>

        }
      </td>

    
    </tr>
    
  );
}

TeamListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,
 
};


export default TeamListItem;