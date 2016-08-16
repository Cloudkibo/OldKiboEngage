import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import {getchannelwisestats,getplatformwisestats} from '../../redux/actions/actions'
var ReactDOM = require('react-dom');
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'
var Highcharts = require('highcharts')

class HighCharts extends Component {

 constructor(props, context) {
      //call action to get user groups 
  if(props.userdetails.accountVerified == "No"){
    browserHistory.push('/notverified');
   }
    const usertoken = auth.getToken();
    console.log('constructor is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
        props.getplatformwisestats(usertoken);
    }
    super(props, context);
     
    // this.state = {pieData: [{name: "Firefox",y: 6},{name: "MSIE",y: 4},{name: "Safari",y: 4},{name: "Opera",y: 1},{name: "Chrome",y: 7}]}

    this.state = {categories:[], chartSeries : [{"name": "Number of calls", "data": [], type: "column"}],currentDate :new Date()};

    
    
  }

 componentWillReceiveProps(props) {
   

     if(props.channelwisestats){
      var pageStatsData = props.channelwisestats;
      var CallStats = this.refs.CallStats.value;

      if(CallStats == 'This Year'){

        var tempArray =[];
        for(var i in pageStatsData){
          var gotDate = new Date(pageStatsData[i]._id.year,pageStatsData[i]._id.month-1,pageStatsData[i]._id.day, 0,0,0,0);
          
          if((new Date(new Date().setDate(new Date().getDate()-365))) <= (gotDate)){

            var tempCurrentPage = pageStatsData[i]._id.platform;
            var tempCount = pageStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray){
              tempArray.push({currentpage : tempCurrentPage,
                count: tempCount});
            }

          }
        }

        for(var i in tempArray){

          this.state.chartSeries[0].data.push(tempArray[i].count);
          this.state.categories.push(tempArray[i].currentpage);

        }
        alert( this.state.chartSeries[0].data.length);
        this.refs.targetDate.value = new Date(new Date().setDate(new Date().getDate()-365));
      }

      console.log(this.state.chartSeries[0])

    }
  }

 componentDidMount(){




 }
 refreshData1(e){
      this.refs.CallStats.value = e.target.dataset.attrib;
      this.state.chartSeries[0].data = [];
      this.state.categories = [];
      var pageStatsData = this.props.channelwisestats;
      
    
      if(this.refs.CallStats.value  == 'Today'){

        alert(this.refs.CallStats.value)
        var tempArray= [];
        var currentDate1 = new Date(); // added by saba
        for(var i in pageStatsData){
          var gotDate = new Date(pageStatsData[i]._id.year, pageStatsData[i]._id.month-1,
            pageStatsData[i]._id.day, 0,0,0,0);
          var currentDate = new Date(new Date().getFullYear(), new Date().getMonth(),
            new Date().getDate(), 0,0,0,0);
          if((currentDate.getTime()) == (gotDate.getTime())){

            var tempCurrentPage = pageStatsData[i]._id.currentpage;
            var tempCount = pageStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray){
              tempArray.push({currentpage : tempCurrentPage,
                count: tempCount});
            }

          }
        }

        for(var i in tempArray){

          this.state.chartSeries[0].data.push(tempArray[i].count);
          //$scope.chartConfig.series[0].data.push(tempArray[i].count);
          this.state.categories.push(tempArray[i].currentpage);

        }
        currentDate1 = this.state.currentDate; // added by saba
        this.refs.targetDate.value = this.state.currentDate.getTime();
      }

      if(this.refs.CallStats.value == 'Last 7 days'){
        alert(this.refs.CallStats.value)
        
        var tempArray = [];
        for(var i in pageStatsData){
          var gotDate = new Date(pageStatsData[i]._id.year,pageStatsData[i]._id.month-1,
           pageStatsData[i]._id.day, 0,0,0,0);
          if((new Date(new Date().setDate(new Date().getDate()-7))) <= (gotDate)){

            var tempCurrentPage =pageStatsData[i]._id.currentpage;
            var tempCount = pageStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray){
              tempArray.push({currentpage : tempCurrentPage,
                count: tempCount});
            }

          }
        }
        for(var i in tempArray){

          this.state.chartSeries[0].data.push(tempArray[i].count);
          //$scope.chartConfig.series[0].data.push(tempArray[i].count);
          this.state.categories.push(tempArray[i].currentpage);

        }
       this.refs.targetDate.value = (new Date(new Date().setDate(new Date().getDate()-7)));
      }

      if(this.refs.CallStats.value == 'Last 30 days'){
        alert(this.refs.CallStats.value)
        
        var tempArray = [];
        for(i in pageStatsData){
          var gotDate = new Date(pageStatsData[i]._id.year, pageStatsData[i]._id.month-1,
            pageStatsData[i]._id.day, 0,0,0,0);
          if((new Date(new Date().setDate(new Date().getDate()-30))) <= (gotDate)){

            var tempCurrentPage =pageStatsData[i]._id.currentpage;
            var tempCount = pageStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray){
              tempArray.push({currentpage : tempCurrentPage,
                count: tempCount});
            }

          }
        }

        for(var i in tempArray){

          this.state.chartSeries[0].data.push(tempArray[i].count);
          //$scope.chartConfig.series[0].data.push(tempArray[i].count);
          this.state.categories.push(tempArray[i].currentpage);

         
        }
       this.refs.targetDate.value = new Date(new Date().setDate(new Date().getDate()-30));
      }

      if(this.refs.CallStats.value == 'This Year'){
        alert(this.refs.CallStats.value)
        
        var tempArray =[];
        for(var i in pageStatsData){
          var gotDate = new Date(pageStatsData[i]._id.year,pageStatsData[i]._id.month-1,
            pageStatsData[i]._id.day, 0,0,0,0);
          if((new Date(new Date().setDate(new Date().getDate()-365))) <= (gotDate)){

            var tempCurrentPage = pageStatsData[i]._id.currentpage;
            var tempCount = pageStatsData[i].count;

            var foundInArray = false;
            for(var i in tempArray){
              if(tempCurrentPage === tempArray[i].currentpage){
                tempArray[i].count += tempCount;
                foundInArray = true;
              }
            }

            if(!foundInArray){
              tempArray.push({currentpage : tempCurrentPage,
                count: tempCount});
            }

          }
        }

        for(var i in tempArray){

          this.state.chartSeries[0].data.push(tempArray[i].count);
          //$scope.chartConfig.series[0].data.push(tempArray[i].count);
          this.state.categories.push(tempArray[i].currentpage);

        }
       this.refs.targetDate.value = new Date(new Date().setDate(new Date().getDate()-365));
      }
      this.forceUpdate()

 }
 handleChangeDepartment(e){
     alert(e.target.value);
     const token = auth.getToken();
    
   //  this.props.getchannelwisestats(e.target.value,token);
    
     this.forceUpdate();
   
   
    }

  render() {

    console.log(this.props.userdetails.firstname)
    const token = auth.getToken()
    console.log(token)
   // console.log(this.props.channels);
    return (
      <div>
       <AuthorizedHeader name = {this.props.userdetails.firstname} />
       <div className="page-container">
         <SideBar isAdmin ={this.props.userdetails.isAdmin}/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
              <h3 className ="page-title">Reports </h3>
            <ul className="page-breadcrumb breadcrumb">
                  <li>
                    <i className="fa fa-home"/>
                    <Link to="/dashboard"> Dashboard </Link>
                    <i className="fa fa-angle-right"/> 
                  </li>                  
                  <li>
                               <Link to="/reports">Reports</Link>
                  </li>               
  
            </ul>

            <div>
              <label> Choose Department </label>
               <select  ref = "grouplist" onChange={this.handleChangeDepartment.bind(this)}   >
                          
                          {
                          this.props.groupdetails && this.props.groupdetails.map((group,i) =>
                            <option value={group._id}>{group.deptname}</option>

                            )
                         }
                         

                         
                      </select>
            </div>
            {this.props.channelwisestats && this.state.categories.length > 0 &&
           <DonutChart series = {this.state.chartSeries} categories = {this.state.categories}/>
         }
           <input type="text" ref="targetDate"/>
           <input defaultValue="This Year" ref="CallStats" type="text"/>
       
           <div class="btn-group">
            <label btn-radio="'Today'" uncheckable=""  data-attrib = "Today" onClick={this.refreshData1.bind(this)} className="btn btn-success">Today</label>
            <label btn-radio="'Last 7 days'" uncheckable=""  data-attrib = "Last 7 days"  onClick={this.refreshData1.bind(this)} className="btn btn-success">Last 7 days</label>
            <label btn-radio="'Last 30 days'" uncheckable="" data-attrib="Last 30 days"  onClick={this.refreshData1.bind(this)} className="btn btn-success">Last 30 days</label>
            <label btn-radio="'This Year'" uncheckable=""  data-attrib="This Year" onClick={this.refreshData1.bind(this)} className="btn btn-success">This Year</label>
          </div>
       </div>
       </div> 
      </div>
      </div> 
  )
  }
}

