## Operation Guide
### Overview
KiboEngage is developed with strategy  to separate server from client. 
Server side code is separated from Client side code.And to build kiboengage application, use npm run clean && npm run build && npm run start:prod commands
The built application is stored in dist folder. Then this folder is deployed to server for production.

kiboengage uses Nodejs (https://nodejs.org/) as its server and ReactJS (https://facebook.github.io/react/) as its Client. 
All server side libraries are istalled using npm install command, these libraries are saved in node_modules folder. 
On server side, libraries are defined in package.json. 


## Architecture
kiboengage application uses purchased droplet from azure for deployment. 
KiboEngage does not has its own mongodb database.It uses the database already built for KiboSupport with few enhancements.


## Design

**Kiboengage Client**

![Client Diaagram](https://github.com/Cloudkibo/KiboEngage/blob/master/Documentation/Kiboengage architecture.PNG)

**KiboEngage Server**

![Server Diagram](https://github.com/Cloudkibo/KiboEngage/blob/master/Documentation/Kiboengage server.PNG)


#### Install nodejs

In order to get this version, we just have to use the apt package manager. We should refresh our local package index prior and then install from the repositories:


    sudo apt-get update
    sudo apt-get install nodejs
    sudo ln -s /usr/bin/nodejs /usr/bin/node

install npm, which is the Node.js package manager

    sudo apt-get install npm

#### Install Forever

To install forever run the following command:

    npm install forever -g



#### Clone the application on server from github:
    git clone https://github.com/Cloudkibo/KiboEngage.git

Install server side and client libraries using:

    npm install


Now, build the application

    npm run clean && npm run build && npm run start:prod

In order to run the application, use forever:

    NODE_ENV=production forever start index.js

#### Redirect the ports to our application ports

Run following  command

    iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8000

#### Updates

If there is update in code, then we need to pull the code. Go to folder of KiboEngage using "cd KiboEngage". Run following commands

    git pull origin master

Now build the application again using command:

     npm run clean && npm run build && npm run start:prod

Stop the server using command: 

  NODE_ENV=production forever stop index.js

Start the server again using command:

   NODE_ENV=production forever start index.js










