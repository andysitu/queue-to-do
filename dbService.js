module.exports = function(db) {
  function check_database() {
    console.log("check_database");
    db.serialize(function() {
      // db.run("DROP TABLE if exists to_do");
      // db.run("DROP TABLE if exists todo");
      // db.run("DROP TABLE if exists task");
      db.run(`
        CREATE TABLE IF NOT EXISTS todo 
        (
          todo_id INTEGER PRIMARY KEY AUTOINCREMENT, 
          todo_order INTEGER,
          todo_name TEXT)`);
      db.run(`
        CREATE TABLE IF NOT EXISTS task 
          (
            task_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            task_name TEXT, 
            task_order INTEGER,
            task_done INT DEFAULT 0,

            fk_todo_id INT,
            FOREIGN KEY(fk_todo_id) REFERENCES todo(todo_id) 
              ON DELETE CASCADE ON UPDATE CASCADE
          )`);
    });
  }
  return {
    check_db() {
      check_database();
    },
    create_todo(name, callback) {
      db.run(`INSERT INTO todo (todo_name) VALUES (?);`, [name,]);
      db.get(`SELECT * FROM todo WHERE todo_id in
        (SELECT last_insert_rowid())`, (err, row) => {
        if (!err) {
          callback(row);
        }
      });
    },
    create_task(todo_id, task_name, callback) {
      db.run(`INSERT INTO task (fk_todo_id, task_name) VALUES (?, ?);`, 
        [todo_id, task_name]);
      db.get(` SELECT * FROM task WHERE task_id in
              (SELECT last_insert_rowid())`, (err, row) => {
        if (!err) {
          callback(row);
        }
      });
    },
    get_todos(callback) {
      db.all(`SELECT todo.*, task.* FROM todo
        LEFT JOIN task on task.fk_todo_id = todo.todo_id`, (err, rows) => {
        if (callback) {
          callback(rows);
        }
      });
    },
    edit_todo(todo_id, property, value) {
      // Note: Can only use ? for parameter values
      if (property == "name") {
        db.run("UPDATE todo SET todo_name = ? WHERE todo_id = ?", [value, todo_id]);
      }
    },
    edit_task(task_id, property, value) {
      if (property == "name") {
        db.run("UPDATE task SET task_name = ? WHERE task_id = ?", [value, task_id]);
      }
    },
    delete_todo(todo_id) {
      db.run("DELETE FROM todo WHERE todo_id = ?", todo_id);
    },
    delete_all() {
      db.run("DELETE FROM todo");
    },
    delete_task(task_id) {
      db.run("DELETE FROM task WHERE task_id = ?", task_id);
    },
    switch_tasks(task1_id, task2_id, callback) {
      db.get(`SELECT * FROM task WHERE task_id = ?`, task1_id, 
        (err, row1)=> {
          db.get(`SELECT * FROM task WHERE task_id = ?`, task2_id,
            (err, row2) => {
              const task1_order = (row2.task_order == null) ? 
                row2.task_id  : row2.task_order;
              const task2_order = (row1.task_order == null) ? 
                row1.task_id  : row1.task_order;
              db.run(`UPDATE task SET task_order = ? WHERE task_id = ?`, [task1_order, task1_id]);
              db.run(`UPDATE task SET task_order = ? WHERE task_id = ?`, [task2_order, task2_id]);
              callback();
            });
        });
    },
  }
};