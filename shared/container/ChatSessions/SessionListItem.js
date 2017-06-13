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
  /*var agentname = []
   {
   if(props.agent.agent_ids && props.agent.agent_ids.length > 0){
   var agents = props.agent.filter((c) => c._id == props.session.agent_ids[props.session.agent_ids.length-1].id);
   agents &&
   agents.map((cha, i) => (
   agentname.push(cha)
   ))
   }

   }*/
  return (

    <tr className="odd">

      <td>{props.session.customerid.name ? props.session.customerid.name : props.session.customerid.customerID} </td>
      <td>{props.session.customerid.email ? props.session.customerid.email : "N/A"}</td>
      <td>{gname.length > 0 ? gname[0].deptname : '-'}</td>
      {
        ch && ch.length > 0 ?
          <td>{ch[0].msg_channel_name}</td> :
          <td> - </td>
      }
      {

        props.agent && props.agent.length > 0 ?
          <td>{props.agent[0].firstname + ' ' + props.agent[0].lastname}</td> :
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
          <Link to={`/chatsessionview/${props.session.request_id}`} className="uk-button uk-button-primary">
            View Details
          </Link>
        </td>
      }
    </tr>



  );
}


export default SessionListItem;
