import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
var handleDate = function (d) {
  if (d && d != '') {
    var c = new Date(d);
    return c.toDateString() + ' ' + c.getHours() + ':' + c.getMinutes();
  }

}
function SessionListItem(props) {
  var ch = []

  {
    props.subgroups &&
    props.subgroups.map((cha, i) => (
      ch.push(cha)
    ))

  }
  var gname = []
  {
    props.groups &&
    props.groups.map((cha, i) => (
      gname.push(cha)
    ))

  }

  var isChecked = props.isChecked;

  return (
    props.session.customerid &&
    <tr className="odd">
      <td>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {
            isChecked = !isChecked;
            props.selectCheckedItem(props.session.customerid);
            SessionListItem.forceUpdate();
          }}
        />
      </td>
      <td>{props.session.customerid && props.session.customerid.name ? props.session.customerid.name : props.session.customerid.customerID} </td>
      <td>{props.session.customerid && props.session.customerid.email ? props.session.customerid.email : "N/A"}</td>
      <td>{gname.length > 0 ? gname[0].deptname : '-'}</td>
      {
        ch && ch.length > 0 ?
          <td>{ch[0].msg_channel_name}</td> :
          <td> - </td>
      }
      {

        props.agent ?
          <td>{props.agent}</td> :
          <td>-</td>


      }
      {
        props.session.platform == "mobile" ? <td>Mobile</td> : <td>Web</td>
      }
      <td>{handleDate(props.session.requesttime)}</td>
      <td>{props.session.status}</td>

      {
        props.viewoption &&
        <td>
          <Link to={`/chatsessionview/${props.session.request_id}`} className="uk-button uk-button-small uk-button-primary">
            View Details
          </Link>
        </td>
      }
    </tr>



  );
}


export default SessionListItem;
