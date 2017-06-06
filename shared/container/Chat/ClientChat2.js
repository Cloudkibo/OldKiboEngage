import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {showAllChat, getcompanylogo}  from '../../redux/actions/actions'
import ClientChatView2 from './ClientChatView2';

class ClientChat2 extends Component {

  constructor(props, context) {
    const {dispatch} = props;
    console.log('componentWillMount is called');
    props.showAllChat();
    var appid = '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59'
    var appsecret = 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx'
    props.getcompanylogo(appid, appsecret, props.params.id);
    super(props, context);


  }

  handleChange(e) {
    alert(e.target.value);
  }


  render() {

    return (
      <div>

        <div>
          <div className="widgetheader">
            <div>
              {
                this.props.companylogo && this.props.companylogo != '' &&
                <img ref="logo" src={this.props.companylogo.substr(1, this.props.companylogo.length)}
                   style={{'width': '120px', 'height': '70px'}} className="pull-left"/>
              }
              <div className="row">
                <p> powered by KiboEngage </p>
              </div>
            </div>
          </div>

          <div style={{'display': 'flex', justifyContent: 'center'}}>
            <div style={{'display': 'flex', justifyContent: 'center', 'flex': '0 0 500px'}}>
              <div className="portlet box grey-cascade">
                <div className="portlet-title">
                  <div className="caption">
                    <i className="fa fa-group"/>
                    Client Chat
                  </div>
                </div>

                <div className="portlet-body">


                  <div className="table-responsive" style={{height: '440'}}>
                    <table className="table">
                      <tbody>
                      <tr>
                        <td className="col-md-6">
                          <ClientChatView2 socket={this.props.route.socket}/>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    customerchat: (state.dashboard.customerchat),
    customerid: (state.dashboard.customerid),
    chatlist: (state.dashboard.chatlist),
    sessiondetails: (state.widget.sessiondetails),
    companylogo: (state.widget.companylogo),
  };
}

export default connect(mapStateToProps, {showAllChat, getcompanylogo})(ClientChat2);
