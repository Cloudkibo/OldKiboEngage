import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';


function CustomerListItem(props) {


  return (

    <tr className = "odd">
      <td>{props.customer.name && props.customer.name != ""?props.customer.name:props.customer.customerID} </td>
      <td>{props.customer.email ? props.customer.email :"N/A" }</td>
      <td>{props.customer.country?props.customer.country : "N/A"}</td>
      <td>{props.customer.phone?props.customer.phone : "N/A"}</td>
       <td>
       {
        props.customer.email && props.customer.email != "" &&
        <Link to={`/sendemail/${props.customer._id}`} className="btn blue-madison" >
        Send Email
        </Link>
        }
      </td>

    </tr>

  );
}


export default CustomerListItem;
