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
    create_todo(name, callback) {
      db.run(`INSERT INTO to_do (name) VALUES (?);`, [name,]);
      db.get(`SELECT * FROM to_do WHERE id in
        (SELECT last_insert_rowid())`, (err, row) => {
        if (!err) {
          callback(row);
        }
      });
    },
    create_task(todo_id, task_name, task_note, callback) {
      db.run(`INSERT INTO task (todo_id, name, note) VALUES (?, ?, ?);`, 
        [todo_id, task_name, task_note]);
      db.get(` SELECT * FROM task WHERE id in
              (SELECT last_insert_rowid())`, (err, row) => {
        if (!err) {
          callback(row);
        }
      });
    },
    get_todos(callback) {
      db.all(`SELECT * FROM to_do`, (err, rows) => {
        if (callback) {
          callback(rows);
        }
      });
    },
    edit_todo(todo_id, property, value) {
      // Note: Can only use ? for parameter values
      if (property == "name")
        db.run("UPDATE to_do SET name = ? WHERE id = ?", [value, todo_id]);
    },
    delete_todo(todo_id) {
      db.run("DELETE FROM to_do WHERE id = ?", todo_id);
    },
    delete_all() {
      db.run("DELETE FROM to_do");
    },
  }
};