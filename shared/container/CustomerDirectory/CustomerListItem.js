import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactTooltip from 'react-tooltip';


function CustomerListItem(props) {

  var isChecked = props.isChecked;

  return (

    <tr className = "odd">
      <td>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {
            isChecked = !isChecked;
            props.selectCheckedItem(props.customer);
            CustomerListItem.forceUpdate();
          }}
        />
      </td>
      <td>{props.customer.name && props.customer.name != ""?props.customer.name:props.customer.customerID} </td>
      <td>{props.customer.email ? props.customer.email :"N/A" }</td>
      <td>{props.customer.country?props.customer.country : "N/A"}</td>
      <td>{props.customer.phone?props.customer.phone : "N/A"}</td>
       <td>
       <ReactTooltip />
       {
        props.customer.email && props.customer.email != "" &&
        <Link to={`/sendemail/${props.customer._id}`} >
        <img data-tip="Email" src="/img/email.png" style={{maxWidth: 25, maxHeight:25}} />
        </Link>
        }
      </td>

    </tr>

  );
}


export default CustomerListItem;
