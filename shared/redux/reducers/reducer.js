import { combineReducers } from 'redux'
import * as ActionTypes from '../constants/constants';
import { push } from 'react-router-redux';
import store from '../store/configureStore'
const initialState = { signupwarnings: {},userdetails : {}};
const dashboardState = { userdetails : {},teamdetails:[]};
const widgetState ={teamdetails:[],channels:[]}
const signup = (state =initialState, action) => {
  switch (action.type) {

   case ActionTypes.ADD_WARNINGS:
          return{
            inviteDetails : state.inviteDetails,
            signupwarnings:action.signup,
          };

   case ActionTypes.JOIN_COMPANY:
      return {
        inviteDetails : action.inviteDetails,
      
        };
    default:
      return state;
  }
};

const dashboard = (state =dashboardState, action) => {
  switch (action.type) {

  case ActionTypes.ADD_SELECTED_TEAM :
      var agentid =[];
      if(state.deptagents)
      {
      state.deptagents.filter((agent) => agent.deptid == action.team._id).map((agent, i)=> (
                          state.agents.filter((ag) => ag._id == agent.agentid).map((ag,j) =>
                          (
                             agentid.push({"_id" :ag._id})
                          ))
                          ));
       };

      return {
        team: action.team,
        userdetails: state.userdetails,
        teamdetails:state.teamdetails,
        agents : state.agents,
        deptagents :state.deptagents,
        newagents:agentid,
        channels : state.channels,

        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,
         onlineAgents : state.onlineAgents,
         yoursocketid : state.yoursocketid,
         news:state.news,
         groupagents : state.groupagents,
         groupdetails :state.groupdetails,
         responses : state.responses,
             
      }; 

      case ActionTypes.ADD_SELECTED_GROUP :
      var agentid =[];
      if(state.groupagents)
      {
      state.groupagents.filter((agent) => agent.groupid == action.group._id).map((agent, i)=> (
                          state.agents.filter((ag) => ag._id == agent.agentid).map((ag,j) =>
                          (
                             agentid.push({"_id" :ag._id})
                          ))
                          ));
       };

      return {
        group: action.group,
        userdetails: state.userdetails,
        teamdetails:state.teamdetails,
        agents : state.agents,
        groupagents : state.groupagents,
        deptagents :state.deptagents,
         responses : state.responses,
        newagents:agentid,
        channels : state.channels,
        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,
         onlineAgents : state.onlineAgents,
         yoursocketid : state.yoursocketid,
         news:state.news,
         groupagents : state.groupagents,
         groupdetails :state.groupdetails,
             
      }; 


   case ActionTypes.ADD_SELECTED_AGENT :
      return {
        userdetails: state.userdetails,
        teamdetails:state.teamdetails,
        agents : state.agents,
        deptagents :state.deptagents,
        agent: state.agents.filter((agent) => agent._id == action.id),
        channels : state.channels,
        onlineAgents : state.onlineAgents,
        yoursocketid : state.yoursocketid,
        news:state.news,
        groupagents : state.groupagents,
        groupdetails :state.groupdetails,
         responses : state.responses,

        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,

      };

    case ActionTypes.ADD_SELECTED_CHANNEL :
      return {
        userdetails: state.userdetails,
        teamdetails:state.teamdetails,
        agents : state.agents,
        channels : state.channels,
        deptagents :state.deptagents,
        channel: state.channels.filter((channel) => channel._id == action.id),
      
         responses : state.responses,
        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,

      };   
    case ActionTypes.ADD_SELECTED_RESPONSE :
      return {
        userdetails: state.userdetails,
        teamdetails:state.teamdetails,
        agents : state.agents,
        deptagents :state.deptagents,
        channels : state.channels,
        responses : state.responses,
        response: state.responses.filter((response) => response._id == action.id),
        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,
           onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,

      };         
   case ActionTypes.ADD_USER_DETAILS:
          console.log(action.user.firstname)
          return{
            userdetails:action.user,
             userchats : state.userchats,
             teamdetails: state.teamdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.customerchat,
             customerchatold : action.customerchat,
              responses : state.responses,
             chatlist : state.chatlist,
              mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
             groupdetails :state.groupdetails,

             
};
   case ActionTypes.ADD_AGENTS:
          console.log(action.agents)
          return{
            userdetails:state.userdetails,
            agents:action.agents,
            deptagents :state.deptagents,
            teamdetails:state.teamdetails,
            channels : state.channels,
            onlineAgents : state.onlineAgents,
            yoursocketid : state.yoursocketid,
            news:state.news,
            groupagents : state.groupagents,
            groupdetails :state.groupdetails,
            chatlist: state.chatlist,
           customerid : state.customerid,
           customerchat : state.customerchat,
           customerchatold : state.customerchatold,
           customerchat_selected : state.customerchat_selected,
           new_message_arrived_rid : state.new_message_arrived_rid, 
           userchats : state.userchats,
            responses : state.responses,
            };  

        
  case ActionTypes.ADD_DEPTAGENTS:
          console.log(action.agents)
          return{
            userdetails:state.userdetails,
            agents:state.agents,
            deptagents :action.agents,
            teamdetails:state.teamdetails,
            channels : state.channels,
            onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
            groupdetails :state.groupdetails,
            chatlist: state.chatlist,
             customerid : state.customerid,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid, 
             userchats : state.userchats,
              responses : state.responses,


             team: state.team,
             newagents : state.newagents,
        
           
          };              
          case ActionTypes.ADD_GROUPAGENTS:
          return{
            userdetails:state.userdetails,
            agents:state.agents,
            deptagents : state.deptagents,
            groupagents : action.agents,
            groupdetails : state.groupdetails,
            teamdetails:state.teamdetails,
            channels : state.channels,
            onlineAgents : state.onlineAgents,
            yoursocketid : state.yoursocketid,
            news:state.news,
            groupdetails :state.groupdetails,
            chatlist: state.chatlist,
             customerid : state.customerid,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid, 
             userchats : state.userchats,
             team: state.team,
             group : state.group,
             newagents : action.agents,
             responses : state.responses,
        

           
          };              

    case ActionTypes.ADD_NEWS:
          return{
            userdetails:state.userdetails,
            agents:state.agents,
            deptagents : state.deptagents,
            groupagents : state.groupagents,
            groupdetails : state.groupdetails,
            teamdetails:state.teamdetails,
            sessionsummary : state.sessionsummary,
            channels : state.channels,
            onlineAgents : state.onlineAgents,
            yoursocketid : state.yoursocketid,
            groupdetails :state.groupdetails,
            chatlist: state.chatlist,
             customerid : state.customerid,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid, 
             userchats : state.userchats,
             team: state.team,
             group : state.group,
             newagents : state.newagents,
             news : action.news,     
             notifications:state.notifications,
             sessionsummaryfiltered : state.sessionsummaryfiltered,
             sessionsummarydetail:state.sessionsummarydetail,
             customers:state.customers,
             resolvedsessions:state.resolvedsessions,
             newsessions:state.newsessions,
             channelwisestats:state.channelwisestats,
             deptwisestats:state.deptwisestats,

             channelwisestats : state.channelwisestats,
            platformwisestats : state.platformwisestats,
            pagewisestats : state.pagewisestats,
            mobilewisestats : state.mobilewisestats,
            countrywisestats : state.countrywisestats,
            channels:(state.channels),
            customerwisestats : state.customerwisestats,
            agentwisestats : state.agentwisestats,  
            agentwisenotifications : state.agentwisenotifications,
            responses : state.responses,

             }
   case ActionTypes.ADD_TEAMS:
          console.log(action.teams)
          return{
            teamdetails:action.teams,
            userdetails: state.userdetails,
            agents : state.agents,
            deptagents :state.deptagents,
            channels : state.channels,
            chatlist: state.chatlist,
             customerid : state.customerid,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid, 
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,
             news:state.news,
             groupagents : state.groupagents,
             groupdetails :state.groupdetails,
              responses : state.responses,
        

      };


    case ActionTypes.ADD_GROUPS:
          return{
            teamdetails:state.teamdetails,
            groupdetails : action.groups,
            userdetails: state.userdetails,
            agents : state.agents,
            deptagents :state.deptagents,
            channels : state.channels,
            groupagents : state.groupagents,
            chatlist: state.chatlist,
             customerid : state.customerid,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid, 
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,
             news:state.news,
             responses:state.responses,
             

      };   

   case ActionTypes.ADD_CHANNELS:
          console.log(action.channels)
          return{
            teamdetails:state.teamdetails,
            userdetails: state.userdetails,
            agents : state.agents,
            deptagents :state.deptagents,
            channels : action.channels,
            onlineAgents : state.onlineAgents,
            yoursocketid : state.yoursocketid,
            news:state.news,
            groupagents : state.groupagents,
            groupdetails :state.groupdetails,
            chatlist: state.chatlist,
             customerid : state.customerid,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid, 
             userchats : state.userchats,
              responses : state.responses,

      };

    case ActionTypes.ADD_RESPONSES:
         console.log(action.responses)
          return{
            teamdetails:state.teamdetails,
            userdetails: state.userdetails,
            agents : state.agents,
            deptagents :state.deptagents,
            channels : state.channels,
            responses : action.responses,
            customers : state.customers,
            serverresponse : state.serverresponse,
            chatlist: state.chatlist,
           customerid : state.customerid,
           customerchat : state.customerchat,
           customerchatold : state.customerchatold,
           customerchat_selected : state.customerchat_selected,
           new_message_arrived_rid : state.new_message_arrived_rid, 
           userchats : state.userchats,
            onlineAgents : state.onlineAgents,
            yoursocketid : state.yoursocketid,
            news:state.news,
            groupagents : state.groupagents,
            groupdetails :state.groupdetails,
        

      };
  
    case ActionTypes.ADD_NEW_RESPONSE:
         console.log(action.response)
          return{
            teamdetails:state.teamdetails,
            userdetails: state.userdetails,
            agents : state.agents,
            deptagents :state.deptagents,
            channels : state.channels,
            responses : [action.response,...state.responses],
            onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
            groupdetails :state.groupdetails,
            chatlist: state.chatlist,
             customerid : state.customerid,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid, 
             userchats : state.userchats,

      };
    case ActionTypes.ADD_MY_TEAMS:
          return{
            teamdetails:state.teamdetails,
            myteamdetails:action.myteams,
            userdetails: state.userdetails,
            agents : state.agents,
            deptagents :state.deptagents,
            channels : state.channels,
            responses : state.responses,
            onlineAgents : state.onlineAgents,
            yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
            groupdetails :state.groupdetails,
            chatlist: state.chatlist,
             customerid : state.customerid,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid, 
             userchats : state.userchats,

      };
    case ActionTypes.ADD_TEAM:
    console.log(action.deptname);
      return {
        teamdetails: [{
          deptname: action.deptname,
          deptdescription: action.deptdescription,

        }, ...state.teamdetails],
         userdetails: state.userdetails,
         errorMessage:'Team created successfully',
         agents : state.agents,
         deptagents :state.deptagents,
         channels : state.channels,
         onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
          chatlist: state.chatlist,
           customerid : state.customerid,
           customerchat : state.customerchat,
           customerchatold : state.customerchatold,
           customerchat_selected : state.customerchat_selected,
           new_message_arrived_rid : state.new_message_arrived_rid, 
           userchats : state.userchats,
            responses : state.responses,

        };

        
     case ActionTypes.DELETE_TEAM :
      return {
        teamdetails: state.teamdetails.filter((team) => team._id !== action.team._id),
        userdetails: state.userdetails,
        errorMessage:'Team deleted successfully',
        agents : state.agents,
        channels : state.channels,
        deptagents :state.deptagents,



        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,
         onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
          groupdetails :state.groupdetails,
           responses : state.responses,
        
       
      };

       case ActionTypes.DELETE_GROUP :
      return {
        teamdetails: state.teamdetails,
        groupdetails : state.groupdetails.filter((group) => group._id !== action.group._id),
        userdetails: state.userdetails,
        errorMessage:'Group deleted successfully',
        agents : state.agents,
        channels : state.channels,
        deptagents :state.deptagents,
        groupagents : state.groupagents,
        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,
         onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
         groupdetails :state.groupdetails,
         responses : state.responses,
       
      };


      case ActionTypes.DELETE_CHANNEL :
      return {
        teamdetails: state.teamdetails,
        channels : state.channels.filter((channel) => channel._id !== action.channel._id),
        userdetails: state.userdetails,
        errorMessage:'Message channel deleted successfully',
        agents : state.agents,
        deptagents :state.deptagents,
         responses : state.responses,
        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,
         onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
         groupdetails :state.groupdetails,

       
      };

      case ActionTypes.DELETE_RESPONSE :
      return {
        teamdetails: state.teamdetails,
        channels : state.channels,
        responses : state.responses.filter((response) => response._id !== action.response._id),
        userdetails: state.userdetails,
        errorMessage:'Canned Response deleted successfully',
        agents : state.agents,
        deptagents :state.deptagents,
         responses : state.responses,

        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,
         onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
         groupdetails :state.groupdetails,
        

       

      };
      case ActionTypes.DELETE_AGENT :
      return {
        teamdetails: state.teamdetails,
        userdetails: state.userdetails,
        errorMessage:'Agent deleted successfully',
        agents : state.agents.filter((agent) => agent._id !== action.agent._id),
        deptagents :state.deptagents,
        channels : state.channels,


        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
        

      };

      case ActionTypes.CREATEGROUP_FAILURE:
      return {
         teamdetails: state.teamdetails,
         userdetails: state.userdetails,
         errorMessage:action.message,
         agents : state.agents,
         channels : state.channels,
         deptagents :state.deptagents,


        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,

       
        };

      case ActionTypes.EDITGROUP_RESPONSE:
      return {
         teamdetails: state.teamdetails,
         userdetails: state.userdetails,
         errorMessage:action.message,
         agents : state.agents,
         deptagents :state.deptagents,
         channels : state.channels,


        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,

        }; 

      case ActionTypes.EDITAGENT_RESPONSE:
      return {
         teamdetails: state.teamdetails,
         userdetails: state.userdetails,
         errorMessage:action.message,
         agents : state.agents,
         deptagents :state.deptagents,
         agent: state.agent,
         channels : state.channels,


        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,

        };  
      
        
          
      case ActionTypes.INVITE_AGENT_RESPONSE:
      return {
         teamdetails: state.teamdetails,
         userdetails: state.userdetails,
         errorMessage:action.message,
         agents : state.agents,
         deptagents :state.deptagents,
         agent: state.agent,
         channels : state.channels,


        chatlist: state.chatlist,
         customerid : state.customerid,
         customerchat : state.customerchat,
         customerchatold : state.customerchatold,
         customerchat_selected : state.customerchat_selected,
         new_message_arrived_rid : state.new_message_arrived_rid, 
         userchats : state.userchats,

        };  

        case ActionTypes.SHOW_SPECIFIC_CHAT:
        return {
           teamdetails: state.teamdetails,
           userdetails: state.userdetails,
           chat:action.chat,
           agents : state.agents,
           deptagents :state.deptagents,
           channels : state.channels,
           responses : state.responses,
           chatlist: state.chatlist,
           customerid : state.customerid,
           customerchat : state.customerchat,
           customerchatold : state.customerchatold,
           customerchat_selected : state.customerchat_selected,
           new_message_arrived_rid : state.new_message_arrived_rid, 
           userchats : state.userchats,


          };

        case ActionTypes.ADD_UPDATE_PROFILE_WARNINGS:
        return {
           teamdetails: state.teamdetails,
           companysettings:state.companysettings,
           userdetails: state.userdetails,
           chat:state.chat,
           agents : state.agents,
           deptagents :state.deptagents,
           channels : state.channels,
           responses : state.responses,
           chatlist: state.chatlist,
           customerid : state.customerid,
           customerchat : state.customerchat,
           customerchatold : state.customerchatold,
           customerchat_selected : state.customerchat_selected,
           new_message_arrived_rid : state.new_message_arrived_rid, 
           userchats : state.userchats,
           errorMessageProfile : action.errormessage,



          };
          case ActionTypes.SHOW_SPECIFIC_CHAT_ERROR:
          return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels,
             userchats : state.userchats,
             responses : state.responses,
             chatlist: state.chatlist,
             customerid : state.customerid,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid, 
             userchats : state.userchats,
                 onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
        

                
            };
          case ActionTypes.SHOW_ALL_CHAT:
           return {
             userchats : state.userchats,
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.customerchat,
             customerchatold : action.customerchat,
             responses : state.responses,
             serverresponse : action.serverresponse,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
             groupdetails :state.groupdetails,
             resolvedsessions : state.resolvedsessions,
             assignedsessions : state.assignedsessions,
            resolvedsocketsessions:state.resolvedsocketsessions,
            groupagents : state.groupagents,
            groupdetails :state.groupdetails,
            
            };


            case ActionTypes.CHAT_SAVE_RESPONSE:
           var cc = []
           if(state.userchats){
              cc = [...state.userchats,action.tempMessage]
           }
           else{
            cc = [action.tempMessage]
           }
           return {

             userchats : cc,
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             responses : state.responses,
             serverresponse : state.serverresponse,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,
             news:state.news,
             groupagents : state.groupagents,
             groupdetails :state.groupdetails,
             resolvedsessions : state.resolvedsessions,
             assignedsessions : state.assignedsessions,
            resolvedsocketsessions:state.resolvedsocketsessions,
            groupagents : state.groupagents,
            groupdetails :state.groupdetails,
            tempMessage : action.tempMessage,
            ismessageSaved : action.ismessageSaved,
            
            };

            case ActionTypes.ADD_USER_CHATS_SPECIFIC_MOBILE:
           return {
             userchats : state.userchats,
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchat,
             responses : state.responses,
             chatlist : state.chatlist,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
             groupdetails :state.groupdetails,
             resolvedsessions : state.resolvedsessions,
             assignedsessions : state.assignedsessions,
            resolvedsocketsessions:state.resolvedsocketsessions,
            mobileuserchat : action.mobileuserchat,
             
            };

           case ActionTypes.SHOW_MY_PICKED_SESSIONS:
           return {
             userchats : state.userchats,
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage: state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : action.customerchat,
             responses : state.responses,
             mypickedsessions : action.mypickedsessions,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
             groupdetails :state.groupdetails,
             
            };

          case ActionTypes.SHOW_ASSIGNED_SESSIONS:
             return {
             userchats : state.userchats,
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage: state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchat,
             responses : state.responses,
             assignedsessions : action.assignedsessions,
             chatlist : state.chatlist,
            mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
             groupdetails :state.groupdetails,
             
            };

            case ActionTypes.SHOW_RESOLVED_SESSIONS:
            return {
             userchats : state.userchats,
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage: state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchat,
             responses : state.responses,
             resolvedsessions : action.resolvedsessions,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             channelwisestats : state.channelwisestats,
             deptwisestats : state.deptwisestats,
             platformwisestats : state.platformwisestats,
             pagewisestats : state.pagewisestats,
             countrywisestats : state.countrywisestats,
             mobilewisestats : state.mobilewisestats,
             customerwisestats : state.customerwisestats,
             agentwisestats : state.agentwisestats,  
             agentwisenotifications : state.agentwisenotifications,
           
           
             
            };

            case ActionTypes.SHOW_NEW_SESSIONS:
             return {
             userchats : state.userchats,
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage: state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchat,
             responses : state.responses,
             newsessions : action.newsessions,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             
            };

          
             case ActionTypes.SHOW_ASSIGNED_SOCKET_SESSIONS:
             return {
             userchats : state.userchats,
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage: state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchat,
             responses : state.responses,
             assignedsessions : action.assignedsessions,
             assignedsocketsessions : action.assignedsocketsessions,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             
            };


             case ActionTypes.SHOW_NEW_SOCKET_SESSIONS:
             return {
             userchats : state.userchats,
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage: state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchat,
             responses : state.responses,
             newsessions : action.newsessions,
             newsocketsessions : action.newsocketsessions,

             assignedsessions : state.assignedsessions,
             assignedsocketsessions : state.assignedsocketsessions,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             
            };


            case ActionTypes.SHOW_RESOLVED_SOCKET_SESSIONS:
             return {
             userchats : state.userchats,
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage: state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchat,
             responses : state.responses,
             resolvedsessions : action.resolvedsessions,
             resolvedsocketsessions : action.resolvedsocketsessions,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             
            };




          case ActionTypes.SET_SOCKET_ID:
          return {
             userchats : state.userchats,
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             groupdetails : state.groupdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.customerchat,
             customerchatold : action.customerchat,
             responses : state.responses,
             news : state.news,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             onlineAgents : state.onlineAgents,
             yoursocketid : action.yoursocketid
        

            };
          case ActionTypes.ADD_USER_CHATS:
           return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchat,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             responses : state.responses,
       
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : action.userchats,
            onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
            groupdetails :state.groupdetails,
        
            
            };

            case ActionTypes.FILTER_BY_STATUS:
            return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.filtered,
             customerchatold : state.customerchatold,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
              responses : state.responses,
       
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
            new_message_arrived_rid : state.new_message_arrived_rid,
            userchats : state.userchats,
            onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
            groupdetails :state.groupdetails,
        
            };   
             case ActionTypes.FILTER_BY_DEPT:
            return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.filtered,
             customerchatold : state.customerchatold,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
              responses : state.responses,
       
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
                 onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
             groupdetails :state.groupdetails,
        
            
            }; 

              case ActionTypes.FILTER_BY_CHANNEL:
            return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.filtered,
             customerchatold : state.customerchatold,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             responses : state.responses,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
        
            
            };     
            case ActionTypes.FILTER_BY_AGENT:
            return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.filtered,
             customerchatold : state.customerchatold,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             channels : state.channels,
              responses : state.responses,
       
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid, 
             userchats : state.userchats,
                 onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
        
            
            };            
            case ActionTypes.SELECT_CUSTOMERCHAT:
             return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage: state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers : state.customers,
             customerchat_selected : action.customerchat_selected[0],
             new_message_arrived_rid : action.new_message_arrived_rid,
             userchats : state.userchats,
             responses : state.responses,
             onlineAgents : state.onlineAgents,
             yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
         
       
            
            };

          case ActionTypes.ADD_SESSION:
           return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : action.customerchat,
             customerchatold : [action.customerchat,...state.customerchatold],
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers:state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             responses : state.responses,
              onlineAgents : state.onlineAgents,
              yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
              groupdetails :state.groupdetails,
        
       
            
            };

          case ActionTypes.ONLINE_AGENTS:
             return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             customers: state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             responses : state.responses,
             onlineAgents : action.onlineAgents,
             yoursocketid : state.yoursocketid,
             news:state.news,
            
            };

          case ActionTypes.SHOW_CHAT_HISTORY:
           return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             chatlist : action.chatlist,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
              customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             channels : state.channels,
            customers : state.customers, 
            userchats : state.userchats,
             responses : state.responses,
            onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
            groupdetails:state.groupdetails,
            groupagents:state.groupagents
       
            
            };

          case ActionTypes.ADD_CHAT_MESSAGE:
          var chatlistt = []
            if(state.chatlist){
              chatlistt = [...state.chatlist,action.message]

            }
            else{
              chatlistt = [action.message]
            }
            var cc = []
           if(state.userchats){
              cc = [...state.userchats,action.message]
           }
           else{
            cc = [action.message]
           }
           return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             
             chatlist: chatlistt,
             customerid : state.customerid,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : action.ch, 
             userchats :cc,
              responses : state.responses,
       
             channels : state.channels,
             customers : state.customers,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
             groupdetails :state.groupdetails,
             
            };

          case ActionTypes.SHOW_NOTIFICATIONS:
             return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             notifications:action.notifications,
             customers:state.customers,
               onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
            chatlist: state.chatlist,
             customerid : state.customerid,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid, 
             userchats : state.userchats,

            };
             case ActionTypes.CONFIRM_NOTIFICATION:
             return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             notifications:state.notifications,
             addednotification : action.msg,
             errorMessage :action.msg,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
              chatlist: state.chatlist,
               customerid : state.customerid,
               customerchat : state.customerchat,
               customerchatold : state.customerchatold,
               customerchat_selected : state.customerchat_selected,
               new_message_arrived_rid : state.new_message_arrived_rid, 
               userchats : state.userchats,


            };
             case ActionTypes.DELETE_NOTIFICATION :
              return {
                teamdetails: state.teamdetails,
                channels : state.channels,
                responses : state.responses,
                userdetails: state.userdetails,
                errorMessage:'Notification deleted successfully',
                agents : state.agents,
                deptagents :state.deptagents,
                notifications : state.notifications.filter((notification) => notification._id !== action.notification._id),
               

                chatlist: state.chatlist,
                 customerid : state.customerid,
                 customerchat : state.customerchat,
                 customerchatold : state.customerchatold,
                 customerchat_selected : state.customerchat_selected,
                 new_message_arrived_rid : state.new_message_arrived_rid, 
                 userchats : state.userchats,
                   onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,

              };
              case ActionTypes.ADD_CUSTOMER :
              return {
               
                errorMessage:'Customer created successfully',
               

              };
            case ActionTypes.ADD_SELECTED_NOTIFICATION :
            return {
              userdetails: state.userdetails,
              teamdetails:state.teamdetails,
              agents : state.agents,
              channels : state.channels,
              deptagents :state.deptagents,
              notifications : state.notifications,
              notification: state.notifications.filter((notification) => notification._id == action.id),
              customers:state.customers,
            
              chatlist: state.chatlist,
               customerid : state.customerid,
               customerchat : state.customerchat,
               customerchatold : state.customerchatold,
               customerchat_selected : state.customerchat_selected,
               new_message_arrived_rid : state.new_message_arrived_rid, 
               userchats : state.userchats,
                 onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,


            };  
            case ActionTypes.SHOW_CUSTOMERS:
             return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : action.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
            
            };
            
            case ActionTypes.CHANNEL_STATS:
              return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
              responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
              customerchatold : state.customerchatold,

              customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             channelwisestats : action.channelwisestats,
             deptwisestats : state.deptwisestats,
             platformwisestats : state.platformwisestats,
             countrywisestats : state.countrywisestats,
             pagewisestats : state.pagewisestats,
             mobilewisestats : state.mobilewisestats,

             customerwisestats : state.customerwisestats,
             agentwisestats : state.agentwisestats,  
             agentwisenotifications : state.agentwisenotifications,       
          
          
          
          
            };


            case ActionTypes.CUSTOMER_STATS:
              return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
              responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
              customerchatold : state.customerchatold,

              customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             channelwisestats : state.channelwisestats,
             deptwisestats : state.deptwisestats,
             platformwisestats : state.platformwisestats,
             countrywisestats : state.countrywisestats,
             pagewisestats : state.pagewisestats,
             mobilewisestats : state.mobilewisestats,
             customerwisestats : action.customerwisestats,

             agentwisestats : state.agentwisestats,  
             agentwisenotifications : state.agentwisenotifications,       
          
          
            };


            case ActionTypes.AGENT_STATS:
              return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
              responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             channelwisestats : state.channelwisestats,
             deptwisestats : state.deptwisestats,
             platformwisestats : state.platformwisestats,
             countrywisestats : state.countrywisestats,
             pagewisestats : state.pagewisestats,
             mobilewisestats : state.mobilewisestats,
             customerwisestats : state.customerwisestats,
             agentwisestats : action.agentwisestats, 
             agentwisenotifications : state.agentwisenotifications,       
                  
          
            };


             case ActionTypes.AGENT_NOTIFICATIONS:
              return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
              responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             channelwisestats : state.channelwisestats,
             deptwisestats : state.deptwisestats,
             platformwisestats : state.platformwisestats,
             countrywisestats : state.countrywisestats,
             pagewisestats : state.pagewisestats,
             mobilewisestats : state.mobilewisestats,
             
             customerwisestats : state.customerwisestats,
             agentwisestats : state.agentwisestats,  
             agentwisenotifications : action.agentwisenotifications,       
          
            };
            case ActionTypes.MOBILE_STATS:
              return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
              responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
              customerchatold : state.customerchatold,

              customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             channelwisestats : action.channelwisestats,
             deptwisestats : state.deptwisestats,
             platformwisestats : state.platformwisestats,
             countrywisestats : state.countrywisestats,
             pagewisestats : state.pagewisestats,
             mobilewisestats : action.mobilewisestats,
            
             customerwisestats : state.customerwisestats,
             agentwisestats : state.agentwisestats,  
             agentwisenotifications : state.agentwisenotifications,
          
          
            };


            case ActionTypes.PAGE_STATS:
              return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,

             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             channelwisestats : state.channelwisestats,
             deptwisestats : state.deptwisestats,
             platformwisestats : state.platformwisestats,
             pagewisestats : action.pagewisestats,
             countrywisestats : state.countrywisestats,
              mobilewisestats : state.mobilewisestats,
          
          
            customerwisestats : state.customerwisestats,
             agentwisestats : state.agentwisestats,  
             agentwisenotifications : state.agentwisenotifications,
            };

            case ActionTypes.DEPT_STATS:
              return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             channelwisestats : state.channelwisestats,
             deptwisestats : action.deptwisestats,
             platformwisestats : state.platformwisestats,
              pagewisestats : state.pagewisestats,
              countrywisestats : state.countrywisestats,
                mobilewisestats : state.mobilewisestats,

             customerwisestats : state.customerwisestats,
             agentwisestats : state.agentwisestats,  
             agentwisenotifications : state.agentwisenotifications,
          
            };



            case ActionTypes.PLATFORM_STATS:
              return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             channelwisestats : state.channelwisestats,
             deptwisestats : state.deptwisestats,
             platformwisestats : action.platformwisestats,
             pagewisestats : state.pagewisestats,
             countrywisestats : state.countrywisestats,
             mobilewisestats : state.mobilewisestats,
             
             customerwisestats : state.customerwisestats,
             agentwisestats : state.agentwisestats,  
             agentwisenotifications : state.agentwisenotifications,
          
            };

            case ActionTypes.COUNTRY_STATS:
              return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:action.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
             
             channelwisestats : state.channelwisestats,
             deptwisestats : state.deptwisestats,
             platformwisestats : state.platformwisestats,
             pagewisestats : state.pagewisestats,
             countrywisestats : action.countrywisestats,
             mobilewisestats : state.mobilewisestats,

             customerwisestats : state.customerwisestats,
             agentwisestats : state.agentwisestats,  
             agentwisenotifications : state.agentwisenotifications,
             
          
          
            };

            case ActionTypes.SHOW_CHAT_SUMMARY:
             return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
              responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
              customerchatold : state.customerchatold,
              sessionsummary : action.sessionsummary,
              sessionsummaryfiltered : action.sessionsummary,
              customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
            
          
            };

            case ActionTypes.ADD_SELECTED_SESSIONSUMMARY:
             return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             sessionsummary : state.sessionsummary,
             sessionsummaryfiltered : state.sessionsummaryfiltered,
             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             sessionsummarydetail : state.sessionsummary.filter((c) => c.request_id == action.id),
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
            
          
            };


             case ActionTypes.ADD_USER_CHATS_SPECIFIC:
             return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             sessionsummary : state.sessionsummary,
             sessionsummary:state.sessionsummaryfiltered,
             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             sessionsummarydetail : state.sessionsummarydetail,
             userchathistory : action.userchathistory,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
            
          
            };


             case ActionTypes.FILTER_BY_SESSION:
             return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             agents : state.agents,
             deptagents :state.deptagents,
             channels : state.channels, 
             responses : state.responses,
             assignedsessions : state.assignedsessions,
             newsessions : state.newsessions,
             resolvedsessions : state.resolvedsessions,
             notifications:state.notifications,
             notification: state.notification,
             customers : state.customers,
             mypickedsessions : state.mypickedsessions,
             customerchat : state.customerchat,
             customerchatold : state.customerchatold,
             sessionsummary : state.sessionsummary,
             sessionsummaryfiltered:action.sessionsummaryfiltered,
             customerchat_selected : state.customerchat_selected,
             customerid : state.customerid,
             chatlist : state.chatlist,
