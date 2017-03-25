import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
var handleDate = function(d){
  if(d && d!= ''){
    var c = new Date(d);
    return c.toDateString() + ' ' +c.getHours() + ':' + c.getMinutes();
  }

  

}
function InviteAgentListItem(props) {

  return (
   
    
      <tr className = "odd">
    
      <td>{props.invitee.email} </td>
      <td>https://kiboengage.kibosupport.com/joincompany/{props.invitee.token}</td>
      
      <td>{handleDate(props.invitee.createdAt)}</td>
     
     
      </tr>

    

     
    
  );
}



export default InviteAgentListItem;