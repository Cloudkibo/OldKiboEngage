import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import SubgroupListItem from './SubGroupListItem';
import {getsubgroups, deletesubgroups} from '../../redux/actions/actions'
import {deletesubgroup, getcustomers} from '../../redux/actions/actions'
import ReactPaginate from 'react-paginate';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router'

class SubGroups extends Component {

  constructor(props, context) {
    //call action to get user teams
    if (props.userdetails.accountVerified == "No") {
      browserHistory.push('/notverified');
    }
    const usertoken = auth.getToken();
    //console.log('constructor is called');
    if (usertoken != null) {

      // alert('subgroups');
      //console.log(usertoken);
      props.getsubgroups(usertoken);
      props.getcustomers(usertoken);
    }
    super(props, context);
    this.state = {
      subgroupsData: [],
      totalLength: 0,
      selectedPage: 0,
      isChecked: false,
      isCheckedAll: false,
      deleteSubgroupsData: [],
    };

    this.handlePageClick = this.handlePageClick.bind(this);
    this.displayData = this.displayData.bind(this);
    this.deleteSubGroup = this.deleteSubGroup.bind(this);
    this.selectCheckedItem = this.selectCheckedItem.bind(this);
    this.toggleCheckAll = this.toggleCheckAll.bind(this);
    this.deleteSubgroups = this.deleteSubgroups.bind(this);
  }

  displayData(n) {
    let offset = n * 6;
    //console.log("Offset: " + offset);
    let sessionData = [];
    let limit;
    let index = 0;
    if ((offset + 6) > this.props.subgroups.length) {
      limit = this.props.subgroups.length;
    }
    else {
      limit = offset + 6;
    }
    for (var i = offset; i < limit; i++) {
      sessionData[index] = this.props.subgroups[i];
      index++;
    }
    this.setState({subgroupsData: sessionData});
  }

  handlePageClick(data) {
    this.setState({selectedPage: data.selected});
    this.displayData(data.selected);
  }

  selectCheckedItem(subgroupid) {
    console.log('select checked item is called');
    if (this.state.deleteSubgroupsData.indexOf(subgroupid) == -1) {
      this.state.deleteSubgroupsData.push(subgroupid);
    } else {
      const index = this.state.deleteSubgroupsData.indexOf(subgroupid);
      this.state.deleteSubgroupsData.splice(index, 1);
    }
    console.log(this.state.deleteSubgroupsData);
    this.forceUpdate();
  }

  toggleCheckAll() {
    this.setState({
      isCheckedAll: !this.state.isCheckedAll,
      isChecked: !this.state.isChecked,
    });
  }

  deleteSubGroup(subgroup, token, customers) {

    this.props.deletesubgroup(subgroup, token, customers);
    let index;
    for (var i = 0; i < this.state.subgroupsData.length; i++) {
      if (this.state.subgroupsData[i]._id === subgroup._id) {
        index = i;
      }
    }
    this.state.subgroupsData.splice(index, 1);
    this.forceUpdate();
  }

  deleteSubgroups() {
    const token = auth.getToken();
    for(var i=0; i<this.state.deleteSubgroupsData.length; i++){
      let index = this.state.subgroupsData.indexOf(this.state.deleteSubgroupsData[i]);
      this.state.subgroupsData.splice(index, 1);
    }
    this.props.deletesubgroups(this.state.deleteSubgroupsData, token);
  }

  componentDidMount() {
    this.displayData(0);
    this.setState({totalLength: this.props.subgroups.length});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.subgroups.length == this.props.subgroups.length - 1) {
      console.log('componentDidUpdate');
      this.displayData(this.state.selectedPage);
      this.setState({totalLength: this.props.subgroups.length});
    }
  }

  render() {
    //console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    return (
      <div className="vbox viewport">
        <AuthorizedHeader name={this.props.userdetails.firstname} user={this.props.userdetails}/>

        <div className="page-container hbox space-between">
          <SideBar isAdmin={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">

              <div className="uk-card uk-card-body uk-card-default ">
                <div className="uk-card-title">

                  SubGroups
                </div>

                <div className="portlet-body">
                  <div className="table-toolbar">
                    <div className="btn-team">
                      { this.props.userdetails.isAgent == "Yes" ?
                        <br/> :
                        <Link id="sample_editable_1_new" className="btn green" to='/createsubgroup'> Create Sub-Group
                          <i className="fa fa-plus"/>
                        </Link>



                      }
                    </div>
                  </div>

                  { this.props.subgroups && this.props.customers && this.props.subgroups.length > 0 ?
                    <div className="table-responsive">
                      <table id="sample_3" className="table table-striped table-bordered table-hover dataTable">
                        <thead>
                        <tr>
                          <th role="columnheader" rowSpan='1' colSpan='1' aria-sort='ascending' >
                            <center>
                            <input
                              type="checkbox"
                              checked={this.state.isCheckedAll}
                              onChange={this.toggleCheckAll}
                            />
                            </center>
                          </th>
                          <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'>Name</th>
                          <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'>Description</th>
                          <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'>Group</th>
                          <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'>Active</th>
                          <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'>Created On</th>
                          { this.props.userdetails.isAgent == "Yes" ? <br/> :
                            <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending'> Options</th>
                          }
                        </tr>
                        </thead>

                        <tbody>
                        {
                          this.props.groupdetails && this.state.subgroupsData.map((subgroup, i) => (

                            <SubgroupListItem subgroup={subgroup} key={subgroup._id}
                                              selectCheckedItem={this.selectCheckedItem}
                                              isChecked={this.state.isChecked}
                                              group={this.props.groupdetails.filter((group) => group._id == subgroup.groupid)}
                                              onDelete={() => this.deleteSubGroup(subgroup, token, this.props.customers.filter((c) => c.isMobileClient == "true"))}
                                              userdetails={this.props.userdetails}/>

                          ))
                        }
                        </tbody>
                      </table>
                      <button onClick={this.deleteSubgroups} className="uk-button uk-button-primary uk-button-small" style={{ marginTop: -25 }}>
                        {this.state.isCheckedAll ? 'Delete All' : 'Delete'}
                      </button>
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
                    <p>Currently, there is no subgroup to show.</p>
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

SubGroups.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  //console.log("mapStateToProps is called");
  return {
    subgroups: (state.dashboard.subgroups),
    userdetails: (state.dashboard.userdetails),
    groupdetails: (state.dashboard.groupdetails),
    errorMessage: (state.dashboard.errorMessage),
    agents: (state.dashboard.agents),
    deptagents: (state.dashboard.deptagents),
    customers: (state.dashboard.customers),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getsubgroups: getsubgroups,
    getcustomers: getcustomers,
    deletesubgroup: deletesubgroup,
    deletesubgroups: deletesubgroups,
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(SubGroups);