mobileuserchat : state.mobileuserchat,
             sessionsummarydetail : state.sessionsummarydetail,
             userchathistory : state.userchathistory,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
             onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
groupdetails :state.groupdetails,
            
          
            };

            
            case ActionTypes.ADD_SELECTED_CUSTOMER :
            return {
              userdetails: state.userdetails,
              teamdetails:state.teamdetails,
              agents : state.agents,
              channels : state.channels,
              deptagents :state.deptagents,
              notifications : state.notifications,
              customers:state.customers,
              customer: state.customers.filter((customer) => customer._id == action.id),
              onlineAgents : state.onlineAgents,yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
              groupdetails :state.groupdetails,
              responses : state.responses,
              chatlist: state.chatlist,
              customerid : state.customerid,
              customerchat : state.customerchat,
              customerchatold : state.customerchatold,
               customerchat_selected : state.customerchat_selected,
               new_message_arrived_rid : state.new_message_arrived_rid, 
               userchats : state.userchats,

            };  

          case ActionTypes.COMPANY_PROFILE:
           return {
             teamdetails: state.teamdetails,
             userdetails: state.userdetails,
             errorMessage:state.chat_error,
             agents : state.agents,
             deptagents :state.deptagents,
             customerchat : state.customerchat,
             customerchatold : state.customerchat,
             chatlist : state.chatlist,
             mobileuserchat : state.mobileuserchat,
             channels : state.channels,
             responses : state.responses,
             customers : state.customers,
             customerchat_selected : state.customerchat_selected,
             new_message_arrived_rid : state.new_message_arrived_rid,
             userchats : state.userchats,
            onlineAgents : state.onlineAgents,
            yoursocketid : state.yoursocketid,news:state.news,groupagents : state.groupagents,
            groupdetails :state.groupdetails,
            companysettings : action.companysettings,
        
            
            };

    default:
      return state;
  }
};



