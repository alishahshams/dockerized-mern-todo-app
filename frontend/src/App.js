import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  // Load Todos
  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.log(err));
  }, []);

  // Add or Edit Todo
  const addTodo = async () => {
    if (task.trim() === "") return;

    try {
      if (editId) {
        // Update Todo
        const res = await fetch(`http://localhost:5000/todos/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task }),
        });

        const updatedTodo = await res.json();

        setTodos(
          todos.map((todo) =>
            todo._id === editId ? updatedTodo : todo
          )
        );

        setEditId(null);
      } else {
        // Add Todo
        const res = await fetch("http://localhost:5000/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task }),
        });

        const newTodo = await res.json();

        setTodos([...todos, newTodo]);
      }

      setTask("");
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
      });

      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <h1>Dockerized MERN Todo App</h1>

      <div className="input-box">
        <input
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <button onClick={addTodo}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {todo.task}

            <button
              onClick={() => {
                setTask(todo.task);
                setEditId(todo._id);
              }}
            >
              Edit
            </button>

            <button onClick={() => deleteTodo(todo._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;