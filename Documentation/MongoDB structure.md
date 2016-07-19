## MongoDB structure for Kibosupport
#### 1.	Agentinitiatedcalls
This table stores information of calls that are initiated by agent. When agent invites a visitor via email for call some of the visitor information is stored, this information includes:

  a.	`uniqueid` : unique identity of visitor

  b.	`agentname` : agent who has invited

  c.	`agentemail` : agent email who has invited

  d.	`departmentid` : department id, from where the visitor has been invited

  e.	`username` : name of user

  f.	`useremail` : email of user

  g.	`question` : query for which visitor has been invited

  h.	`currentPage` : page from where visitor has joined call

  i.	`fullurl` : page url

  j.	`phone` : phone number of entered by visitor

  k.	`browser` : browser shows chrome, firefox

  l.	`ipAddress` : ip address of visitor

  m.	`country`: country of visitor

  n.	`room` : meeting room of visitor

  o.	`date` : date on which visitor has arrived

  p.	`request_id` : request id is assigned to visitor, when visitor request for a call
  
#### 2.	Companyprofile

Companyprofile stores information about company profile where company setting are set. Each column in this table stores value of the company setting:

a.	`companyid : String,`  

This gives unique id to each company automatically.

b.	`allowChat : { type: String, default: 'No' }`  

This stores if user wants to allow chat option during the call. When agent picks a ticket it is initially shows chat interface for both agent and visitor. And provides a button “start call”. To enable this setting will sow chat UI when ticket is picked.

c.	`isdomainemail: { type: String, default: 'No' }`  

This setting allows user to only invite and sign in to those agent that have company domain email id. This ensures agent belongs to this particular company

d.	`allowCompletingOfCalls : { type: String, default: 'No' }`  

This setting allows to automatically complete in-progress calls after specified amount of time

e.	`completeCallTime : { type: Number, default: 30 }`  

With this user can set time to automatically complete in-progress calls after specified amount of time.

f.	`allowsmsnotification : { type: String, default: 'No' }`  

This enables SMS notification for admin /agent

g.	`allowemailnotification : { type: String, default: 'No' }`  

This enables email notification for admin /agent

h.	`smsphonenumber : { type: Number, default: 30 }`  

This stores phone number where SMS notification for admin/agent can be sent

i.	`notificationemailaddress : String`  

This stores email address where email notification for admin/agent can be sent

j.	`abandonedscheduleemail1 : String`  

This stores default sample email 1 content that admin wants its agent to use while inviting an abandoned call visitor 

k.	`abandonedscheduleemail2 : String` 

This stores default sample email 2 content that admin wants its agent to use while inviting an abandoned call visitor 

l.	`abandonedscheduleemail3 : String`  

This stores default sample email 3 content that admin wants its agent to use while inviting an abandoned call visitor 

m.	`completedscheduleemail1 : String`  

This stores default sample email 1 content that admin wants its agent to use while inviting a completed call visitor 

n.	`completedscheduleemail2 : String`  

This stores default sample email 2 content that admin wants its agent to use while inviting a completed call visitor 

o.	`completedscheduleemail3 : String`  

This stores default sample email 3 content that admin wants its agent to use while inviting a completed call visitor 

p.	`invitedscheduleemail1 : String`  

This stores default sample email 1 content that admin wants its agent to use while inviting a   visitor for call

q.	`invitedscheduleemail2 : String`  

This stores default sample email 2 content that admin wants its agent to use while inviting a   visitor for call

r.	`invitedscheduleemail3 : String`  

This stores default sample email 3 content that admin wants its agent to use while inviting a   visitor for call

s.	`maxnumberofdepartment : Number`  

This stores limit to number of department that can be created for particular company

t.	`showsummary : { type: String, default: 'No'}`  

This setting enables the chat summary that appears as a separate popup widget to agent and agent can store the call summary, call description and call issue resolved comments and notes during the call. 

u.	`widgetwindowtab: { type: String, default: 'window'}`  

This allows to open any widget as a widget or to open it as a separate tab in the browser

#### 3.	Configuration  

Configuration are super user settings for Kibosupport. This includes some company settings that are reflected upon the company settings that are signed up.

a.	`Abandonedscheduleemail1: String`  

This stores default abandoned call invite sample email 1 content that can be seen in companies settings as default sample email content provided by Kibosupport. 

b.	`abandonedscheduleemail2 : String`  

This stores default abandoned call invite sample email 2 content that can be seen in companies settings as default sample email content provided by Kibosupport. 


c.	`abandonedscheduleemail3 : String`  

This stores default abandoned call invite sample email 3 content that can be seen in companies settings as default sample email content provided by Kibosupport.

d.	`completedscheduleemail1 : String`  

This stores default completed call invite sample email 1 content that can be seen in companies settings as default sample email content provided by Kibosupport.

e.	`completedscheduleemail2 : String`  

This stores default completed call invite sample email 2 content that can be seen in companies settings as default sample email content provided by Kibosupport.


