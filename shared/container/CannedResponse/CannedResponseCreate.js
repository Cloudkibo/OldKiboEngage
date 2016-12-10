import React, { Component, PropTypes } from 'react';
import auth from '../../services/auth';
import { connect } from 'react-redux';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import { Link } from 'react-router';



class CannedResponseCreate extends Component {
  constructor(props, context) {
    console.log('constructor is called');
    super(props, context);

     //this.createcannedResponse = this.createcannedResponse.bind(this);
      this.addResponse = this.addResponse.bind(this);
  }



  addResponse(e) {
     e.preventDefault();
   // const usertoken = auth.getToken();
    const shortcode = this.refs.shortcode;
    const msg = this.refs.msg;

    if (shortcode.value && msg.value)
     {
       this.props.addResponse("/" + shortcode.value,msg.value);
       shortcode.value = msg.value = '';
       //this.props.createResponse(response,usertoken);

    }
  }

  render() {
    const cls = `form ${(this.props.showCR ? 'appear' : 'hide')}`;

    return (
      <div className={cls}>

            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-group"/>
                   Create Canned Response
                </div>
              </div>

           <div className="portlet-body form">
            <form className="form-horizontal form-row-seperated">
              <div className="form-body">
                <div className="form-group">
                  <label className="control-label col-md-3"> Short Code </label>
                   <div className="col-md-9">
                  <div className="input-group">
                    <span className="input-group-addon">
                    /
                    </span>

                         <input className="form-control input-medium" type='text'  ref = "shortcode" placeholder ="Short Code e.g Hey!"/>
                   </div>
                   </div>
                </div>

                 <div className="form-group">
                  <label className="control-label col-md-3"> Response text</label>
                   <div className="col-md-9">
                         <textarea className="form-control" type='text' rows='4' ref="msg" placeholder="Hi,how can we help you?"/>
                   </div>
                </div>
              <div className="form-actions fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="col-md-offset-9 col-md-9">
                    <button className="btn green"  onClick={this.addResponse}>
                      <i className="fa fa-pencil"/>
                       Submit
                    </button>

                    </div>
               </div>
                <div className="col-md-9">
                  <div className="col-md-9">
                    <Link to="/cannedresponses" className="btn green">
                      <i className="fa fa-times"/>
                       Back
                    </Link>

                    </div>
               </div>
               </div>
              </div>
              </div>

          </form>
          </div>
          </div>
          </div>


      )
     }
}

CannedResponseCreate.propTypes = {
  addResponse : PropTypes.func.isRequired,
  showCR      : PropTypes.bool.isRequired,
};


export default CannedResponseCreate;
