const { resolve, basename } = require('path');
const {
  app, Menu, Tray, dialog, MenuItem,
} = require('electron');
const Store = require('electron-store');
const spawn = require('cross-spawn');

const schema = {
  projects: {
    type: 'string',
  },
};

const store = new Store({ schema });

let tray = null;

function render() {
  if (!tray.isDestroyed()) {
    tray.destroy();
    tray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));
  }

  const storedProjects = store.get('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : [];
  // store.clear();

  const items = projects.map((project) => ({
    label: project.name,
    click: () => {
      spawn('code', [project.path], { stdio: 'inherit' });
      // Menu.getApplicationMenu().append(new MenuItem({ label: 'Agora' }));
    },
  }));

  const contextMenu = Menu.buildFromTemplate([
    ...items,
    // {
    //   type: 'separator',
    // },
  ]);

  contextMenu.insert(0, new MenuItem({
    label: 'Adicionar novo projeto...',
    click: () => {
      dialog.showOpenDialog({ properties: ['openDirectory'] })
        .then((file) => store.set('projects', JSON.stringify([...projects, {
          path: file.filePaths.join(),
          name: basename(file.filePaths.join()),
        }])));
      render();
    },
  }));

  tray.setContextMenu(contextMenu);
}

app.on('ready', () => {
  tray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));

  render();
});