f.	`completedscheduleemail3 : String`  

This stores default completed call invite sample email 3 content that can be seen in companies settings as default sample email content provided by Kibosupport.


g.	`invitedscheduleemail1 : String`  

This stores default invite to call sample email 1 content that can be seen in companies settings as default sample email content provided by Kibosupport.


h.	`invitedscheduleemail2 : String`  

This stores default invite to call sample email 2 content that can be seen in companies settings as default sample email content provided by Kibosupport.


i.	`invitedscheduleemail3 : String`  

This stores default invite to call sample email 3 content that can be seen in companies settings as default sample email content provided by Kibosupport.


j.	`maxnumberofdepartment : Number`  

This stores default value to max number of department a company can create this can be seen in companies settings as limit provided by Kibosupport. Admin of company cannot exceed this limit in company settings 

k.	`maxnumberofagent : Number`  

This stores default value to max number of agent a company can invite this can be seen in companies settings as limit provided by Kibosupport. Admin of company cannot exceed this limit in company settings

l.	`sendgridusername : String`  

This stores sendgrid credentials, username

m.	`sendgridpassword : String`  

This stores sendgrid credentials, password

n.	`allowCompletingOfCalls : { type: String, default: 'No' }`  

This allows company to automatically complete an inprogress call. 

o.	`completeCallTime : { type: Number, default: 30 }` 

This allows company to automatically complete an inprogress call after set time. 


p.	`allowChat : { type: String, default: 'No' }`  

This stores if company can allow chat option during the call. When agent picks a ticket it is initially shows chat interface for both agent and visitor. And provides a button “start call”. To enable this setting will sow chat UI when ticket is picked.

q.	`isdomainemail: { type: String, default: 'No' }`  

This setting allows company to set an email domain to only invite and sign in to those agent that have company domain email id. This ensures agent belongs to this particular company


r.	`showsummary : { type: String, default: 'No' }`  

This setting enables the chat summary that appears as a separate popup widget to agent and agent can store the call summary, call description and call issue resolved comments and notes during the call. 


s.	`selectLogo : { type: String, default: 'Logo 1' }`  

To set log for Kibosupport

t.	`sitedomain : {type: String}`  

To set domain of a site

u.	`cloudkibodomain : {type: String}`  

To set domain of cloudkibo

#### 4.	Department  
	
Stores information of department management. Creating, deleting and managing department. 

a.	`deptname : String,`  

Stores name of department

b.	`deptdescription: String,`  

Description content of department

c.	`companyid : String,`  

Identity of company where the department has been created

d.	`createdby : {type: Schema.ObjectId, ref: 'Account'}`  

Name of user who created department, can be admin or superuser of the company

e.	`creationdate : { type: Date, default: Date.now }`  

Stores date when department was created

f.	`deleteStatus : { type: String, default: 'No' }`  

We do not completely delete a department, we remove it and change its name by adding a prefix “Deleted-date-deptname”

#### 5.	Deptagent

This is association table for agent and department, in this we join agent to department so that agent can be added to and removed from a department.

g.	`deptid : {type: Schema.ObjectId, ref: 'department'}`  

Identity of department 

h.	`companyid : String`  

Identity of company where the department has been created

i.	`agentid : {type: Schema.ObjectId, ref: 'Account'}`  

Agent who is added to this particular department

j.	`joindate : { type: Date, default: Date.now }`  

Date when agent joined the department.

k.	`deleteStatus : { type: String, default: 'No' }`  

If department has been deleted

#### 6.	Inviteagenttoken
When a new agent is invited to Kibosupport some of its information is stored with a token in this table.

a.	`email : String,`  

Email of agent who is invited

b.	`token : {type: String, required: true},`  

Automatic identifier string is stored

c.	`companyId : String,`  

Company id to which agent has been invited

d.	`createdAt : {type: Date, required: true, default: Date.now, expires: '120h'}`  

Invitation sent date and invitation expires after 120 hours


#### 7.	Passwordresettoken
This is password rest table, when a user request to reset its password some of the information is stored. And later used to rest the password of the particular user who sent the request.

a.	`user : {type: Schema.ObjectId, required: true, ref: 'Account'},`  

Object of user who sent the request is stored. Includes information as username, email id

b.	`token : {type: String, required: true}`  

Unique identifier of the request

c.	`createdAt : {type: Date, required: true, default: Date.now, expires: '4h'}`  

Request time when reset password request is sent. This request expires the token after 4 hours.



#### 8.	Tempaccount
When an account is sign up or created it is stored as a temp account until it is verified by user. This is the tempaccount table where information is stored of new user.

a.	`email : { type : String , lowercase : true}` 

Stores email address of new account, converts the address to lower case

b.	`date  :  { type: Date, default: Date.now }`  

Date when account was created is stored

c.	`uniqueid : String`  

An automatic unique identity string is assigned to new user

