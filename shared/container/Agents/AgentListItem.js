import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactTooltip from 'react-tooltip';
import SweetAlert from 'sweetalert-react';
var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}
function AgentListItem(props) {

  var role;
  if(props.agent.isAgent == "Yes"){
    role = "agent";
  }
  else if(props.agent.isAdmin == "Yes"){
      role = "admin"
  }
  else
  {
    role = "supervisor"
  }

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
      <td>{props.agent.firstname +' '+ props.agent.lastname} </td>
      <td>{props.agent.email}</td>
      <td>{handleDate(props.agent.date)}</td>
      <td>{role}</td>

      <td>
      <ReactTooltip />
      <Link data-tip="Edit Role" to={`/editagent/${props.agent._id}`} style={{padding:25}}>
        <img src="/img/edit.svg" style={{maxWidth:25, maxHeight:25}} />
      </Link>

      <img onClick={props.onDelete}  data-tip="Delete Agent" src="/img/trash.png" style={{maxWidth:25, maxHeight:25}} />

      </td>


    </tr>

  );
}

AgentListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,

};

export default AgentListItem;
