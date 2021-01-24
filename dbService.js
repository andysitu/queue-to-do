module.exports = function(db) {
  function check_database() {
    console.log("check_database");
    db.serialize(function() {
      db.run(`
        CREATE TABLE IF NOT EXISTS to_do 
          (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`);
      db.run(`
        CREATE TABLE IF NOT EXISTS task 
          (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT, 
            todo_id INT,
            note TEXT,
            FOREIGN KEY(todo_id) REFERENCES to_do(id) 
              ON DELETE CASCADE ON UPDATE CASCADE
          )`);
    });
  }
  return {
    check_db() {
      check_database();
    },
    create_todo(name) {
      db.run(`INSERT INTO to_do (name) VALUES (?)`, [name,]);
    },
    create_task(todo_id) {
      console.log(todo_id);
    },
    get_todos(callback) {
      db.all(`SELECT * FROM to_do`, (err, rows) => {
        if (callback) {
          callback(rows);
        }
      });
    },
    delete_all() {
      db.run("DELETE FROM to_do");
    },
  }
};