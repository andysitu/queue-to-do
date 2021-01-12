module.exports = function(db) {
  function check_database() {
    db.serialize(function() {
      db.run(`
        CREATE TABLE IF NOT EXISTS to_do 
          (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`);
    });
  }
  return {
    check() {
      console.log("check");
      console.log(db);
    },
    create_todo(name) {
      console.log("create " + name);
    }
  }
};