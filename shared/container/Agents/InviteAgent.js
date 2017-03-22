import React, { Component, PropTypes } from 'react';
//import { Form, ValidatedInput } from 'react-bootstrap-validation';

class InviteAgent extends Component {
  constructor(props, context) {
    super(props, context);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelInvite = this.cancelInvite.bind(this);
  }

cancelInvite()
{
  this.props.cancelInvite();
}

  onSubmit() {
   const email = this.refs.emailinp;
  // alert(email.value)
  /*if(email.value.split('@')[1].split('.')[0] !== this.props.website)
  {
      alert('Email address must be of company domain');
  }*/

  if (email.value != '') {
       this.props.inviteAgent(email.value);
       email.value = '';
    }
  else{
    alert('Please enter an email address');
  }



    }


  render() {
    const cls = `form ${(this.props.showInviteAgent ? 'appear' : 'hide')}`;

    return (
      <div className={cls}>
      <div className="portlet box blue" style={{width: 80 + '%'}}>
          <div className="portlet-title">
            <div className="caption">
              <i className="fa fa-user"/>
                Invite an Agent
            </div>
          </div>
      <div className="portlet-body ">
      <div className="form">
        <div className="form-body">
          <div className="form-group">
                  You can also invite the agent by sharing the following link with them.
                  <b>https://kiboengage.kibosupport.com/joincompany</b>
                  <br/>
                  They will have to register with us to join your company.DON'T FORGET to give them your company's unique
                  <br/>
                  <b>{this.props.companyid}</b>
                  <br/>
                  <br/>
                  Or invite them using email
          </div>
          <div className="form-group">

                  <div className="input-group">
                    <label>Email Address</label>
                    <input type='text' name='email'ref ="emailinp"

                   />
                    </div>
          </div>

          <div className="form-actions">
              <button className="btn blue"  type ="submit" onClick={this.onSubmit}> Submit </button>
              <button className="btn default"  onClick={this.cancelInvite}> Cancel </button>
         </div>
        </div>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

InviteAgent.propTypes = {
  inviteAgent: PropTypes.func.isRequired,
  showInviteAgent: PropTypes.bool.isRequired,
};

export default InviteAgent;
