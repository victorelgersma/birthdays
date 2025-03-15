# Birthday Sanity

A single source of truth for birthdays, namedays, and other events that you prefer not to put in your calendar for whatever reason 

## data structure and storage

* birthdays are stored in localStorage as an object, where the key represents the name
* this introduces the subtletly that you cant have two John Smiths with different birthdays.
## To do

- [x] improve padding in Add Birthday component
- [ ] return to homepage after successful restore from backup
- [ ] move to real domain from hashed
- [ ] refactor AddBirthdayComponent into a React component
- [ ] allow user to edit birthday names and dates
- [ ] when I restore from file I should get message saying "restored" and redirect to the homepage
- [ ] display year if given
- [ ] add a little arrow to point to the "Add birthday" when there are no birthdays
- [ ] the modal should still allow you to see a little bit of the background
- [ ] I should be able to drag the json file onto the screen and it will just add the birthdays
- [ ] I should be able to change the title from "Birthday Sanity" to whatever I want it to be (it will keep it in local Storage)
- [ ] add a bit of text at the very top that says "It's X's birthday"
- [ ] Birthday list Item should probably be its own components
- [ ] jank: sometimes there are literally no birthdays - but sometimes it's just slow - need to implement a loading state to prevent showing "no birthdays" when it's just in a loading state
- [ ] command + enter should save
