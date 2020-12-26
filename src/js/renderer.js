var myNotification = new Notification('Title', {
  body: 'Notification from the Renderer process'
});

myNotification.onclick = function () {
  console.log('Notification clicked');
};

console.log(myNotification);

var _require = require('electron'),
    ipcRenderer = _require.ipcRenderer;

ipcRenderer.send('test-it', { 1: 4 });
ipcRenderer.on('test-it', function (event, data) {
  console.log(data);
});