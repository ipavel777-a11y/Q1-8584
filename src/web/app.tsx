import { Route, Switch } from "wouter";
import Index from "./pages/index";
import MapPage from "./pages/map";
import { Provider } from "./components/provider";

function App() {
	return (
		<Provider>
			<Switch>
				<Route path="/" component={Index} />
				<Route path="/map" component={MapPage} />
			</Switch>
		</Provider>
	);
}

export default App;
