# TA Lab Discord Bot


Discord Bot for managing teacher assistant lab schedule. COVID-19 forced us to push all of our lab hours for questions to an online service.

# Documentation
- [Usage](#usage)
- [Commands](#commands)

# Usage

To use you'll have to register a bot on [Discord's website](#https://discordapp.com/developers/applications).

Here's a [good tutorial](#https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/) on setting that up.

Following that tutorial, get the bot's token.

Fork and clone this repository to your computer.

Create a file called **.env** within the **src** folder.

Enter the following into the **.env**:
```
discordToken=YOUR_TOKEN_HERE
```
Replacing **YOUR_TOKEN_HERE** withour bot's token.

Make sure you're running a Mongo Database on your computer. You can edit **src/scripts/setup.js** and run it to add some shifts by default.

After that follow the tutorial to invite your bot to your server.

Run either of these two commands within **src** to start the bot up.
```
$ npm run start
```
or
```
$ node index.js
```
Your bot should be live and listening for commands.

# Commands
- Students
    - [What TA is Working](#what-ta-is-working)
    - [Get a TA's Shifts](#get-a-tas-shifts)
- TA's
    - [Cancel Shift](#cancel-shift)
    - [Undo Cancel on Shift](#undo-cancel-on-shift)
    - [Delete All TA's Hours](#delete-all-tas-hours)
    - [Add a Shift](#add-a-shift)

# What TA is Working
```
/taschedule
```
### Description:
*Displays if a TA is currently scheduled to help.*

*Shows if a currently scheduled TA canceled their shifts.*

*If none are available at the time, shows how long until next TA is scheduled.*

# Get a TA's Shifts
```
/gethours <name>
```
### Parameters:
| name | type     | description                   |
|------|----------|-------------------------------|
| name | `string` | Lower or Uppercase First name |
### Description:
*Displays a TA's scheduled shifts and any cancelations*
### Example: 
```
/gethours andrew
```

# Cancel Shift
```
/cancel <name> <day> <start>
```
### Parameters: 
| name  | type     | description                   |
|-------|----------|-------------------------------|
| name  | `string` | Lower or Uppercase First name |
| day   | `string` | Lowercase name of day.        |
| start | `number` | Starting hour. (24H Format)   |
### Description:
*Marks a scheduled shift as canceled.*

*Resets for next week to uncanceled as soon as the shift has expired.*
### Example: 
```
/cancel andrew tuesday 15
```

# Undo Cancel on Shift
```
/uncancel <name> <day> <start>
```
### Parameters: 
| name  | type     | description                   |
|-------|----------|-------------------------------|
| name  | `string` | Lower or Uppercase First name |
| day   | `string` | Lowercase name of day.        |
| start | `number` | Starting hour. (24H Format)   |
### Description:
*Marks a canceled scheduled shift as not canceled.*

### Example: 
```
/uncancel andrew tuesday 15
```
# Delete All TA's Hours
```
/reset <name>
```
### Parameters:
| name | type     | description                   |
|------|----------|-------------------------------|
| name | `string` | Lower or Uppercase First name |
### Description:
*Deletes all of a TA's shifts.*
### Example: 
```
/reset andrew
```
# Add a Shift
```
/addshift <name> <day> <starthour> <endhour>
```
### Parameters:
| name  | type     | description                   |
|-------|----------|-------------------------------|
| name  | `string` | Lower or Uppercase First name |
| day   | `string` | Lowercase name of day.        |
| starthour | `number` | Starting hour. (24H Format)   |
| endhour | `number` | Ending hour. (24H Format)   |
### Description:
*Adds a shift for a TA.*
### Example: 
```
/addshift andrew tuesday 15 17
```