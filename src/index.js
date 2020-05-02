import React from "react"
import ReactDOM from "react-dom"
import "./Styles/index.scss"
import App from "./App"
import {BrowserRouter, withRouter} from "react-router-dom"
import serviceWorker from "./serviceWorker"

const WrappedApp = withRouter(App)

ReactDOM.render(<React.StrictMode><BrowserRouter><WrappedApp/></BrowserRouter></React.StrictMode>, document.getElementById("root"))

serviceWorker()