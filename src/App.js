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

  const markTaskComplete = (id) => {
    for (const task of tasks) {
      if (task.id === id) {
        if (task.isComplete) {
          return axios
            .patch(`${kBaseUrl}/tasks/${id}/mark_incomplete`)
            .then(updateTask(id))
            .catch((err) => {
              console.log(err);
            });
        } else if (!task.isComplete) {
          return axios
            .patch(`${kBaseUrl}/tasks/${id}/mark_complete`)
            .then(updateTask(id))
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
  };

  const updateTask = (id) => {
    const newTasks = [];
    for (const task of tasks) {
      const newTask = { ...task };
      if (newTask.id === id) {
        newTask.isComplete = !newTask.isComplete;
      }
      newTasks.push(newTask);
    }
    setTasks(newTasks);
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
            onToggleCompleteCallback={markTaskComplete}
            onDeleteCallback={deleteTask}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
