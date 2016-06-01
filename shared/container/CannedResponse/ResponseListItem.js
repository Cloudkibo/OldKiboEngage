import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

function ResponseListItem(props) {

     
  return (
   
    <tr className = "odd">
      <td>{props.response.shortcode} </td>
      <td>{props.response.message}</td>
      <td>
        <Link to={`/editresponse/${props.response._id}`} className="btn blue-madison" >
        Edit
        </Link>
        <button className="btn blue-madison" onClick={props.onDelete}> Delete </button>

      </td>
    
    </tr>
    
  );
}

ResponseListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,
 
};

export default ResponseListItem;