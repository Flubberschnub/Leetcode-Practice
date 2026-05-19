import React from "react";
import { createRoot } from "react-dom/client";
import LeetCodeReviewPlanner from "../leetcode_review_planner.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LeetCodeReviewPlanner />
  </React.StrictMode>
);
