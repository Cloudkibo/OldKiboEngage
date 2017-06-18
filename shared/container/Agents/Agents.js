import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import AgentListItem from './AgentListItem';
import InviteAgent from './InviteAgent';
import {inviteagent,getAgents} from '../../redux/actions/actions'
import {deleteagent} from '../../redux/actions/actions'
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import ReactPaginate from 'react-paginate';

class Agents extends Component {

 constructor(props, context) {
      //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    //console.log('constructor is called');
    super(props, context);
    this.state = {
      showInviteAgent :  false,
      agentsData: [],
      totalLength: 0,
    };

    this.handleClick = this.handleClick.bind(this);
    this.cancelInvite = this.cancelInvite.bind(this);
    this.add = this.add.bind(this);
    props.getAgents(usertoken);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.displayData = this.displayData.bind(this);
    this.deleteAgent = this.deleteAgent.bind(this);

  }

  add(email) {
     const usertoken = auth.getToken();
    this.props.inviteagent( email,usertoken);
     this.setState({
      showInviteAgent: false,
    });
 }
   handleClick(e) {

      this.setState({
      showInviteAgent: !this.state.showInviteAgent,
      });
      e.preventDefault();
  }

  displayData(n){
    let offset = n*6;
    //console.log("Offset: " + offset);
    let sessionData = [];
    let limit;
    let index = 0;
    if ((offset + 6) > this.props.agents.length){
      limit = this.props.agents.length;
    }
    else {
      limit = offset + 6;
    }
    for (var i=offset; i<limit; i++){
      sessionData[index] = this.props.agents[i];
      index++;
    }
    this.setState({agentsData: sessionData});
  }

  handlePageClick(data){
    //console.log(data.selected);
    this.displayData(data.selected);
  }

  deleteAgent(agent,token){
    this.props.deleteagent(agent, token);
    let index;
    for(var i=0; i<this.state.agentsData.length; i++){
      if(this.state.agentsData[i]._id === agent._id){
        index = i;
      }
    }
    this.state.agentsData.splice(index,1);
    this.forceUpdate();
  }

  componentDidMount(){
    this.displayData(0);
    this.setState({ totalLength: this.props.agents.length });
  }

  cancelInvite(e){

      this.setState({
      showInviteAgent: false,
      });
      e.preventDefault();
  }


  render() {
    //console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    //console.log(token)
    //console.log(this.props.agents);
    return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>

       <div className="page-container hbox space-between">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">

            <div className=" uk-card uk-card-default uk-card-body">
             <h3 className="uk-card-title">Agents</h3>

           <div>
             <div className="table-toolbar">
                 <div className="btn-team">
                    <button id="sample_editable_1_new" className="btn green" onClick={this.handleClick}> Invite Agent
                    <i className="fa fa-plus"/>
                    </button>
                 </div>
              </div>
               {this.props.errorMessage &&

                     <div className = "alert alert-success"><span>{this.props.errorMessage}</span></div>
                      }

               {this.props.inviteurl &&
                      <div>

                        <p> Here is URL sent to the Invitee </p>
                        <p>{this.props.inviteurl} </p>

                      </div>
                }
               <InviteAgent inviteAgent={this.add}  cancelInvite = {this.cancelInvite} showInviteAgent= {this.state.showInviteAgent} companyid = {this.props.userdetails.uniqueid} website = {this.props.userdetails.website}/>
               <br />
                { this.props.agents && this.props.agents.length > 0 ?
                  <div className="table-responsive">
                   <table id ="sample_3" className="table table-striped table-bordered table-hover dataTable">
                   <thead>
                    <tr>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Name </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Email </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Joined</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Role</th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' > Options</th>
                    </tr>
                    </thead>

                    <tbody>
                      {
                        this.state.agentsData.map((agent, i) => (

                          <AgentListItem agent={agent} key={agent._id}  onDelete={() => this.deleteAgent(agent,token)}/>

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
                    <p>Currently, there is no agent to show.</p>
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

Agents.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  //console.log("mapStateToProps is called");
  //console.log(state.dashboard.userdetails);
  //console.log(state.dashboard.agents);
  //console.log(state.dashboard.errorMessage);

  return {
          agents:(state.dashboard.agents),
          userdetails:(state.dashboard.userdetails),
          errorMessage:(state.dashboard.errorMessage),
          agent :(state.dashboard.agent),
          deptagents:(state.dashboard.deptagents),
          channels :(state.dashboard.channels),
          teamdetails:(state.dashboard.teamdetails),
          customerchat :(state.dashboard.customerchat),
          customerchatold :(state.dashboard.customerchatold),
          chatlist :(state.dashboard.chatlist),
          channels :(state.dashboard.channels),
          customers:(state.dashboard.customers),
          customerchat_selected :(state.dashboard.customerchat_selected),
          new_message_arrived_rid :(state.dashboard.new_message_arrived_rid),
          userchats :(state.dashboard.userchats),
          responses :(state.dashboard.responses),
          onlineAgents:(state.dashboard.onlineAgents),
          inviteurl:(state.dashboard.inviteurl),

           };
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({ deleteagent:deleteagent,inviteagent:inviteagent,getAgents:getAgents}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Agents);
