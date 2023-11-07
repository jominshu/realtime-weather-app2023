// STEP 1：載入 React 相關套件
import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";

// STEP 2：載入 CSS 和 React 元件
import "./index.css";
import App from "./App";

// STEP 3：將 React 元件和 HTML 互相綁定
ReactDOM.render(<App />, document.getElementById("root"));
