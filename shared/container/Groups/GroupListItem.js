import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}
class GroupListItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      role: '',
      isChecked: this.props.isChecked,
    }
  }

  render() {
    return (
    <tr className = "odd">
      <td>
        <center>
        <input
          type="checkbox"
          checked={this.state.isChecked}
          onChange={() => {
            this.setState({ isChecked: !this.state.isChecked });
            this.props.selectCheckedItem(this.props.group._id);
          }}
        />
        </center>
      </td>
      <td>{this.props.group.deptname}</td>
      <td>{this.props.group.deptdescription}</td>
      <td>{this.props.group.createdby.firstname}</td>
      <td>{handleDate(this.props.group.creationdate)}</td>

      <td>
        <Link to={`/group/${this.props.group._id}`} style={{margin: 2}} className="uk-button uk-button-primary uk-button-small" >
         View
        </Link>
         {
        (this.props.userdetails.isAdmin == "Yes" || this.props.userdetails.isSupervisor == "Yes") ?
        <span>
        <Link to={`/editgroup/${this.props.group._id}`} style={{margin: 2}} className="uk-button uk-button-primary uk-button-small" >
         Edit
        </Link>
        <button className="uk-button uk-button-primary uk-button-small" style={{margin: 2}} onClick={this.props.onDelete}> Delete </button>
        </span> : <span></span>

        }
      </td>


    </tr>

  );
  }
}

GroupListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,

};


export default GroupListItem;
