export function printlogs(type,message){
	//console.error(message); //gives you the red errormessage
	//console.log(message); //gives the default message
	//console.warn(message); //gives the warn message with the exclamation mark in front of it
	//console.info(message); //gives an info message with an 'i' in front of the message

	var showlogs = true;
	if(showlogs == true){
		//print only 
		if(type == 'error'){
			console.error(message);
		}
		else if(type == 'log'){
			console.log(message);
		}
		else if(type == 'warn'){
			console.warn(message);
		}
		else{
			console.info(message);
		}
	}

	else{
		//print only errors 
		if(type == 'error'){
			console.error(message);
		}	
	}
}