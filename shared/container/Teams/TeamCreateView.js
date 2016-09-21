/***** Renamed as Teams **********/


import React, { Component, PropTypes } from 'react';

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
                  <b> Note:
                   Please, add at least one agent to the team to make it operational. Click on the team name in the list to add agents.
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

export default TeamCreateView;