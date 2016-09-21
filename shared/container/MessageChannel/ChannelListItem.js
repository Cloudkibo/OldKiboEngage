import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}

var getDeptName = function(team){
    var grp = [];
   
     team.map((gr,i) =>(
      grp.push(gr.deptname)
      ));
     return grp[0];
}
function ChannelListItem(props) {

     
  return (
   
    <tr className = "odd">
      <td>{props.channel.msg_channel_name} </td>
      <td>{props.channel.msg_channel_description}</td>
      <td>{getDeptName(props.team)}</td>
      <td>{props.channel.activeStatus}</td>
      <td>{handleDate(props.channel.creationdate)}</td>
       

        { props.userdetails.isAgent == "Yes"?
                    <br/> :
                    <td>
                    <Link to={`/editchannel/${props.channel._id}`} className="btn blue-madison" >
                    Edit
                    </Link>
                    <button className="btn blue-madison" onClick={props.onDelete}> Delete </button>
                    </td>
                
                    
                    
                 }

     
    
    </tr>
    
  );
}

ChannelListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,
 
};

export default ChannelListItem;