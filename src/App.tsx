import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Autocomplete from "./components/autocomplete/Autocomplete";

function App() {
	return (
		<div className="App">
			<main>
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h3>Search for names</h3>
					<Autocomplete />
				</div>
			</main>
		</div>
	);
}

export default App;
