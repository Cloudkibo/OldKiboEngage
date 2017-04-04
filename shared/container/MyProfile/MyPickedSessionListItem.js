import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

function MyPickedSessionListItem(props) {
var ch=[]
     {
         props.customers &&
                        props.customers.map((grp, i) => (
                           ag.push(grp)                            
                        ))

      }  
    

  
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
  return (
   
    <tr className = "odd">
      <td>{props.session.customerid.name?props.session.customerid.name:props.session.customerid.customerID} </td>
      <td>{props.session.customerid.email}</td>
      <td>{gname[0].deptname}</td>
      <td>{ch[0].msg_channel_name}</td>
      <td>{props.session.status}</td>
      
    </tr>
    
  );
}



export default MyPickedSessionListItem;