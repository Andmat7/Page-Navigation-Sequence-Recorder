# chrome plugin: Page Navigation Sequence Recorder

a browser plugin that records, in JSON format, the sequence of navigation performed by a user on a web page, uploading the sequence to a portal. The plugin is able to record only the navigation sequence, to be processed later by another application.

## capture the following events:

- URL entered
- Clicks on menus or buttons, identifying the page element.
- Entry of text or selection of combos, identifying the data entered and the element,.
- Clicks on other objects, identifying the object.
- It must be possible to select a text on the page and remember it.
- Save the result and send it to a url via post, being able to enter a name to the sequence.

## other functionalities:

- to replay the navigation.
- to edit the content of the output
- to put comments on each event.
- to capture the launch of a popup.

## JSON

The result obtained will be in JSON format similar to the following

```json
{
"Navigation": {
"Name": "name entered by user",
"URL": "www.test.com",
"events": [
{ "event": "click", "element": "id-menu1", "input": "null"},
{ "event": "input-text", "element": "name", "input": "pepito"},
{"event": "input-text", "element": "name", "input": "pepito"},
] }

```
