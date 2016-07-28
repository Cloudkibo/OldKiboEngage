import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import ChannelListItem from './ChannelListItem';
import {getchannels} from '../../redux/actions/actions'
import {deletechannel} from '../../redux/actions/actions'

import { bindActionCreators } from 'redux';

class Channels extends Component {

 constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
    console.log('constructor is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
        props.getchannels(usertoken)
      }
    super(props, context);
  
  

    
  }

 

  render() {
    console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    console.log(token)
    console.log(this.props.channels);
    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} />
    
       <div className="page-container">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">MessageChannels Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/messagechannels">MessageChannels Management</Link>
                  </li>               
  
            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                   Message Channels
                </div> 
              </div>    
        
           <div className="portlet-body">
             <div className="table-toolbar">
                 <div className="btn-group">
                 { this.props.userdetails.isAgent == "Yes"?
                    <br/> :
                    <Link id="sample_editable_1_new" className="btn green" to='/createmessagechannel'> Create Message Channel
                    <i className="fa fa-plus"/>
                    </Link>
                
                    
                    
                 }
                 </div>
              </div>
               {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }
                { this.props.channels &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Description</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Group </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Active</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Created On</th>
                     { this.props.userdetails.isAgent == "Yes"?<br/> :
                      <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' > Options</th>
                      }
                    </tr>
                    </thead>

                    <tbody>                    
                      {
                        this.props.groupdetails && this.props.channels.map((channel, i) => (
                          
                          <ChannelListItem channel={channel} key={channel._id} group = {this.props.groupdetails.filter((group) => group._id == channel.groupid)}  onDelete={() => this.props.deletechannel(channel,token)} userdetails={this.props.userdetails}/>
                                                      
                        ))
                      }
                     </tbody> 
                    </table>
                }
        
                
            </div>
          </div>
       </div>
       </div> 
      </div>
      </div> 
  )
  }
}

Channels.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  return {
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
           };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getchannels:getchannels,deletechannel:deletechannel}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Channels);



