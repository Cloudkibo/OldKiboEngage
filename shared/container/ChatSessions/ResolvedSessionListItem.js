import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

function ResolvedSessionListItem(props) {
var ag = []
var ch=[]
  
  
  {
         props.subgroups &&
                        props.subgroups.map((cha, i) => (
                           ch.push(cha)                            
                        ))

      }
 var gname =[]
     {
         props.groups &&
                        props.groups.map((cha, i) => (
                           gname.push(cha)                            
                        ))

      }
var agentname = []
{
   props.agent &&
                        props.agent.map((cha, i) => (
                           agentname.push(cha)                            
                        ))

}
  return (
   
      <tr className = "odd">
    
      <td>{props.session.customerid.name?props.session.customerid.name : props.session.customerid.customerID} </td>
      <td>{props.session.customerid.email?props.session.customerid.email : "N/A"}</td>
    
      <td>{gname[0].deptname}</td>
      {
        ch[0] &&
      <td>{ch[0].msg_channel_name}</td>
      }
      {
        props.agent && agentname[0] ?
         <td>{agentname[0].firstname +' '+ agentname[0].lastname}</td> :
          <td>-</td>

      }
     
      <td>{props.session.status}</td>
      <td>
      {
        props.viewoption &&
        
         <Link to={`/chatsessionview/${props.session.request_id}`} className="btn blue-madison" >
         View Details
        </Link>
        
      }
      {
        // only web sessions can be rescheduled
      props.session.platform == "web" &&
      <Link to={`/rescheduleresolvedsession/${props.session.request_id}/${props.session.customerid.name}/${props.session.customerid.email}`} className="btn blue-madison" >
        Reschedule
      </Link>
      }
      </td>
    </tr> 
    

     
    
  );
}



export default ResolvedSessionListItem;