import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';


function CustomerListItem(props) {

     
  return (
   
    <tr className = "odd">
      <td>{props.customer.get('name') && props.customer.get('name') != ""?props.customer.get('name'):props.customer.get('customerID')} </td>
      <td>{props.customer.get('email')?props.customer.get('email') :"N/A" }</td>
      <td>{props.customer.get('country')?props.customer.get('country') : "N/A"}</td>
      <td>{props.customer.get('phone')?props.customer.get('phone') : "N/A"}</td>
       <td>
       {
        props.customer.get('email') && props.customer.get('email') != "" &&
        <Link to={`/sendemail/${props.customer.get('_id')}`} className="btn blue-madison" >
        Send Email
        </Link>
        }
      </td>
    
    </tr>
    
  );
}


export default CustomerListItem;