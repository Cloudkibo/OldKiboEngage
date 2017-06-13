import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
var handleDate = function(d){
  if(d && d!= ''){
    var c = new Date(d);
    return c.toDateString() + ' ' +c.getHours() + ':' + c.getMinutes();
  }

}
function ResolvedSessionListItem(props) {
var ag = []
var ch=[]
//console.log(props.agent);

  {
         props.subgroups &&
                        props.subgroups.map((cha, i) => (
                           ch.push(cha)
                        ))

      }
 var gname =[]
     {
         props.groups &&
                        props.groups.map((cha, i) => (
                           gname.push(cha)
                        ))

      }
/*var agentname = []
{
   props.agent &&
                        props.agent.map((cha, i) => (
                           agentname.push(cha)
                        ))

}*/
  return (

      <tr className = "odd">

      <td>{props.session.customerid.name?props.session.customerid.name : props.session.customerid.customerID} </td>
      <td>{props.session.customerid.email?props.session.customerid.email : "N/A"}</td>

      <td>{gname[0].deptname}</td>
      {
        ch[0] &&
      <td>{ch[0].msg_channel_name}</td>
      }
      {

       props.agent  ?
        <td>{props.agent}</td> :
       <td>-</td>


   }

      <td>{props.session.status}</td>
      <td>{handleDate(props.session.requesttime)}</td>

      <td>
      {
        props.viewoption &&

         <Link to={`/chatsessionview/${props.session.request_id}`} className="uk-button uk-button-primary" >
         View Details
        </Link>

      }
      {
        // only web sessions can be rescheduled
      props.session.platform == "web" &&
      <Link to={`/rescheduleresolvedsession/${props.session.request_id}/${props.session.customerid.name}/${props.session.customerid.email}`} className="uk-button uk-button-primary" >
        Reschedule
      </Link>
      }
      </td>
    </tr>




  );
}



export default ResolvedSessionListItem;
