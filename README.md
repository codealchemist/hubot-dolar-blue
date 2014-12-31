hubot-dolar-blue
================

A hubot who knows about the argentinian dolar blue market.
It will give you up to date rates based on several sources, including dolarblue.net, right inside your chat.

### Commands
- `jarvis db` or `jarvis dolarblue`: Will output a string with rates obtained using dolar-blue package.
- `jarvis dbn`: Will get the latest dolar blue rates published by dolarblue.net.
- `jarvis dbn.all`: Will get the latest rates published by dolarblue.net (includes currencies and values other than dolar blue).

Note: "jarvis" is the name I've gave to my bot, you should change that to whatever you like.
Commands can be executed without the need to prepend the name of the bot when sending direct messages to it (db, dbn, etc.).

### Install
Goto your hubot root directory and run:

`npm install hubot-dolar-blue --save`

Update your `external-scripts.json` file adding _hubot-dolar-blue_ to the array.

Also, you'll need to have _imagemagick_ installed on your system.

`apt-get install imagemagick`

To run `dbn` you'll need to edit `src/index.js` and change the following vars:
- `imagesPath`: path with write permissions where images will be downloaded.
- `croppedImageUrl`: URL where you serve your cropped image (it's a crop from the original rates image provided by dolarblue.net).
