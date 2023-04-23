import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { PageTemplate } from "./components/page-template";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<PageTemplate />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
