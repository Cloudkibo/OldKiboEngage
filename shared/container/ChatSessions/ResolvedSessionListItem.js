import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

function ResolvedSessionListItem(props) {
var ag = []
var ch=[]
     {
         props.customers &&
                        props.customers.map((grp, i) => (
                           ag.push(grp)                            
                        ))

      }  
  
  {
         props.channels &&
                        props.channels.map((cha, i) => (
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
   
    props.customers && ag ?
      <tr className = "odd">
    
      <td>{ag[0].name} </td>
      <td>{ag[0].email}</td>
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
      {
        props.viewoption &&
        <td>
         <Link to={`/chatsessionview/${props.session.request_id}`} className="btn blue-madison" >
         View Details
        </Link>
        </td>
      }

      <Link to={`/rescheduleresolvedsession/${props.session.request_id}/${ag[0].name}/${ag[0].email}`} className="btn blue-madison" >
        Reschedule
      </Link>
    </tr> :

     <tr className = "odd">
    
      <td>{props.customername} </td>
      <td>{props.email}</td>
      <td>{gname[0].deptname}</td>
      {
        ch[0] &&
         <td>{ch[0].msg_channel_name}</td>
     
      }
      {
        props.agent && agentname[0] &&
         <td>{agentname[0].firstname +' '+ agentname[0].lastname}</td>
      }
      <td>{props.session.status}</td>

       <td>
      <Link to={`/rescheduleresolvedsession/${props.session.request_id}/${props.customername}/${props.email}`} className="btn blue-madison" >
        Reschedule
      </Link>
    

       </td>
      
    </tr> 

    

     
    
  );
}



export default ResolvedSessionListItem;