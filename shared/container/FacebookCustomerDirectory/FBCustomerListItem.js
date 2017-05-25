import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';


function FBCustomerListItem(props) {

  return (
    <tr className = "odd">
      <td>{props.customer.get('first_name') + " " + props.customer.get('last_name')}</td>
      <td>{props.customer.get('email') ? props.customer.get('email') : "N/A" }</td>
    </tr>
  );
}

export default FBCustomerListItem;