HighCharts.propTypes = {

  errorMessage: PropTypes.string,
}
function mapStateToProps(state) {
  console.log("mapStateToProps is called");
  return {
          channelwisestats :(state.dashboard.channelwisestats),
          channels:(state.dashboard.channels),
          userdetails:(state.dashboard.userdetails),
          groupdetails :(state.dashboard.groupdetails),
          errorMessage:(state.dashboard.errorMessage),
          agents:(state.dashboard.agents),
          deptagents:(state.dashboard.deptagents),
           };
}


export default connect(mapStateToProps,{getchannelwisestats,getplatformwisestats})(HighCharts);



class DonutChart extends React.Component {
  constructor(props) {
      super(props);
        this.chart = undefined;
    }
  
  componentDidMount() {
  this.chart = $(ReactDOM.findDOMNode(this.refs.chart)).highcharts({
        chart: {
                type: 'areaspline'
            },
        plotOptions: {
          series: {
            stacking: ''
          }
       },
      series: this.props.series,
      title: {
        text: 'Platform-wise calls'
      },
      credits: {
        enabled: true
      },
      loading: false,
      xAxis: {
        categories: this.props.categories
      },
      size: {
        width: '900'
      }
        
        });
  }
  
  componentWillReceiveProps(props) {
    this.chart.highcharts().series[0].setData(props.series.data);
  }
  
  render() {
      return (
        <div ref='chart'>
        </div>
      )
  }
}