function postToTypetalk(message) {
  //Set your typetalk bot URL
  var url = "";
  
  //set your typetalk token
  var options = {
    "method": "post",
    "headers": {"X-Typetalk-Token": "yourTokenHere"},
    "payload": {"message": message}
  };
  var response = UrlFetchApp.fetch(url, options);
}

function timeFormatter(date){ 
  temp = new Date(date);
  return Utilities.formatDate(temp,'JST','HH:mm');
}


function listTodaysEvents() {
  //set your calendar email (from your google account)
  var calendarId = 'you@email.com';

  //setup output, customized message
  var output = "Good morning @you , here's your schedule for today: \n \n"
  
  //set end of day for filter
  var endTime = new Date();
  endTime.setHours(24,0,0,0);
  

  var allDay= false;
  
  
  //optional filters for calendar search
  var optionalArgs = {
    timeMin: (new Date()).toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 100,
    orderBy: 'startTime',
    timeMax: endTime.toISOString()  };
  
  //get the list of events
  var response = Calendar.Events.list(calendarId, optionalArgs);
  var events = response.items; 
  
  if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
     
      var event = events[i];
      var when = event.start.dateTime;
      
      var startTime = timeFormatter(event.start.dateTime); // start time
      var endTime = timeFormatter(event.end.dateTime);     // end time 
      var attendees = event.attendees;  
      
      //take out all day events
      
      if (typeof event.start.dateTime != 'undefined'){
        
        //check he is only attendee
        if (typeof attendees !== 'undefined'){
          
          for (count=0; count< attendees.length; count++) {
            if (attendees[count].email==calendarId && attendees[count].responseStatus !=="declined"){
              output += startTime + "-"+ endTime + " " + event.summary + "\n";              
            }
          }
        } else{        
          output += startTime + "-"+ endTime + " " + event.summary + "\n";
        }
        
      } 
      
    }
    postToTypetalk(output);
    
  } else {
    Logger.log('No upcoming events found.');
    
  }
  
  
}




function checkDoubleBookings(){
  
  //set your calendar
  var calendarId = 'you@email.com';
  
  //setup output
  var output = "Uh oh @you , you have a double booking.  \n \n"
  
  var endTime = new Date();
  endTime.setDate(endTime.getDate()+30);
  endTime.setHours(24,0,0,0);
  
  
  var optionalArgs = {
    timeMin: (new Date()).toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 100,
    orderBy: 'startTime',
    timeMax: endTime.toISOString()  };
  
  //get the list of events
  var response = Calendar.Events.list(calendarId, optionalArgs);
  var events = response.items;
  var goingToEvents= new Array();
  
  //get the times
  
  if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
       
      var event = events[i];

      var when = event.start.dateTime;
      
      var startTime = timeFormatter(event.start.dateTime); // start time
      var endTime = timeFormatter(event.end.dateTime);     // end time      
      var attendees = event.attendees;  
          
      if (typeof event.start.dateTime != 'undefined'){
        
        if (typeof attendees !== 'undefined'){
          
          for (count=0; count< attendees.length; count++) {
            if (attendees[count].email==calendarId && attendees[count].responseStatus !=="declined"){
      
              goingToEvents.push(event);
              
            }
          }
        } else{
         
          goingToEvents.push(event);
          
        }
        
      } 
      
    }
    
  } else {
    Logger.log('No upcoming events found.');
    
  }
  
  
  //check for double bookings. 
  
  for (x=0; x<goingToEvents.length -1 ;x++){
    for (y = x+1; y< goingToEvents.length; y++){
      var event1 = goingToEvents[x];
      var event2 = goingToEvents[y];
      
      //calculate if double booking
      if ((event2.start.dateTime < event1.start.dateTime && event2.end.dateTime <= event1.start.dateTime)||event2.start.dateTime>=event1.end.dateTime)
      {
        //safe so do nothing
      } else {
        
        output+= "Event 1: \n \n" +event1.start.toString() +" " + event1.summary + " \n \n Event 2: \n \n" +  event2.start.toString() +" " + event2.summary ;
        
        
        postToTypetalk(output);
        output = "Uh oh, you have a double booking.  \n \n"
      }
    }
  }
  
}



function alertUser() {
  
  //set yout calendar
  var calendarId = 'you@email.com';
  //setup output
  var output = "Hi @you , you have a meeting starting soon!  \n \n"

  var endTime = new Date();
  endTime.setDate(endTime.getDate());
  endTime.setHours(24,0,0,0);
  
  var optionalArgs = {
    timeMin: (new Date()).toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 100,
    orderBy: 'startTime',
    timeMax: endTime.toISOString()  };
  

  var response = Calendar.Events.list(calendarId, optionalArgs);
  var events = response.items;
  var goingToEvents= new Array();
  
  if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
          
      var event = events[i];      
      var when = event.start.dateTime;
      
      var startTime = timeFormatter(event.start.dateTime); // start time
      var endTime = timeFormatter(event.end.dateTime);     // end time

      var attendees = event.attendees;  
      
      if (typeof event.start.dateTime != 'undefined'){
        
        if (typeof attendees !== 'undefined'){
          
          for (count=0; count< attendees.length; count++) {
            if (attendees[count].email==calendarId && attendees[count].responseStatus !=="declined"){
              
              goingToEvents.push(event);
              
            }
          }
        } else{
                  goingToEvents.push(event);
                }
        
      } 
      
    }
    
  } else {
    Logger.log('No upcoming events found.');    
  }
  
  
  //check for double bookings. 
  var now = new Date();
  var plusFive = new Date();
  plusFive.setMinutes(plusFive.getMinutes()+5);
  var doPost = 'false'; 
  
  for (x=0; x<goingToEvents.length;x++){
    
    var thisEvent = goingToEvents[x];
    var eventStartTime= new Date(thisEvent.start.dateTime);
    
    //calculate if time to notify    
    if (eventStartTime > now && eventStartTime <= plusFive) 
    {
      doPost='true';     
      output+= thisEvent.summary;
      if (typeof thisEvent.location !=='undefined'){
        output+= " in "+ thisEvent.location +".\n";
      }else{
        output+="\n";
      }
    }
    
  }
  if (doPost=='true'){
    postToTypetalk(output);
  }
  
}