function widget(state = widgetState, action){
  switch(action.type){
    case ActionTypes.ADD_CUSTOMER_TEAMS:
          return {
            teamdetails:action.teams,
            channels : state.channels,
            roomdetails : state.roomdetails,
            specificsession : state.specificsession,
             specificcustomer : state.specificcustomer,
             filterlist : state.filterlist,

            };
    case ActionTypes.ADD_CUSTOMER_CHANNELS:
          return{
            teamdetails:state.teamdetails,
            channels : action.channels,
            roomdetails : state.roomdetails,
            specificsession : state.specificsession,
            specificcustomer : state.specificcustomer,
            filterlist : state.filterlist,

      };

     case ActionTypes.ADD_CUSTOMER_SESSION:
          return{
            teamdetails:state.teamdetails,
            channels : state.channels,
            roomdetails : state.roomdetails,
            specificsession : action.specificsession,
            specificcustomer : state.specificcustomer,
            filterlist : state.filterlist,

      }; 

      case ActionTypes.ADD_CUSTOMER_DETAILS:
          return{
            teamdetails:state.teamdetails,
            channels : state.channels,
            roomdetails : state.roomdetails,
            specificsession : state.specificsession,
            specificcustomer : action.specificcustomer,
            filterlist : state.filterlist,

      };  
    case ActionTypes.ADD_ROOM_DETAILS :
         return{
            teamdetails:state.teamdetails,
            channels : state.channels,
            sessiondetails :state.session ,
            roomdetails : action.room,
            specificsession : state.specificsession,
            specificcustomer : state.specificcustomer,
            filterlist : state.filterlist,


      };
    case ActionTypes.FILTER_CHANNELS:
          return{
            teamdetails:state.teamdetails,
            channels : state.channels,
            filterlist : state.channels.filter((channel) => channel.groupid == action.id),
            roomdetails : state.room,
            specificcustomer : state.specificcustomer,
            specificsession : state.specificsession,
          
      };
    case ActionTypes.CREATE_SESSION:
         return{
            teamdetails:state.teamdetails,
            channels : state.channels,
            sessiondetails :action.session ,
            roomdetails : state.roomdetails,
            specificcustomer : state.specificcustomer,
            specificsession : state.specificsession,
            filterlist : state.filterlist,
          

      };
        
  default:
      return state;
  }
};
// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.

function auth(state = {isAuthenticated: false}, action) {
  switch (action.type) {
    case ActionTypes.ADD_FORGOTPASSWORD_WARNINGS:
    return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.errormessage
      })
    

    
    case ActionTypes.LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds
      })
    case ActionTypes.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        errorMessage: 'Login went successfully'
      })


     case ActionTypes.SHOW_TOKEN_RESPONSE:
      return Object.assign({}, state, {
       
        errorMessage: action.errormessage
      })

    case ActionTypes.LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      })

    case ActionTypes.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        errormessage:''
      })
    default:
      return state
  }
}


// We combine the reducers here so that they
// can be left split apart above
const appReducer = combineReducers({
  auth,
  dashboard,
  signup,
  widget
})








export default appReducer;





