import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';


function AgentListItem(props) {

  
  return (
  
    <tr className = "odd">
      <td>{props.agent.firstname +' '+ props.agent.lastname} </td>
      <td>{props.agent.email}</td>
      <td>{props.agent.date}</td>
     
      <td>
        <Link to={`/group/${props.group._id}`} className="btn blue-madison" >
         Change Role
        </Link>
        <button className="btn blue-madison"> Delete </button>

      </td>

    
    </tr>
    
  );
}



export default AgentListItem;