import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import FbPageItem from './FbPageItem';
import {getfbpages,getfbTeams} from '../../redux/actions/actions';
import {deletefbpage, deletefbpages} from '../../redux/actions/actions';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import ReactPaginate from 'react-paginate';

class FbPages extends Component {

 constructor(props, context) {
      //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    //console.log('constructor is called');
    if(usertoken != null)
    {

        //console.log(usertoken);
        props.getfbpages(usertoken);
        props.getfbTeams(usertoken);

      }
    super(props, context);
    this.state = {
      pagesData: [],
      totalLength: 0,
      selectedPage: 0,
      isChecked: false,
      isCheckedAll: false,
      deleteFbpagesData: [],
    };
    this.handlePageClick = this.handlePageClick.bind(this);
    this.displayData = this.displayData.bind(this);
    this.deleteFBPage = this.deleteFBPage.bind(this);
    this.selectCheckedItem = this.selectCheckedItem.bind(this);
    this.toggleCheckAll = this.toggleCheckAll.bind(this);
    this.deleteFbpages = this.deleteFbpages.bind(this);
  }

  componentDidMount(){
    this.displayData(0);
    this.setState({totalLength: this.props.fbpages.length});
  }

  selectCheckedItem(pageid) {
    console.log('select checked item is called');
    if (this.state.deleteFbpagesData.indexOf(pageid) == -1) {
      this.state.deleteFbpagesData.push(pageid);
    } else {
      const index = this.state.deleteFbpagesData.indexOf(pageid);
      this.state.deleteFbpagesData.splice(index, 1);
    }
    console.log(this.state.deleteFbpagesData);
    this.forceUpdate();
  }

  toggleCheckAll() {
    this.setState({
      isCheckedAll: !this.state.isCheckedAll,
      isChecked: !this.state.isChecked,
    });
  }

  displayData(n){
    let offset = n*6;
    //console.log("Offset: " + offset);
    let sessionData = [];
    let limit;
    let index = 0;
    if ((offset + 6) > this.props.fbpages.length){
      limit = this.props.fbpages.length;
    }
    else {
      limit = offset + 6;
    }
    for (var i=offset; i<limit; i++){
      sessionData[index] = this.props.fbpages[i];
      index++;
    }
    this.setState({pagesData: sessionData});
  }

  deleteFBPage(page, token){
    this.props.deletefbpage(page, token);
    let index;
    for(var i=0; i<this.state.pagesData.length; i++){
      if(this.state.pagesData[i]._id === page._id){
        index = i;
      }
    }
    this.state.pagesData.splice(index,1);
    this.forceUpdate();
  }

  deleteFbpages() {
    const token = auth.getToken();
    for(var i=0; i<this.state.deleteFbpagesData.length; i++){
      let index = this.state.pagesData.indexOf(this.state.deleteFbpagesData[i]);
      this.state.pagesData.splice(index, 1);
    }
    this.props.deletefbpages(this.state.deleteFbpagesData, token);
  }

  handlePageClick(data){
    this.setState({selectedPage: data.selected});
    this.displayData(data.selected);
  }

  componentDidUpdate(prevProps){
    if(prevProps.fbpages.length == this.props.fbpages.length -1){
      console.log('componentDidUpdate');
      this.displayData(this.state.selectedPage);
      this.setState({ totalLength: this.props.fbpages.length });
    }
  }

  render() {
    //console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    //console.log(token)

    return (
      <div className="vbox viewport">
       <AuthorizedHeader name = {this.props.userdetails.firstname} user={this.props.userdetails}/>

       <div className="page-container hbox space-between">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/>
          <div className="page-content-wrapper">
            <div className="page-content">

            <div className="uk-card uk-card-default uk-card-body">
              <div className="uk-card-title">

                   Facebook Pages
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

                { this.props.fbpages && this.props.responses && this.props.fbpages.length > 0 ?
                  <div>
                   <table id ="sample_3" className="uk-table uk-table-striped table-bordered uk-table-hover dataTable">
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
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Page Title </th>
                    <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' >Page Description</th>
                      { this.props.userdetails.isAgent == "Yes"?<br/> :
                         <th role="columnheader" rowspan='1' colspan='1' aria-sort='ascending' > Options</th>


                     }

                    </tr>
                    </thead>

                    <tbody>
                      {
                        this.state.pagesData.map((fbpage, i) => (

                          <FbPageItem selectCheckedItem={this.selectCheckedItem} isChecked={this.state.isChecked} page={fbpage} key={fbpage._id}  onDelete={() => this.deleteFBPage(fbpage,token)} userdetails={this.props.userdetails}/>

                        ))
                      }
                     </tbody>
                    </table>
                    <button onClick={this.deleteFbpages} className="uk-button uk-button-primary uk-button-small" style={{ marginTop: -25 }}>
                      {this.state.isCheckedAll ? 'Delete All' : 'Delete'}
                    </button>
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
                    <p>Currently, there is no Facebook Page to show.</p>
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
  //console.log("mapStateToProps is called");
  return {
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          teamdetails :(state.dashboard.teamdetails),
          errorMessage:(state.dashboard.errorMessage),
          responses :(state.dashboard.responses),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
          fbpages:(state.dashboard.fbpages),
          newfbteams:(state.dashboard.newfbteams),
          fbteams:(state.dashboard.fbteams),
           };

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getfbpages:getfbpages,deletefbpage:deletefbpage, deletefbpages: deletefbpages, getfbTeams:getfbTeams}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(FbPages);
