const { resolve } = require('path');
const { app, Menu, Tray } = require('electron');

// app.dock.hide();

app.on('ready', () => {
  const tray =  new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio', checked: true }
  ]);

  tray.setContextMenu(contextMenu);
});


