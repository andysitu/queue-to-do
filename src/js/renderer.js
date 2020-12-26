var myNotification = new Notification('Title', {
  body: 'Notification from the Renderer process'
});

myNotification.onclick = function () {
  console.log('Notification clicked');
};

console.log(myNotification);