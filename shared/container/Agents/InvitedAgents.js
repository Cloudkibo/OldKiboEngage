import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import InviteAgentListItem from './InviteAgentListItem';
import {getinvitedagents} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import ReactPaginate from 'react-paginate';

class InvitedAgents extends Component {

 constructor(props, context) {
      //call action to get user groups
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }

    const usertoken = auth.getToken();
    //console.log('constructor is called');
    if(usertoken != null)
    {

        //console.log(usertoken);
      //  props.getsessions(usertoken);
        props.getinvitedagents(usertoken);

      }
    super(props, context);
    this.state = {
      agentsData: [],
      totalLength: 0,
    };
    this.handlePageClick = this.handlePageClick.bind(this);
    this.displayData = this.displayData.bind(this);
  }

  componentDidMount(){
    this.displayData(0);
    this.setState({totalLength: this.props.invitedagents.length});
  }

  displayData(n){
    let offset = n*6;
    //console.log("Offset: " + offset);
    let sessionData = [];
    let limit;
    if ((offset + 6) > this.props.invitedagents.length){
      limit = this.props.invitedagents.length;
    }
    else {
      limit = offset + 6;
    }
    for (var i=offset; i<limit; i++){
      sessionData[i] = this.props.invitedagents[i];
    }
    this.setState({agentsData: sessionData});
  }

  handlePageClick(data){
    //console.log(data.selected);
    this.displayData(data.selected);
  }

  render() {
    const token = auth.getToken()
    //console.log(token)
     return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>
       <div className="page-container hbox space-between">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">

            <div className="uk-card uk-card-body uk-card-default">
              <div className="uk-card-title">
                  Invited Agents
              </div>

           <div className="portlet-body">

             { this.props.invitedagents && this.props.invitedagents.length > 0 ?
               <div className="table-responsive">
                   <table id ="sample_3" className="uk-table uktable-striped table-bordered uk-table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Email</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Invitation URL</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Date</th>

                    </tr>
                    </thead>

                    <tbody>
                      {
                        this.props.invitedagents &&
                           this.state.agentsData.map((invitee, i) => (

                          <InviteAgentListItem invitee={invitee} key={invitee._id} />
                        ))
                      }



                     </tbody>
                    </table>
                    <ReactPaginate previousLabel={"previous"}
                                   nextLabel={"next"}
                                   breakLabel={<a href="">...</a>}
                                   breakClassName={"break-me"}
                                   pageCount={Math.ceil(this.state.totalLength/6)}
                                   marginPagesDisplayed={1}
                                   pageRangeDisplayed={6}
                                   onPageChange={this.handlePageClick}
                                   containerClassName={"pagination"}
                                   subContainerClassName={"pages pagination"}
                                   activeClassName={"active"} />
                    </div> :
                    <p>Currently, there is no invited agent to show.</p>
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

InvitedAgents.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  //console.log("mapStateToProps is called");
  return {
          subgroups:(state.dashboard.subgroups),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          responses :(state.dashboard.responses),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          resolvedsessions :(state.dashboard.resolvedsessions),
          customers:(state.dashboard.customers),
          invitedagents:(state.dashboard.invitedagents),
           };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getinvitedagents:getinvitedagents}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(InvitedAgents);
