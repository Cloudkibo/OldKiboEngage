import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';


function CustomerListItem(props) {

     
  return (
   
    <tr className = "odd">
      <td>{props.customer.name} </td>
      <td>{props.customer.email}</td>
      <td>{props.customer.country}</td>
      <td>{props.customer.phone}</td>
       <td>
        <Link to={`/sendemail/${props.customer._id}`} className="btn blue-madison" >
        Send Email
        </Link>
      
      </td>
    
    </tr>
    
  );
}


export default CustomerListItem;