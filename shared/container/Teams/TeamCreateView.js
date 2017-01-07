/***** Renamed as Teams **********/


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class TeamCreateView extends Component {
  constructor(props, context) {
    super(props, context);
    this.addTeam = this.addTeam.bind(this);
  }

  addTeam() {
    const nameRef = this.refs.name;
   const descRef = this.refs.desc;
    if (nameRef.value && descRef.value) {
      this.props.addTeam(nameRef.value,descRef.value);
      nameRef.value = descRef.value = '';
    }
  }

  appendAgent(id,e){
   // alert(id);
    var flag = 0;
    for(var j = 0;j<this.props.newagents.length;j++)
    {
      if(this.props.newagents[j]._id == id)
      {
          flag = 1;
          break;
      }
    }
    if(flag == 0)
    {
        this.props.newagents.push({"_id" :id});
    }
    else{
      alert('Agent Already added in the team');
    }
     e.preventDefault();
     this.forceUpdate();
  }

  render() {
    const cls = `form ${(this.props.showAddTeam ? 'appear' : 'hide')}`;

    return (
      <div className={cls}>
      <div className="portlet box blue" style={{width: 80 + '%'}}>
          <div className="portlet-title">
            <div className="caption">
              <i className="fa fa-group"/>
               Create a Team
            </div>
          </div>
      <div className="portlet-body ">
      <div className="form">
        <div className="form-body">
          <div className="form-group">
                 <label> Team Name</label>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa fa-chevron-right"/>
                    </span>
                    <input className="form-control" placeholder="Enter team title"  ref="name" required = "required"/>
                  </div>
          </div>
          <div className="form-group">
                 <label> Description</label>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa fa-chevron-right"/>
                    </span>
                    <textarea placeholder="Enter short description" className="form-control" ref="desc" rows='4' required></textarea>
                    </div>
          </div>

          <div className="form-group">
           <label className="control-label col-md-3"> Fellow Agents </label>
            <div className="col-md-9">
            <div className="select2-container select2-container-multi">
            <ul className="select2-choices">

            {
             this.props.newagents &&
                   this.props.newagents.map((agent, i)=> (
                   this.props.agents.filter((ag) => ag._id == agent._id).map((ag,j) =>
                   (
                   <li key ={i}>{ag.firstname + ' ' + ag.lastname}</li>
                   ))


            ))


            }
            </ul>
            </div>
            </div>
         </div>


         <div className="form-group">
           <label className="control-label col-md-3"> All Agents </label>
            <div className="col-md-9">
            <div className="select2-container select2-container-multi">
            <ul className="select2-choices">
            {
             this.props.agents &&
                  this.props.agents.map((agent, i) =>
                 (
                   <li  key ={i} className="select2-search-choice">
                     <div  onClick = {this.appendAgent.bind(this,agent._id)}>{agent.firstname + ' ' + agent.lastname} </div></li>
                 ))
           }


            </ul>
            </div>
            </div>
         </div>

          <div className="form-group">
                  <b> Note:
                   Please, add at least one agent to the team to make it operational. Click on the name in the list to add agents.
                  </b>
          </div>
          <div className="form-actions">
              <button className="btn blue"  onClick={this.addTeam}> Submit </button>
         </div>
        </div>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

TeamCreateView.propTypes = {
  addTeam: PropTypes.func.isRequired,
  showAddTeam: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  console.log('mapStateToProps of TeamDetailView is called');
  console.log(state.dashboard.team);
  return {

    team: (state.dashboard.team),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    errorMessage:(state.dashboard.errorMessage),
    newagents:state.dashboard.newagents,
    channels :(state.dashboard.channels),
    customers : (state.dashboard.customers),
  };
}

export default connect(mapStateToProps)(TeamCreateView);
