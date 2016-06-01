import React, { Component, PropTypes } from 'react';
import { Form, ValidatedInput } from 'react-bootstrap-validation';

class InviteAgent extends Component {
  constructor(props, context) {
    super(props, context);
    this.inviteAgent = this.inviteAgent.bind(this);
    this.cancelInvite = this.cancelInvite.bind(this);
  }

cancelInvite()
{
  this.props.cancelInvite();
}
  inviteAgent() {
   /*const nameRef = this.refs.name;
   const descRef = this.refs.desc;
    if (nameRef.value && descRef.value) {
     
      nameRef.value = descRef.value = '';
    }*/

    alert('invite agent is called');
     this.props.inviteAgent();
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
      <Form>
      <div className="form">
        <div className="form-body">
          <div className="form-group">
                  You can also invite the agent by sharing the following link with them.
                  <b>https://kiboengage.cloudapp.net/joincompany</b>
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
                            
                    <ValidatedInput type='text' label = "Email Address" name='email' validate='required,isEmail'
                    
                    errorHelp={{
                        required: 'Please enter agent\'s email',
                        isEmail: 'Email is invalid'
                    }}
                   />
                    </div>
          </div>
                
          <div className="form-actions">
              <button className="btn blue"  onClick={this.inviteAgent}> Submit </button> 
              <button className="btn default"  onClick={this.cancelInvite}> Cancel </button> 
         </div>
        </div>
      </div>
      </Form>
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