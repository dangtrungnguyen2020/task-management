import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Login from "./components/auth/Login";
import AllTask from "./components/project/AllTask";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications
import type JSX = require("react");
import AllProject from "./components/project/AllProject";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer />
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/projects" element={<AllProject />} />
            <Route path="/projects/:projectId/tasks" element={<AllTask />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
