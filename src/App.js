import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList.js';
import './App.css';
// import tasksJson from './data/tasks.json';
import axios from 'axios';

const kBaseUrl = 'http://localhost:5000';

const taskApiToJson = (cat) => {
  const { id, title, is_complete: isComplete } = cat;
  return { id, title, isComplete };
};

const getTasks = () => {
  return axios
    .get(`${kBaseUrl}/tasks`)
    .then((response) => {
      return response.data.map(taskApiToJson);
    })
    .catch((err) => {
      console.log(err);
    });
};

const markTaskComplete = (id) => {
  return (
    axios
      .patch(`${kBaseUrl}/tasks/${id}/mark_complete`)
      // .then((response) => {
      //   return taskApiToJson(response.data);
      // })
      .catch((err) => {
        console.log(err);
      })
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const updateTasks = () => {
    getTasks().then((tasks) => {
      setTasks(tasks);
    });
  };

  useEffect(() => {
    updateTasks();
  }, []);

  const updateTask = (id) => {
    markTaskComplete(id).then((updatedTask) => {
      setTasks((oldData) => {
        return oldData.map((task) => {
          if (task.id === id) {
            return updatedTask;
          } else {
            return task;
          }
        });
      });
    });
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);

    setTasks(newTasks);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main>
        <div>
          <TaskList
            tasks={tasks}
            onToggleCompleteCallback={updateTask}
            onDeleteCallback={deleteTask}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
