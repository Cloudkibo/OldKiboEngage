import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

function FbPageItem(props) {

     
  return (
   
    <tr className = "odd">
      <td>{props.page.pageTitle} </td>
      <td>{props.page.pageDescription}</td>
      { props.userdetails.isAgent == "Yes"?
                    <br/> :
                    <td>
                      <Link to={`/editfbpage/${props.page.pageid}`} className="btn blue-madison" >
                      Edit
                      </Link>
                      <button className="btn blue-madison" onClick={props.onDelete}> Delete </button>

                    </td>
    
                
                    
                    
                 }
      
    </tr>
    
  );
}

FbPageItem.propTypes = {
  onDelete: PropTypes.func.isRequired,
 
};

export default FbPageItem;