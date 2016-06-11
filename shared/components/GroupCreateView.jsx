import React, { Component, PropTypes } from 'react';

class GroupCreateView extends Component {
  constructor(props, context) {
    super(props, context);
    this.addGroup = this.addGroup.bind(this);
  }

  addGroup() {
    const nameRef = this.refs.name;
   const descRef = this.refs.desc;
    if (nameRef.value && descRef.value) {
      this.props.addGroup(nameRef.value,descRef.value);
      nameRef.value = descRef.value = '';
    }
  }

  render() {
    const cls = `form ${(this.props.showAddGroup ? 'appear' : 'hide')}`;

    return (
      <div className={cls}>
      <div className="portlet box blue" style={{width: 80 + '%'}}>
          <div className="portlet-title">
            <div className="caption">
              <i className="fa fa-group"/>
               Create a group
            </div>
          </div>     
      <div className="portlet-body ">
      <div className="form">
        <div className="form-body">
          <div className="form-group">
                 <label> Group Name</label>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa fa-chevron-right"/>
                    </span>  
                    <input className="form-control" placeholder="Enter group title"  ref="name" required = "required"/>
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
                   Please, add at least one agent to the group to make it operational. Click on the group name in the list to add agents.
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

export default GroupCreateView;