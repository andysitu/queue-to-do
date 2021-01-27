module.exports = function(db) {
  function check_database() {
    console.log("check_database");
    db.serialize(function() {
      // db.run("DROP TABLE if exists to_do");
      // db.run("DROP TABLE if exists todo");
      // db.run("DROP TABLE if exists task");
      db.run(`
        CREATE TABLE IF NOT EXISTS todo 
          (todo_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`);
      db.run(`
        CREATE TABLE IF NOT EXISTS task 
          (
            task_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT, 
            todo_id INT,
            note TEXT,
            FOREIGN KEY(todo_id) REFERENCES todo(id) 
              ON DELETE CASCADE ON UPDATE CASCADE
          )`);
    });
  }
  return {
    check_db() {
      check_database();
    },
    create_todo(name, callback) {
      db.run(`INSERT INTO todo (name) VALUES (?);`, [name,]);
      db.get(`SELECT * FROM todo WHERE todo_id in
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
      db.all(`SELECT * FROM todo
        LEFT JOIN task on task.todo_id = todo.todo_id`, (err, rows) => {
        if (callback) {
          console.log(rows);
          callback(rows);
        }
      });
    },
    edit_todo(todo_id, property, value) {
      // Note: Can only use ? for parameter values
      if (property == "name")
        db.run("UPDATE todo SET name = ? WHERE id = ?", [value, todo_id]);
    },
    delete_todo(todo_id) {
      db.run("DELETE FROM todo WHERE id = ?", todo_id);
    },
    delete_all() {
      db.run("DELETE FROM todo");
    },
  }
};