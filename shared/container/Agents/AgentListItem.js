import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}
function AgentListItem(props) {

  
  return (
  
    <tr className = "odd">
      <td>{props.agent.firstname +' '+ props.agent.lastname} </td>
      <td>{props.agent.email}</td>
      <td>{handleDate(props.agent.date)}</td>
      <td>{props.agent.role}</td>
     
      <td>
        <Link to={`/agent/${props.agent._id}`} className="btn blue-madison" >
         Change Role
        </Link>
        <button className="btn blue-madison"> Delete </button>

      </td>

    
    </tr>
    
  );
}



export default AgentListItem;