#### 9.	User
This table stores information of user on kibosupport. These values can be changed from UI in the user profile option provided. Some of its values are set default, these values are taken from the information provided by user during sign up and some from company profile settings.

a.	`firstname : String`  

First name of user

b.	`lastname : String`  

Last name of user

c.	`email : { type : String , lowercase : true}`  

Email address of user

d.	`phone : String`  

Phone number of user

e.	`country : String`  

Country of user

f.	`city : String`  

City of user

g.	`state : String`  

State of user

h.	`isAgent : String` 
Role of user, if agent

i.	`isAdmin : String` 
Role of user, if admin

j.	`isOwner : {type: String, default: 'No' }`  

Role of user, if owner

k.	`isSupervisor : String` 
Role of user, if supervisor of company

l.	`website :  { type: String, lowercase: true }` 
Website is company url

m.	`companyName : String` 
Company name

n.	`uniqueid : String` 
Unique id of user

o.	`picture: String` 
Display picture of user

p.	`accountVerified : {type: String, default: 'No' }` 
If user has verified the account

q.	`date  :  { type: Date, default: Date.now }` 
Date when account was created

r.	`isDeleted : {type: String, default: 'No'}` 
Account of user exists or is deleted

s.	`canIncludeAgent : {type: String, default: 'No'` 
If user is allowed to assign agent to the departments

t.	`canExcludeAgent : {type: String, default: 'No'}` 
If user is allowed to exclude agent to the departments

u.	`abandonedemail1 : String` 
User can modify the abandoned call sample invite email 1 that is set to default.

v.	`abandonedemail2 : String` 
User can modify the abandoned call sample invite email 2 that is set to default.

w.	`abandonedemail3 : String` 
User can modify the abandoned call sample invite email 3 that is set to default.

x.	`completedemail1 : String` 
User can modify the completed calls sample invite email 1 that is set to default.

y.	`completedemail2 : String` 
User can modify the completed calls sample invite email 2 that is set to default.

z.	`completedemail3 : String` 
User can modify the completed calls sample invite email 3 that is set to default.

aa.	`invitedemail1 : String` 
	User can modify the invite calls sample email 1 that is set to default.

bb.	`invitedemail2 : String` 
	User can modify the invite calls sample email 2 that is set to default.

cc.	`invitedemail3 : String` 
	User can modify the invite calls sample email 3 that is set to default.

dd.	`allownotification : {type: String, default: 'No'}` 
	User can allow to have desktop notification.

ee.	`allowchime: {type: String, default: 'No'}`
	User can allow to have chime for desktop notification.

ff.	`role: {type: String, default: 'admin'}` 
		User role 

gg.	`hashedPassword: String` 
	Store password of user with hash encryption

#### 10.	Userchat
This table stores chat of visitor with the agent.

a.	`to : String` 
Email address of user to which chat is sent

b.	`from : String` 
Email address of user who is sending chat

c.	`visitoremail : String` 
Email address of visitor

d.	`agentemail : String` 
Email address of agent

e.	`msg : String`
Chat message sent to user

f.	`datetime : {type: Date, default: Date.now }` 
Date and time when chat is sent

g.	`request_id : String` 
Unique identity of chat 

h.	`companyid: String` 
Company id of agent


#### 11.	Verificationtoken
When user sign up, verification token is sent via email of user. And this information is stored in this table.

a.	`user : {type: Schema.ObjectId, required: true, ref: 'Account'}` 
This is object of user, is object of account table

b.	`token : {type: String, required: true}` 
Token is automatically created

c.	`createdAt : {type: Date, required: true, default: Date.now, expires: '4h'}` 
Date when account is created


#### 12.	visitorcalls
This table stores call data 

a.	`username : String,`
caller name

b.	`useremail : String,` 
caller email address

c.	`question : String` 
question caller has called for

d.	`currentPage : String` 
Page from where caller has called

e.	`departmentid : {type: Schema.ObjectId, ref: 'departments'}` 
Department to which caller has called

f.	`fullurl : String` 
URL from where visitor has made the call

g.	`phone : String` 
Visitor phone number

h.	`browser : String` 
Visitor browser

i.	`ipAddress: String` 
Visitor ip address

j.	`country: String` 
Country from where visitor has called

k.	`room : String, // Check it for all the conditions` 
Room to which visitor is assigned to for call


l.	`socketid : String` 
Socket id to room

m.	`agentname : String` 
Agent who picked call

n.	`agentemail : String` 
Agent email who picked call

o.	`status : {type : String, default : 'waiting'}` 
Call status

p.	`initiator : {type : String, default : 'visitor'}` 
Who is initiator of call

q.	`requesttime: Date` 
Call request is sent

r.	`abandonedtime: Date` 
If call is abandoned it time and date

s.	`picktime: Date` 
If call is picked it time and date

t.	`endtime: Date` 
If call is ended it time and date

u.	`request_id : String,`

v.	`callsummary: String,`

w.	`calldescription: String,`

x.	`callresolution: String,`

y.	`webrtc_browser: Boolean`


