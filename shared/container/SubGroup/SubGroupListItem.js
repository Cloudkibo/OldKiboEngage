import React, { PropTypes, Component } from 'react';
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
class SubgroupListItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      role: '',
      isChecked: this.props.isChecked,
    }
  }

  render() {
  return (

    <tr className="odd">
      <td>
        <center>
        <input
          type="checkbox"
          checked={this.state.isChecked}
          onChange={() => {
            this.setState({ isChecked: !this.state.isChecked });
            this.props.selectCheckedItem(this.props.subgroup._id);
          }}
        />
        </center>
      </td>
      <td>{this.props.subgroup.msg_channel_name} </td>
      <td>{this.props.subgroup.msg_channel_description}</td>
      <td>{getDeptName(this.props.group)}</td>
      <td>{this.props.subgroup.activeStatus}</td>
      <td>{handleDate(this.props.subgroup.creationdate)}</td>


      { this.props.userdetails.isAgent == "Yes" || this.props.subgroup.msg_channel_name == "General" ?
        <br/> :
        <td>
          <ReactTooltip />
          <Link to={`/editsubgroup/${this.props.subgroup._id}`}>
            <img data-tip="Edit" src="/img/edit.svg" style={{maxWidth: 25, maxHeight: 25}}/>
          </Link>

          <img data-tip="Delete" src="/img/trash.png" style={{maxWidth: 25, maxHeight: 25}} onClick={this.props.onDelete}/>
        </td>
      }


    </tr>

  );
}
}

/*SubgroupListItem.propTypes = {
 onDelete: PropTypes.func.isRequired,

 };*/

export default SubgroupListItem;
