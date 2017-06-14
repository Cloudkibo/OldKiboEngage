import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import ResponseListItem from './ResponseListItem';
import {getresponses} from '../../redux/actions/actions';
import {deleteresponse} from '../../redux/actions/actions';
import {createResponse}  from '../../redux/actions/actions';
import CannedResponseCreate from './CannedResponseCreate';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router';
import ReactPaginate from 'react-paginate';

class CannedResponses extends Component {

  constructor(props, context) {
    //call action to get user teams
    if (props.userdetails.accountVerified == "No") {
      browserHistory.push('/notverified');
    }
    const usertoken = auth.getToken();
    //console.log('constructor is called');
    if (usertoken != null) {

      //console.log(usertoken);
      props.getresponses(usertoken)
    }
    super(props, context);
    this.state = {
      showCR: false,
      responsesData: [],
      totalLength: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.add = this.add.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.displayData = this.displayData.bind(this);
  }

  handleClick(e) {

    this.setState({
      showCR: !this.state.showCR,
    });
    e.preventDefault();
  }

  add(shortcode, message) {
    const usertoken = auth.getToken();
    var companyid = this.props.userdetails.uniqueid;


    this.props.createResponse({shortcode, message, companyid, usertoken});
    this.setState({
      showCR: false,
    });
  }

  componentDidMount() {
    this.displayData(0);
    this.setState({totalLength: this.props.responses.length});
  }

  displayData(n) {
    let offset = n * 6;
    //console.log("Offset: " + offset);
    let sessionData = [];
    let limit;
    if ((offset + 6) > this.props.responses.length) {
      limit = this.props.responses.length;
    }
    else {
      limit = offset + 6;
    }
    for (var i = offset; i < limit; i++) {
      sessionData[i] = this.props.responses[i];
    }
    this.setState({responsesData: sessionData});
  }

  handlePageClick(data) {
    //console.log(data.selected);
    this.displayData(data.selected);
  }

  render() {
    //console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    //console.log(token)
    //console.log(this.props.responses);
    return (
      <div className="vbox viewport">
        <AuthorizedHeader name={this.props.userdetails.firstname} user={this.props.userdetails}/>

        <div className="page-container hbox space-between">
          <SideBar isAdmin={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">

              <div className="uk-card uk-card-body uk-card-default">
                <div className="uk-card-title">
                  
                  
                    Canned Response
                  
                </div>

                <div className="portlet-body">
                  <div className="table-toolbar">
                    <div className="btn-team">
                      {
                        this.props.userdetails.isAgent == "Yes" ?
                        <br/> :
                        <Link id="sample_editable_1_new" className="btn green" to='/createcannedresponse'> Add Canned
                          Response
                          <i className="fa fa-plus"/>
                        </Link>

                      }

                    </div>
                  </div>
                  {this.props.errorMessage &&

                  <div className="alert alert-danger"><span>{this.props.errorMessage}</span></div>
                  }
                  { this.props.responses && this.props.responses.length > 0 ?
                    <div>
                      <table id="sample_3" className="uk-table uk-table-striped table-bordered uk-table-hover dataTable">
                        <thead>
                        <tr>
                          <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'>Short Code</th>
                          <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'>Response</th>
                          { this.props.userdetails.isAgent == "Yes" ? <br/> :
                            <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'> Options</th>


                          }

                        </tr>
                        </thead>

                        <tbody>
                        {
                          this.props.responses &&
                          this.state.responsesData.map((response, i) => (

                            <ResponseListItem response={response} key={response._id}
                                              onDelete={() => this.props.deleteresponse(response, token)}
                                              userdetails={this.props.userdetails}/>

                          ))
                        }
                        </tbody>
                      </table>
                      <ReactPaginate previousLabel={"previous"}
                                     nextLabel={"next"}
                                     breakLabel={<a href="">...</a>}
                                     breakClassName={"break-me"}
                                     pageCount={Math.ceil(this.state.totalLength / 6)}
                                     marginPagesDisplayed={1}
                                     pageRangeDisplayed={6}
                                     onPageChange={this.handlePageClick}
                                     containerClassName={"pagination"}
                                     subContainerClassName={"pages pagination"}
                                     activeClassName={"active"}/>
                    </div> :
                    <p> Currently, there is no canned response to show. </p>
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
  //console.log("mapStateToProps is called");
  return {
    channels: (state.dashboard.channels),
    userdetails: (state.dashboard.userdetails),
    teamdetails: (state.dashboard.teamdetails),
    errorMessage: (state.dashboard.errorMessage),
    responses: (state.dashboard.responses),
    agents: (state.dashboard.agents),
    deptagents: (state.dashboard.deptagents),

  };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getresponses: getresponses,
    deleteresponse: deleteresponse,
    createResponse: createResponse
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(CannedResponses);
