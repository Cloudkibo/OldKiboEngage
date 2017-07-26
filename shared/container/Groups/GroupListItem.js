import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}
function GroupListItem(props) {

  var isChecked = props.isChecked;

  return (

    <tr className = "odd">
      <td>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {
            isChecked = !isChecked;
            props.selectCheckedItem(props.group);
            GroupListItem.forceUpdate();
          }}
        />
      </td>
      <td>{props.group.deptname}</td>
      <td>{props.group.deptdescription}</td>
      <td>{props.group.createdby.firstname}</td>
      <td>{handleDate(props.group.creationdate)}</td>

      <td>
        <Link to={`/group/${props.group._id}`} style={{margin: 2}} className="uk-button uk-button-primary uk-button-small" >
         View
        </Link>
         {
        (props.userdetails.isAdmin == "Yes" || props.userdetails.isSupervisor == "Yes") ?
        <span>
        <Link to={`/editgroup/${props.group._id}`} style={{margin: 2}} className="uk-button uk-button-primary uk-button-small" >
         Edit
        </Link>
        <button className="uk-button uk-button-primary uk-button-small" style={{margin: 2}} onClick={props.onDelete}> Delete </button>
        </span> : <span></span>

        }
      </td>


    </tr>

  );
}

GroupListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,

};


export default GroupListItem;
