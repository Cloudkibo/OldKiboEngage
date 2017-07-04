import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import ReactTooltip from 'react-tooltip';

var handleDate = function (d) {
  var c = new Date(d);
  return c.toDateString();
}

var getDeptName = function (group) {
  var grp = [];

  group.map((gr, i) => (
    grp.push(gr.deptname)
  ));
  return grp[0];
}
function SubgroupListItem(props) {


  return (

    <tr className="odd">
      <td>{props.subgroup.msg_channel_name} </td>
      <td>{props.subgroup.msg_channel_description}</td>
      <td>{getDeptName(props.group)}</td>
      <td>{props.subgroup.activeStatus}</td>
      <td>{handleDate(props.subgroup.creationdate)}</td>


      { props.userdetails.isAgent == "Yes" || props.subgroup.msg_channel_name == "General" ?
        <br/> :
        <td>
          <ReactTooltip />
          <Link to={`/editsubgroup/${props.subgroup._id}`}>
            <img data-tip="Edit" src="/img/edit.svg" style={{maxWidth: 25, maxHeight: 25}}/>
          </Link>
         
          <img data-tip="Delete" src="/img/trash.png" style={{maxWidth: 25, maxHeight: 25}} onClick={props.onDelete}/>
        </td>
      }


    </tr>

  );
}

/*SubgroupListItem.propTypes = {
 onDelete: PropTypes.func.isRequired,

 };*/

export default SubgroupListItem;
