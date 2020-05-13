const { resolve, basename } = require('path');
const {
  app, Menu, Tray, dialog,
} = require('electron');
const spawn = require('cross-spawn');
const Store = require('electron-store');
const Sentry = require('@sentry/electron');

Sentry.init({ dsn: 'https://efb4f40958394270a31b9cfb1d0043cb@o357269.ingest.sentry.io/5238519' });

const schema = {
  projects: {
    type: 'string',
  },
};

const store = new Store({ schema });

let tray = null;

function render() {
  // if (!tray.isDestroyed()) {
  //   tray.destroy();
  //   tray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));
  // }

  const storedProjects = store.get('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : [];
  // store.clear();

  const items = projects.map(({ name, path }) => ({
    label: name,
    submenu: [
      {
        label: 'Abrir no VSCode',
        click: () => {
          spawn('code', [path], { stdio: 'inherit' });
        },
      },
      {
        label: 'Remover',
        click: () => {
          store.set('projects', JSON.stringify(projects.filter((item) => item.path !== path)));
          render();
        },
      },
    ],

    // Menu.getApplicationMenu().append(new MenuItem({ label: 'Agora' }));
  }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Adicionar novo projeto...',
      click: () => {
        dialog.showOpenDialog({ properties: ['openDirectory'] })
          .then((file) => store.set('projects', JSON.stringify([...projects, {
            path: file.filePaths.join(),
            name: basename(file.filePaths.join()),
          }])));
        render();
      },
    },
    {
      type: 'separator',
    },
    ...items,
    {
      type: 'separator',
    },
    {
      type: 'normal',
      label: 'Fechar Code Tray',
      role: 'quit',
      enabled: true,
    },
  ]);

  tray.setContextMenu(contextMenu);
}

app.on('ready', () => {
  tray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));

  render();
});
