import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactTooltip from 'react-tooltip';
import SweetAlert from 'sweetalert-react';
var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}

class AgentListItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      role: '',
      isChecked: this.props.isChecked,
    }
  }

  componentDidMount() {
    if (this.props.agent.isAgent == 'Yes'){
      this.setState({
        role: 'agent',
      });
    } else if(this.props.agent.isAdmin == 'Yes'){
      this.setState({
        role: 'admin',
      });
    } else {
      this.setState({
        role: 'supervisor',
      });
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
                this.props.selectCheckedItem(this.props.agent._id);
              }}
            />
          </center>
        </td>
        <td>{this.props.agent.firstname +' '+ this.props.agent.lastname} </td>
        <td>{this.props.agent.email}</td>
        <td>{handleDate(this.props.agent.date)}</td>
        <td>{this.state.role}</td>
        <td>
          <ReactTooltip />
          <Link data-tip="Edit Role" to={`/editagent/${this.props.agent._id}`} style={{padding:25}}>
            <img src="/img/edit.svg" style={{maxWidth:25, maxHeight:25}} />
          </Link>
          <img onClick={this.props.onDelete} data-tip="Delete Agent" src="/img/trash.png" style={{maxWidth:25, maxHeight:25}} />
        </td>
      </tr>
    );
  }
}

AgentListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,

};

export default AgentListItem;
