const {app,BrowserWindow,Menu, ipcMain, Tray} =  require('electron');
const path  = require('path');
const url = require('url');

const platform  = process.platform;

// choosing icon according to the paltform
const logoPath = platform == 'linux' ? '/assets/icon.png' : platform == 'win32' ? '/assets/icon.ico.ico':'/assets/spsd';

const  iconPath = path.join(__dirname,logoPath);
let mainWindow;
let excercisesWindow;
let excercisesOpen = false;

// Creating browser window
function createWindow(width,height){
        mainWindow = new BrowserWindow({
        // alwaysOnTop: true,
        width:500,
        height:600,
        resizable:false,
        webPreferences:{
            nodeIntegration:true,
            backgroundThrottling:false
        },
        icon:iconPath
    })

    // Preparing Tray Icon
    let appIcon = null;

    // Loading the html file
    mainWindow.loadFile('index.html');

    // Send into the tray on minimize
    mainWindow.on('minimize',(e)=>{
        if(platform!="linux"){
            e.preventDefault();
            appIcon = new Tray(iconPath);
            appIcon.setContextMenu(contextMenu);
    
            mainWindow.hide();
        }
        else{
        }

    });
    // Destroy tray on restoring
    mainWindow.on('restore',()=>{
        if(platform!='linux'){
            appIcon.destroy();
        }
        mainWindow.show();
    })

    mainWindow.on('quit',()=>{
        mainWindow = null;
    })
    mainWindow.on('show',()=>{
        // mainWindow.maximize();
    })
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
}

function createExcercisesWindow(){
    excercisesOpen = true;
    excercisesWindow = new BrowserWindow({
        width:1000,
        height:600,
        resizable:false,
        webPreferences:{
            nodeIntegration:true
        },
        icon:iconPath
    });

    excercisesWindow.loadFile('excercises.html');

    excercisesWindow.on('close',()=>{
        excercisesWindow = null;
        excercisesOpen = false;
    });
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

ipcMain.on('excercises:open',()=>{
    if(excercisesOpen){
       console.log('it is already open')
    }else{
        createExcercisesWindow();
    }

    excercisesOpen = true;
    
});

ipcMain.on('maximize:window',()=>{
    mainWindow.show();
    // mainWindow.maximize();
})

