import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';


function FBCustomerListItem(props) {

  return (
    <tr className = "odd">
      <td>{props.customer.first_name + " " + props.customer.last_name}</td>
      <td>{props.customer.email ? props.customer.email : "N/A" }</td>
    </tr>
  );
}

export default FBCustomerListItem;
