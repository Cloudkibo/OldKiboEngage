import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

function FbPageItem(props) {

  var isChecked = props.isChecked;

  return (

    <tr className = "odd">
      <td>
      <center>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {
            isChecked = !isChecked;
            props.selectCheckedItem(props.agent);
            AgentListItem.forceUpdate();
          }}
        />
      </center>
      </td>
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
