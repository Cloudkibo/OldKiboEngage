import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}

var getDeptName = function(group){
    var grp = [];
   
     group.map((gr,i) =>(
      grp.push(gr.deptname)
      ));
     return grp[0];
}
function SubgroupListItem(props) {

     
  return (
   
    <tr className = "odd">
      <td>{props.subgroup.msg_channel_name} </td>
      <td>{props.subgroup.msg_channel_description}</td>
      <td>{getDeptName(props.group)}</td>
      <td>{props.subgroup.activeStatus}</td>
      <td>{handleDate(props.subgroup.creationdate)}</td>
       

        { props.userdetails.isAgent == "Yes"?
                    <br/> :
                    <td>
                    <Link to={`/editsubgroup/${props.subgroup._id}`} className="btn blue-madison" >
                    Edit
                    </Link>
                    <button className="btn blue-madison" onClick={props.onDelete}> Delete </button>
                    </td>
                
                    
                    
                 }

     
    
    </tr>
    
  );
}

/*SubgroupListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,
 
};*/

export default SubgroupListItem;