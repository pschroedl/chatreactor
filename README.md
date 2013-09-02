# ChatReactor
Simple IRC bot for Hack Reactor's IRC channel, irc.freenode.com#hackreactor.
Built to be configurable and extensible, so it could be used anywhere.

## Modules
Put a module subdirectory in the `app/modules` folder, with the file you'd like
to export named as `main.js`. The function exported from this file will be
executed when the module is imported.

## Todo
This readme, obviously! ('Sparse' would be a kind word.)

## Credits
I took a great deal of inspiration from Marke Hallowell's
[nodebot](https://github.com/indiefan/nodebot); in particular, Marke's module
system.
