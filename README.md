# 'Sensei' Help System

This is a complete software solution for providing system / application wide
help / introduction for SPAs.

The core is framework agnostic and as such rquires a 'bridge' to work with the
host aplpication.

The code is executed in closure style to allow minimalist impact on performance
of the original (host) application and is IIFE protected, only a small API is
being exposed (4 calls). The 'beidge' should utilize this small API to communicate
intent to the core help system.

## How to build

To build the app you will need the correct system environment. If unsure
use Linux OS (Ubuntu 14.04 or newer) and use the [environment building script](https://gist.github.com/pstjvn/d15c6ba2c8a2b875b575).

Close the app in 'apps' and then run:

```
make debug=false && make ns=inject debug=false
```

This will build both the iframe script and styles and the injectable one.

* *build/inject.min.js* - the file you must put in your app (index.html)
* *build/app.min.js* - the file to put in your help iframe html file (for example helpsystem.html)
* *build/app.min.css* - the css file to put in the help system html file

Note that you will still need to create your 'bridge' from within
your app.

If in doubt take a look at the help.js service in Sensei app.


## How it works

The help system is designed to be application agnostic: this means that any part
of the system is doing its work unknowngly about any other part of the system (
i.e. it is completely decoupled) and it does not make any assumptions about
the ways any other part is working (i.e. its based on signals instead of concrete API)

For example: in Sensei the triggering (activation/deactivation) is decided by the
Angular app itself. Then the command layer is activated and it walks the DOM tree
looking for 'data-intro' attributes which on Angular side do not have any meaning
and labels those found elements.

The labels are not attached to the Angular app, but instead in a separate tree,
allowing angular to still manage the DOM successfully. Clicking on the help
labels triggers signal to the help renderer, at this point the injected app
gives up control to the renderer app and does not know or care what is bing shown
in the same was as the renderer does not know or care who or how triggered the
signal. It only knows how to load and parse help files. The renderer also does not
know when or if it is visible - this is controlled by the bridge etc.

The help files themselves have very simple format:

* any text before the firs pound (#) symbol is considered 'introduction' and is expected to have common notions about the area currently visible to the user
* Each pound sign is expected to have one or more rows of text and is considered an indexed item

Indexed items are consequative. This the UI for labels is expected to have labels with
indexes up to the number of help items found in the file.

Sometimes the UI is more complex and items need to be indexed based on logic and not
their location in the DOM tree, thus we allow hardcoding the index.

Example:

```
<div data-intro="2">
  <div data-into="1">Some text</div>
</div>
```

In this case the labels will match the indexes found in the DOM. You need to index each item and
with he correct indexes (for example do not reuse index). If an index is skipped or reused the
system will still function, but not as you might expect.

Finally - if you manage the DOM via a library or expect to destroy DOM subtrees you need to
deactivate the help system as to allow it to remove the labels subtree before that and clean up
allocated references.

For a complete reference usage take a look at the sensei's frontend code.

## Design

The help system is split up in 3 parts:

* the help parser and renderer - runs in an IFrame and completely separated from the host application
* the help commander - runs in the context of the host app and is responsible for app specifics help UI
* the bridge - communicates intent to the commander using small API and is expected to be tweaked depending on the host app

### The parser / renderer

The renderer is expected to run in an IFrame and it uses the `postMessage`
APIs to receive commands on what should be loaded and displayed as help.
The commands are implemented as a protocol and the following commands are
avaiable:

* `location` - load a new help file
* `firsttime` - show the static 'first use' message
* `introduction` - show intro part of the currently loaded help file
* `index` - show indexed help from the currently loaded help file

Using only those 4 commands one can load location specific help files depending
on the URL of the host app and display commin help / intro or speicifc help item
depending on user actions or other domain specific needs without the help
renderer itself needeing to know - this it makes the renderer universal and
reusable in any context / app.

### The commander

The commander part of the app is designed to be more specific to the app. The
communication layer is hardcoded in this part, but the activation of any of the
commands is based on PUB/SUB architecture this allowing the configuration to
be made by extending the implementing class or simply by triggering the
publishing of the corresponding keys / events (as it is used in `inject.js`
and this making the layer tweakable and configurable more easily without
deeper understanding of the underlying systems).

Some app specific decisions made it into the code:

* how does 'first time visitor' greeted (based on client requirements)
* type of anmations / interactions hapenning related to the same 'first time greeing'

Other than that the commander layer is universal and pluggable in any project.
If need is found to replace the initial greeting (note that if it should be shown at all
is detedmined in the third 'bridge' layer and thus it caan be skipped/replaced)
once can extend / override the behaviors in 'control/help.js'.

The commander is executed in the context of the host app. It exposes several
calls (take a look at *inject.js*).

### The bridge

This part of the application is the glue between your app and the API triggers
exposed by the injectable core (the commander). This is intentional as not all
apps are expected to need help on every location change and not all app
routers work the same way - it is up to the app developer to decide when to
trigger any of the commands avaiable.

For a reference implementation you can take a look at 'services/help.js' in
SenseiFrontend project - the implementation is Angular 1* compatible and
fully utulizes the Help System.


