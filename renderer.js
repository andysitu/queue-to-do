console.log("HI");
const myNotification = new Notification('Title', {
  body: 'Notification from the Renderer process',
});

myNotification.onclick = () => {
  console.log('Notification clicked')
};

console.log(myNotification);

const {ipcRenderer} = require('electron');

ipcRenderer.invoke('test-it', {1: 4});