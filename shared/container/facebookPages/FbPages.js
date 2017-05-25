import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import FbPageItem from './FbPageItem';
import {getfbpages} from '../../redux/actions/actions';
import {deletefbpage} from '../../redux/actions/actions';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

class FbPages extends Component {

 constructor(props, context) {
      //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    console.log('constructor is called');
    if(usertoken != null)
    {

        console.log(usertoken);
        props.getfbpages(usertoken)
      }
    super(props, context);
   




  }
 


  render() {
    console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    console.log(token)
 
    return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>

       <div className="page-container hbox space-between">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">
              <h3 className ="page-title">Facebook Pages Management </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/>
                  </li>
                  <li>
                               <Link to="/fbpages">Facebook Pages Management</Link>
                  </li>

            </ul>
            <div className="portlet box grey-cascade">
              <div className="portlet-title">
                <div className="caption">
                    <i className="fa fa-user"/>
                   Facebook Pages
                </div>
              </div>

           <div className="portlet-body">
             <div className="table-toolbar">
                 <div className="btn-team">
                   { this.props.userdetails.isAgent == "Yes"?
                    <br/> :
                      <Link id="sample_editable_1_new" className="btn green" to='/fbpagescreate'> Add Facebook Page
                      <i className="fa fa-plus"/>
                      </Link>



                 }

                 </div>
              </div>
              

                {this.props.errorMessage &&

                   <div className = "alert alert-success"><span>{this.props.errorMessage}</span></div>
                    }    

                { this.props.responses &&
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Page Title </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Page Description</th>
                      { this.props.userdetails.isAgent == "Yes"?<br/> :
                         <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' > Options</th>


                     }

                    </tr>
                    </thead>

                    <tbody>
                      {
                        this.props.fbpages &&
                        this.props.fbpages.map((fbpage, i) => (

                          <FbPageItem page={fbpage} key={fbpage._id}  onDelete={() => this.props.deletefbpage(fbpage,token)} userdetails={this.props.userdetails}/>

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

FbPages.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  return {
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          teamdetails :(state.dashboard.teamdetails),
          errorMessage:(state.dashboard.errorMessage),
          responses :(state.dashboard.responses),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          fbpages:(state.dashboard.fbpages),

           };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getfbpages:getfbpages,deletefbpage:deletefbpage}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(FbPages);
