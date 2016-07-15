# Developers guide 
## Overview

KiboEngage uses nodejs on server side and ReactJS on client side. 
Great care has been taken to separate the server side code from client side. To maintain great modularity, code has been separated into files according to role.
KiboEngage has configuration files on both server side and client side. KiboEngage doesn't has its own database.It is accessing KiboSupport through Rest APIs

Code has been made very modular and several components are separated in their own folders with logic and test code placed side by side for each component. In KiboEngage separate folders for React components,containers,Redux actions and Reducers.

## Architecture

Kiboengage application uses purchased droplet from azure for deployment. KiboEngage does not has its own mongodb database.It uses the database already built for KiboSupport with few enhancements. 

Currently, our deployments are manual. We push the code to github and then access our droplet by ssh and pull the latest code there. With docker, we would just make a code push and docker will make build image for us.

## Server side code 

Most of the main server side code is written in server folder. 
In socketio.js, we have all the server side code of socket.io. This code is often visited.
server.js is the main file of server side application and serves as starting point of our code.Server side routes are defined in server.routes.js insides server/routes folder.

##### KiboEngage Server Side Files and Folders Structure

Following shows the complete server side folder and file. And each file has a description of the code it contains.

##### Server (Folder)

**Controllers**

*channel.controller.js*
Contains code for calling KiboSupport API for Message Channels

*chat.controller.js*
Contains code for calling KiboSupport API for Chat 

*customer.controller.js*
Contains code for calling KiboSupport API for adding and retrieving customers

*group.controller.js*
Contains code for calling KiboSupport API for Groups

*notification.controller.js*
Contains code for calling KiboSupport API for Notifications

*user.controller.js*
Contains code for calling KiboSupport API for authentication and agent related information

## Client side code

On client side, we are using ReactJS and Redux for data handling so most of the client application follows the Redux and React pattern of modularity. 
Following is the general workflow that will be followed for all react containers in KiboEngage

![Client Diaagram](https://github.com/Cloudkibo/KiboEngage/blob/master/Documentation/Kiboengage architecture.PNG)

React Containers will receive data from reducer,update their state and pass this data to react component as a ‘prop’(property).
In Kibo Engage,section below is describing React Containers,Data that they will receive from Reducer,Actions that can take place in container,components of react container and what data each react component will receive from container.

###1.  Groups Container
		Groups container will receive all groups data from Kibo support api.
    #### Components:
      i. Group : 
          Each group component will hold details of a each group present in all groups data.
         *Actions:*
            i.  Edit group
            ii. Delete group
            
      ii.View Component:
          It will display details of a particular group whose id is passed as a parameter

      iii. Edit group component:
          It will enable user to modify group details.
          *Actions:*
            i. Save
      
      iv. Create new group:
            No prior data required.
            *Actions :* Submit

###2.  Agents Container
		Agents container will receive all agents data from Kibo support api.
    #### Components:
        i. Agent : 
            Each agent component will hold details of a each agent present in all agents data.
            *Actions:*
              i.    Change Role
              ii.   Delete
              iii.  Save Changes
        
        ii. Invite new agent:
            It will display form to fill details of a new agent
            *Actions:*
              i.    Submit

###3.    Message Channels Container
      Message Channels container will receive  message channels data from KiboSupport Api.
      
      #### Components:
      
        i.  Message Channel:
            Each message channel is a component that will hold details of that channel.
        
        ii. Add Channel:
            This will show a form to create a new message channel
            *Actions:*
              i.  Save
              ii. Cancel

###4.    Chat Container
      Chat container will receive mobile users chat data from server. It will have following components:
      
      #### Components:
        i.  Customer List:
            Customer list will be component that will hold data of chat messages.
        
        ii. Chat:
            Chat component will show the history of chats of logged in agent for a particular customer
            *Actions:*
            
              i.  Resolve : This action will mark the chat message status as resolved.
              ii. Assigned To:This action allow agent to redirect/reassign chat message to some other agent
              iii. Move To : This action allow agent to move the chat message to other group if he finds message not related to the group it has been sent to.
              iv. Send : This action will dispatch the agent message to server to be send to customer
              v. Filter customer messages by status (New,Assigned,Resolved)
              vi. Filter customer messages by groups (New,Assigned,Resolved)
              vii.Filter customer messages by agents (visible to only Admin/Supervisor)
              
###5.    Notifications Container
      Notifications container will fetch notifications from server and pass that to Notifications List component.It will have following components:
      
      #### Components:
        i.  Notification List:
            Notification list will be component that will hold data of notifications.
        
        ii.Add Notification:
            Add notification component requires only logged in agent information and will display a form to create a new notification.
            *Actions:*
              i.  Send:
                  Send action will submit the notification to server which will then be sent to mobile clients
              
              ii. Cancel

###6.    Customer Directory Container
      Customer directory container will fetch customer information from server.It will have following components:
	
      ####Components:
        i. Customer : 
            Each customer is a  component and will hold details of a that particular customer..
            *Actions:*
                i.Send SMS/Email:
                    Agent can send sms/email or can view chat history of that particular customer.
              

## Libraries

All Server side libraries and Client side libraries are defined in package.json 







