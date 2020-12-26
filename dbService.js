module.exports = function(db) {
  function check_database() {
    db.serialize(function() {
      db.run("CREATE TABLE IF NOT EXISTS some_table (id INTEGER PRIMARY KEY AUTOINCREMENT)");
    });
  }
  return {
    check() {
      console.log("check");
      console.log(db);
    },
    create_todo() {
      console.log("create");
    }
  }
};