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
          todo_name TEXT,
          todo_create_date TEXT,
          old_todo_id INTEGER
        )`);
      db.run(`
        CREATE TABLE IF NOT EXISTS task 
          (
            task_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            task_name TEXT, 
            task_order INTEGER,
            task_done INT DEFAULT 0,
            task_create_date TEXT,
            task_complete_date TEXT,

            fk_todo_id INT,
            FOREIGN KEY(fk_todo_id) REFERENCES todo(todo_id) 
              ON DELETE CASCADE ON UPDATE CASCADE
          )`);
    });
  }
  return {
    load_data(rowData) {
      db.run("DELETE FROM todo");
      db.run("DELETE FROM task");
      let data, todo_order;
      const seenTodos = new Set();

      // First create the todos with new todo_ids 
      for (let i = 0; i < rowData.length; i++) {
        data = rowData[i];
        if (data.todo_id && !(seenTodos.has(data.todo_id))) {
          todo_order = data.todo_order ? data.todo_order : data.todo_id;
          seenTodos.add(data.todo_id)
          db.run(
            `INSERT INTO todo (todo_name, todo_order, todo_create_date, old_todo_id) 
              VALUES (?, ?, ?, ?);`, 
            [data.todo_name, todo_order, data.todo_create_date, data.todo_id]);
        }
      }
      for (let i = 0; i < rowData.length; i++) {
        data = rowData[i];
        if (data.task_id != null) {
          db.get(`SELECT * FROM todo WHERE old_todo_id = ?`, [data.todo_id], (err, row)=>{
            let todoData = rowData[i],
                task_order = todoData.task_order ? todoData.task_order : todoData.task_id;;
            db.run(`
              INSERT INTO task 
                (fk_todo_id, task_name, task_create_date, 
                  task_done, task_complete_date, task_order) 
                  VALUES (?, ?, ?, ?, ?, ?);`, 
              [row.todo_id, todoData.task_name, todoData.task_create_date, 
                todoData.task_done, todoData.task_complete_date, task_order]);
          });
        }
      }
    },
    check_db() {
      check_database();
    },
    create_todo(name, callback) {
      const date = new Date();
      db.run(`INSERT INTO todo (todo_name, todo_create_date) VALUES (?, ?);`, 
        [name, date.toISOString()]);
      db.get(`SELECT * FROM todo WHERE todo_id in
        (SELECT last_insert_rowid())`, (err, row) => {
        if (!err) {
          callback(row);
        }
      });
    },
    create_task(todo_id, task_name, callback) {
      const date = new Date();
      db.run(`
        INSERT INTO task 
          (fk_todo_id, task_name, task_create_date) VALUES (?, ?, ?);`, 
        [todo_id, task_name, date.toISOString()]);
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
    complete_task(task_id, task_done, callback) {
      db.run("UPDATE task SET task_done = ? WHERE task_id = ?", [task_done, task_id],
      () => {
        if (callback)
          callback();
      });

    }
  }
};