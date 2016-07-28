import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import ResponseListItem from './ResponseListItem';
import {getresponses} from '../../redux/actions/actions'
import {deleteresponse} from '../../redux/actions/actions'
import {createResponse}  from '../../redux/actions/actions'
import CannedResponseCreate from './CannedResponseCreate'
import { bindActionCreators } from 'redux';

class CannedResponses extends Component {

 constructor(props, context) {
      //call action to get user groups 
    const usertoken = auth.getToken();
    console.log('constructor is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
        props.getresponses(usertoken)
      }
    super(props, context);
    this.state = {
      showCR: false,
    };
     this.handleClick = this.handleClick.bind(this);
     this.add = this.add.bind(this);
  

  

    
  }
 handleClick(e) {

      this.setState({
      showCR: !this.state.showCR,
      });
      e.preventDefault();
  }

  add(shortcode,message) {
     const usertoken = auth.getToken();
     var companyid = this.props.userdetails.uniqueid;

      
     this.props.createResponse({shortcode,message,companyid,usertoken});
     this.setState({
      showCR: false,
    });
 }

 

  render() {
    console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    console.log(token)
    console.log(this.props.responses);
    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} />
    
       <div className="page-container">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Canned Response Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/cannedresponses">Canned Response Management</Link>
                  </li>               
  
            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                   Canned Response
                </div> 
              </div>    
        
           <div className="portlet-body">
             <div className="table-toolbar">
                 <div className="btn-group">
                   { this.props.userdetails.isAgent == "Yes"?
                    <br/> :
                     <button id="sample_editable_1_new" className="btn green" onClick={this.handleClick}> Add Canned Response
                    <i className="fa fa-plus"/>
                    </button>
                
                    
                    
                 }

                 </div>
              </div>
               {this.props.errorMessage &&

                     <div className = "alert alert-danger"><span>{this.props.errorMessage}</span></div>
                      }
              <CannedResponseCreate addResponse={this.add}  showCR= {this.state.showCR}/>      
                { this.props.responses &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Short Code </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Response</th>
                      { this.props.userdetails.isAgent == "Yes"?<br/> :
                         <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' > Options</th>
           

                     }
                   
                    </tr>
                    </thead>

                    <tbody>                    
                      {
                        this.props.responses &&
                        this.props.responses.map((response, i) => (
                          
                          <ResponseListItem response={response} key={response._id}  onDelete={() => this.props.deleteresponse(response,token)} userdetails={this.props.userdetails}/>
                                                      
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

CannedResponses.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  return {
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          responses :(state.dashboard.responses),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          
           };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getresponses:getresponses,deleteresponse:deleteresponse,createResponse:createResponse}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(CannedResponses);



