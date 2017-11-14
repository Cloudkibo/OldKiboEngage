import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactTooltip from 'react-tooltip';

var handleDate = function(d){
var c = new Date(d);
return c.toDateString();
}

class TeamListItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      role: '',
      isChecked: this.props.isChecked,
      useringroup: false,
    }
  }

  componentDidMount() {
    for(var i=0;i<this.props.teamagents.length;i++){
      if(this.props.teamagents[i].agentid._id == props.userdetails._id && props.teamagents[i].groupid._id == props.team._id){
        this.state.useringroup = true
        break
      }
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
            this.props.selectCheckedItem(this.props.team._id);
          }}
        />
        </center>
      </td>
      <td>{this.props.team.groupname}</td>
      <td>{this.props.team.groupdescription}</td>
      <td>{this.props.team.createdby.firstname}</td>
      <td>{handleDate(this.props.team.creationdate)}</td>
       <td>{this.props.team.status}</td>

      <td>
      <ReactTooltip />
      {
        this.props.userdetails._id == this.props.team.createdby._id?
        <span>
        <Link data-tip="View Team"  to={`/team/${this.props.team._id}`} style={{padding: 5}}>
         <img src="/img/view.svg" style={{maxWidth: 25, maxHeight: 25}} />
        </Link>

        <Link data-tip="Edit Team" to={`/editteam/${this.props.team._id}`} style={{padding: 5}} >
        <img src="/img/edit.svg" style={{maxWidth: 25, maxHeight: 25}} />

        </Link>

        <img data-tip="Delete Team" src="/img/trash.png" style={{maxWidth: 25, maxHeight: 25}} onClick={this.props.onDelete} />
        </span> :
         <span>
         {
          this.props.team.status == "public" && this.state.useringroup == false?
          <button className="btn blue-madison" onClick={this.props.onJoin}> Join Team </button>

        :
        <span></span>


         }

          {
          this.props.userdetails._id != this.props.team.createdby._id && this.state.useringroup == true?
          <Link to={`/team/${this.props.team._id}`} className="btn blue-madison" >
         View
        </Link>
        :
        <span></span>


         }
         </span>

        }
      </td>


    </tr>

  );
}
}

TeamListItem.propTypes = {
  onDelete: PropTypes.func.isRequired,

};


export default TeamListItem;
