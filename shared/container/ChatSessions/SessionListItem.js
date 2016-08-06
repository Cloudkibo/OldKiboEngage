import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

function SessionListItem(props) {
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
      <td>{ch[0].msg_channel_name}</td>
      <td>{agentname[0].firstname +' '+ agentname[0].lastname}</td>
      <td>{props.session.status}</td>
      
    </tr> :

     <tr className = "odd">
    
      <td>{props.customername} </td>
      <td>{props.email}</td>
      <td>{gname[0].deptname}</td>
      <td>{ch[0].msg_channel_name}</td>
      <td>{agentname[0].firstname +' '+ agentname[0].lastname}</td>
      <td>{props.session.status}</td>
      
    </tr> 

    

     
    
  );
}



export default SessionListItem;