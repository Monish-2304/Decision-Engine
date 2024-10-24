import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RuleEngine from "./pages/Home";
import RuleDetail from "./pages/RuleDetail";
import Rules from "./pages/Rules";
import axios from "axios";
import Navbar from "./components/Navbar";
import Help from "./pages/Help";
import { URLS } from "./constants/url.constants";

const App = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllRules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URLS.BASE_API_URL}/rules`);
      setRules(response.data.rules);
    } catch (error) {
      console.error("Error fetching rules:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllRules();
  }, []);
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<RuleEngine rules={rules} setRules={setRules} />}
          />
          <Route
            path="/rules"
            element={<Rules rules={rules} loading={loading} />}
          />
          <Route path="/help" element={<Help />} />
          <Route path="/rule/:id" element={<RuleDetail />} />{" "}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
