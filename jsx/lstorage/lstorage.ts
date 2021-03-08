const fs = require('fs');
const crypto = require("crypto");

interface TodoState {
  showMultipleTasks: boolean,
  todo_id: number,
}

const lstorage = {
  session_apiKey: "apiKey",
  session_clientId: "clientId",
  todo_settings_key: "todo_settings",
  gApiFilename: "g_settings.json",
  saveSettingsFromTodoList(todo_list: Array<TodoState>) {
    let settings = {};
    todo_list.forEach(todo => {
      settings[todo.todo_id] ={};
      settings[todo.todo_id].showMultipleTasks = todo.showMultipleTasks;
    });
    localStorage.setItem(this.todo_settings_key, JSON.stringify(settings));
  },
  saveSettings(settings) {
    localStorage.setItem(this.todo_settings_key, JSON.stringify(settings));
  },
  getSettings() {
    return JSON.parse(localStorage.getItem(this.todo_settings_key));
  },
  /**
   * Saves Google API Credentials to session.
   * @param {String} clientId client ID of Google API Key
   * @param {String} apiKey Api Key of Google API key
   */
  loadGCredentialsToSession(clientId, apiKey) {
    sessionStorage.setItem(this.session_apiKey, apiKey);
    sessionStorage.setItem(this.session_clientId, clientId);
  },
  /**
   * Loads Google API Credentials from Session Storage and returns it
   * @returns {Object} Object with keys clientId, apiKey
   */
  getGCredentials() {
    let clientId = sessionStorage.getItem(this.session_clientId),
        apiKey = sessionStorage.getItem(this.session_apiKey);
    if (clientId && apiKey) {
      return {
        clientId: clientId, apiKey: apiKey
      };
    }
    return null;
  },
  /**
   * Reads Google Credentials from file & loads it to Session Storage
   * via using loadGCredentialsToSession.
   */
  loadGCredentials() {
    let that = this;
    fs.readFile(this.gApiFilename, {encoding: 'utf-8'}, function(err, jsonData) {
      // console.log(jsonData)
      if (jsonData) {
        let data = JSON.parse(jsonData);
        if (data.apiKey && data.clientId) {
          that.loadGCredentialsToSession(data.clientId, data.apiKey);
        }
      }
    });
  },
  /**
   * Saves Google API Credentials to file with filename specified by
   * gApiFileName proprety.
   * @param data API credential data, converted to JSON
   * @param callback callback to run once finished
   */
  saveGCredentials(data, callback) {
    if (data.apiKey && data.clientId && data.password) {
      if (!callback) {
        callback = ()=>{};
      }
      let o = {...data};
      delete o.password;
      console.log(data);
      let resizedIV = Buffer.allocUnsafe(16),

          iv = crypto
            .createHash("sha256")
            .update("myHashedIV")
            .digest();
      iv.copy(resizedIV);
      o = JSON.stringify(o)
      console.log(o);
      console.log(typeof o)

      // o = "hello";

      const key = crypto
                    .createHash("sha256")
                    .update(data.password)
                    .digest(),
            cipher = crypto.createCipheriv("aes-256-cbc", key, resizedIV);

      let hashedMsg = cipher.update(o, "binary", "hex") + cipher.final("hex");
      console.log(hashedMsg);

      resizedIV = Buffer.allocUnsafe(16),

      iv = crypto
        .createHash("sha256")
        .update("myHashedIV")
        .digest();
      iv.copy(resizedIV);

      const decipher = crypto.createDecipheriv("aes-256-cbc", key, resizedIV);
      
      console.log(decipher.update(hashedMsg, "hex", "binary") + decipher.final("binary"))

      // fs.writeFile(this.gApiFilename, JSON.stringify(data), 'utf-8', callback);
    }
  },
  loadGData() {
    const gCredentials = lstorage.getGCredentials();
    console.log(gCredentials)
  }
};