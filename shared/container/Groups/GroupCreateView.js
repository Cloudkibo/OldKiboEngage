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
   if(this.props.newteams.length <1){
    alert('Group cannot be created. Please add atleast one team in the group.');
   }
   else{
    if (nameRef.value && descRef.value) {
      this.props.addGroup(nameRef.value,descRef.value,this.props.newteams);
      nameRef.value = descRef.value = '';
    }
  }
  }

  appendTeam(id,e){
   // alert(id);
    var flag = 0;
    //console.log(this.props.newagents);
    for(var j = 0;j<this.props.newteams.length;j++)
    {
      if(this.props.newteams[j]._id == id)
      {
          flag = 1;
          break;
      }
    }
    if(flag == 0)
    {
        this.props.newteams.push({"_id" :id});
    }
    else{
      alert('Team Already added in the Group');
    }
     e.preventDefault();
     this.forceUpdate();
  }

  removeTeam(id,e){
   //alert(id);

   for(var j = 0;j<this.props.newteams.length;j++)
   {
     if(this.props.newteams[j]._id == id)
     {
         this.props.newteams.splice(j,1);
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
                    <input className="form-control" placeholder="Enter Group title"  ref="name" required = "required"/>
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
           <label className="control-label col-md-3"> Fellow Teams </label>
            <div className="col-md-9">
            <div className="select2-container select2-container-multi">
            <ul className="select2-choices">

            {
             this.props.newteams &&
                   this.props.newteams.map((team, i)=> (
                   this.props.teamdetails.filter((ag) => ag._id == team._id).map((ag,j) =>
                   (
                   <li key ={i}>{ag.groupname}<i style={{ cursor: 'pointer'}} onClick = {this.removeTeam.bind(this,ag._id)} className="fa fa-times-circle" /></li>
                   ))


            ))


            }
            </ul>
            </div>
            </div>
         </div>
         <br/>

         <div className="form-group">
           <label className="control-label col-md-3"> All Teams </label>
            <div className="col-md-9">
            <div className="select2-container select2-container-multi">
            <ul className="select2-choices">
            {
             this.props.teamdetails &&
                  this.props.teamdetails.map((team, i) =>
                 (
                   <li  key ={i} className="select2-search-choice">
                     <div><i style={{ cursor: 'pointer'}} onClick = {this.appendTeam.bind(this,team._id)} className="fa fa-plus-circle" />{team.groupname} </div></li>
                 ))
           }


            </ul>
            </div>
            </div>
         </div>
         <br/>
          <div className="form-group">
                  <b> Note:
                   Please, add at least one team to the group to make it operational. Click on the name in the list to add teams.
                  </b>
          </div>
          <div className="form-actions" style={{background: 'white'}}>
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
    teamdetails: (state.dashboard.teamdetails),
    deptagents:(state.dashboard.deptagents),
    errorMessage:(state.dashboard.errorMessage),
    newteams:state.dashboard.newteams,
    channels :(state.dashboard.channels),
    customers : (state.dashboard.customers),
  };
}

export default connect(mapStateToProps)(GroupCreateView);
