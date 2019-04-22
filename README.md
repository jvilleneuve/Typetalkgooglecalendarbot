# Typetalkgooglecalendarbot
A bot for typetalk to send reminders about events in your google calendar

# Functions
It has 3 main functions:
1. It will remind you at your chosen time of your schedule that day. This does not include events in the calendar you said "no" to. 
2. It will let you know if someone creates a double booking in your calendar during the next 30 days (real-time). 
3. It will remind you 5 minutes before your meetings with a mention , and if set, where to go to. 

# Install
Create a new google apps script and copy the code. 
At the top of each function, setup the necessary values.

First, create a new bot in typetalk and in the code's postToTypetalk function, set your Typetalk URL and your Typetalk token accociated with the topic you want the bot to post to. After, in the 3 places, set:
- calendarId = your google calendar email address.
- output = your message to be alerted by in typetalk
 

Next, go to Resources => advanced google services and turn on the Calendar API.

Last, you will need to setup triggers. 
Set the following 3 triggers:
1. listTodaysEvents time based. Set the time to be whenever you want your daily schedule posted
2. alertUser time based. Set as time driven, every 5 minutes. This will remind you when you have events starting.
3. checkDoubleBookings . Set this trigger to execute whenever your google calendar is updated. 
 
Note: If you are outside of Japan, you will need to set your timezone on line 16. 
