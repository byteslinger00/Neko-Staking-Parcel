import React from "react";
import ReactDOM from "react-dom";
// import App from './App'
import Home from "./pages/Home";

import "react-toastify/dist/ReactToastify.css";
import { initContract } from "./utils";
import "./styles/global.scss";
import "intro.js/introjs.css";
// Importing the Bootstrap CSS
// import 'bootstrap/dist/css/bootstrap.min.css';

window.nearInitPromise = initContract()
	.then(() => {
		ReactDOM.render(
			// <App />,
			<Home />,
			document.querySelector("#root")
		);
	})
	.catch(console.error);
