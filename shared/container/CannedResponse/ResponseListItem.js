import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactTooltip from 'react-tooltip';

function ResponseListItem(props) {

     
  return (
   
    <tr className = "odd">
      <td>{props.response.shortcode} </td>
      <td>{props.response.message}</td>
      { props.userdetails.isAgent == "Yes"?
                    <br/> :
                    <td>
                     <ReactTooltip />
                      <Link data-tip="Edit" to={`/editresponse/${props.response._id}`} >
                      <img src="/img/edit.svg" style={{maxWidth: 25, maxHeight: 25 }} /> 
                      </Link>
                      <img data-tip="Delete" src="/img/trash.png" style={{maxWidth: 25, maxHeight: 25 }} onClick={props.onDelete}/> 
                    </td>
    
                
                    
                    
                 }
      
    </tr>
    
  );
}

ResponseListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,
 
};

export default ResponseListItem;