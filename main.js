const {app,BrowserWindow,Menu, ipcMain, Tray} =  require('electron');
const path  = require('path');
const url = require('url');

var iconPath = path.join(__dirname,'./assets/icon.ico.ico');

let mainWindow;

// Creating browser window
function createWindow(width,height){
        mainWindow = new BrowserWindow({
        alwaysOnTop: true,
        width:800,
        height:600,
        webPreferences:{
            nodeIntegration:true,
            backgroundThrottling:false
        },
        icon:iconPath
    })

    // Seting Tray
    let appIcon = null;

    // Loading the html file
    mainWindow.loadFile('index.html');

    // Send into the tray on minimize
    mainWindow.on('minimize',(e)=>{
        e.preventDefault();
        appIcon = new Tray(iconPath);
        appIcon.setContextMenu(contextMenu);

        mainWindow.hide();

    });
    // Destroy tray on restoring
    mainWindow.on('restore',()=>{
        appIcon.destroy();
        mainWindow.show();
    })

    mainWindow.on('quit',()=>{
        mainWindow = null;
    })
    mainWindow.on('show',()=>{
        mainWindow.maximize();
    })
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
}

app.whenReady().then(createWindow);


var contextMenu = Menu.buildFromTemplate([
    {
        label: 'Show App', click: function () {
            mainWindow.show()
        }
    },
    {
        label: 'Quit', click: function () {
            app.isQuiting = true
            app.quit()
        }
    }
]);

const mainMenuTemplate = [
    {
        label:'file',
        submenu:[
            {
                label:'EXIT',
                accelerator: process.platform == "darwin" ? `Command+Q` : `Ctrl+Q`,
                click(){
                    app.quit()
                }
            }
        ]
        
    },
    {
        label:'Developer Tools',

        submenu:[
            {
                label:'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? `Command+I` : `Ctrl+I`,

                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:`reload`
            }
        ]
    }
]


ipcMain.on('hide:window',()=>{
    mainWindow.hide();
});

ipcMain.on('maximize:window',()=>{
    mainWindow.show();
    mainWindow.maximize();
})

