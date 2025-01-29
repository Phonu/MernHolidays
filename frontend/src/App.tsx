import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Layout from "./layouts/layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <p>Home Page</p>
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <p>Serach Page</p>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
