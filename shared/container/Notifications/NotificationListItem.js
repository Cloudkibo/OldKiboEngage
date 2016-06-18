import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}

var getAgentName = function(agent){
    var agentt = [];
   
     agent.map((ag,i) =>(
      agentt.push(ag.firstname)
      ));
     return agentt[0];
}
function NotificationListItem(props) {

     
  return (
   
    <tr className = "odd">
      <td>{props.notification.title} </td>
      <td>{props.notification.description}</td>
      <td>{handleDate(props.notification.datetime)}</td>
      <td>{getAgentName(props.agent)}</td>
       <td>
         <Link to={`/notification/${props.notification._id}`} className="btn blue-madison" >
         View
        </Link>
         <Link to={`/editnotification/${props.notification._id}`} className="btn blue-madison" >
        Edit
        </Link>
        <Link to={`/resendNotification/${props.notification._id}`} className="btn blue-madison" >
        Resend
        </Link>
       

      </td>
    
    </tr>
    
  );
}

NotificationListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,
 
};

export default NotificationListItem;