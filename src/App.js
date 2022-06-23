import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList.js';
import './App.css';
import axios from 'axios';

const kBaseUrl = 'http://localhost:5000';

const taskApiToJson = (task) => {
  const { id, title, is_complete: isComplete } = task;
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

const removeTask = (id) => {
  return axios.delete(`${kBaseUrl}/tasks/${id}`).catch((err) => {
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

  const markTask = (id) => {
    let route = '';
    for (const task of tasks) {
      if (task.id === id) {
        if (task.isComplete) {
          route = 'mark_incomplete';
        } else if (!task.isComplete) {
          route = 'mark_complete';
        }
        return axios
          .patch(`${kBaseUrl}/tasks/${id}/${route}`)
          .then(updateTask(id))
          .catch((err) => {
            console.log(err);
          });
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
    removeTask(id).then(() => {
      setTasks((oldData) => {
        return oldData.filter((task) => {
          return task.id !== id;
        });
      });
    });
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
            onToggleCompleteCallback={markTask}
            onDeleteCallback={deleteTask}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
