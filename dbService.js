module.exports = function(db) {
  function check_database() {
    console.log("check_database");
    db.serialize(function() {
      db.run(`
        CREATE TABLE IF NOT EXISTS to_do 
          (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`);
    });
  }
  return {
    check_db() {
      check_database();
    },
    create_todo(name) {
      db.run(`INSERT INTO to_do (name) VALUES (?)`, [name,]);
    },
    get_todos() {

    },
    delete_all() {
      db.run("DELETE FROM to_do");
    },
  }
};