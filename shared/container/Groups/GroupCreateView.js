/***** Renamed as Teams **********/
/***** Renamed back as Groups **********/


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class GroupCreateView extends Component {
  constructor(props, context) {
    super(props, context);
    this.addGroup= this.addGroup.bind(this);
  }

  addGroup() {
    const nameRef = this.refs.name;
   const descRef = this.refs.desc;
   if(this.props.newagents.length <1){
    alert('Group cannot be created. Please add atleast one agent in the group.');
   }
   else{
    if (nameRef.value && descRef.value) {
      this.props.addGroup(nameRef.value,descRef.value,this.props.newagents);
      nameRef.value = descRef.value = '';
    }
  }
  }

  appendAgent(id,e){
   // alert(id);
    var flag = 0;
    console.log(this.props.newagents);
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

  removeAgent(id,e){
   //alert(id);

   for(var j = 0;j<this.props.newagents.length;j++)
   {
     if(this.props.newagents[j]._id == id)
     {
         this.props.newagents.splice(j,1);
         break;
     }
   }

 //  alert(this.props.newagents.length);
   e.preventDefault();
   this.forceUpdate();
 }

  render() {
    const cls = `form ${(this.props.showAddGroup ? 'appear' : 'hide')}`;

    return (
      <div className={cls}>
      <div className="portlet box blue" style={{width: 80 + '%'}}>
          <div className="portlet-title">
            <div className="caption">
              <i className="fa fa-group"/>
               Create a Group
            </div>
          </div>
      <div className="portlet-body ">
      <div className="form">
        <div className="form-body">
          <div className="form-group">
                 <label className="control-label col-md-3"> Group Name</label>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa fa-chevron-right"/>
                    </span>
                    <input className="form-control" placeholder="Enter team title"  ref="name" required = "required"/>
                  </div>
          </div>
          <div className="form-group">
                 <label className="control-label col-md-3"> Description</label>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa fa-chevron-right"/>
                    </span>
                    <textarea placeholder="Enter short description" className="form-control" ref="desc" rows='4' required></textarea>
                    </div>
          </div>
          <br/>
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
                   <li key ={i}>{ag.firstname + ' ' + ag.lastname}<i style={{ cursor: 'pointer'}} onClick = {this.removeAgent.bind(this,ag._id)} className="fa fa-times-circle" /></li>
                   ))


            ))


            }
            </ul>
            </div>
            </div>
         </div>
         <br/>

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
                     <div><i style={{ cursor: 'pointer'}} onClick = {this.appendAgent.bind(this,agent._id)} className="fa fa-plus-circle" />{agent.firstname + ' ' + agent.lastname} </div></li>
                 ))
           }


            </ul>
            </div>
            </div>
         </div>
         <br/>
          <div className="form-group">
                  <b> Note:
                   Please, add at least one agent to the group to make it operational. Click on the name in the list to add agents.
                  </b>
          </div>
          <div className="form-actions">
              <button className="btn blue"  onClick={this.addGroup}> Submit </button>
         </div>
        </div>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

GroupCreateView.propTypes = {
  addGroup: PropTypes.func.isRequired,
  showAddGroup: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
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

export default connect(mapStateToProps)(GroupCreateView);
