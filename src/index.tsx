import "core-js/stable"
import "regenerator-runtime/runtime"

import React from "react"
import ReactDOM from "react-dom/client"

import Scaffold from "./Scaffold"

const App = React.lazy(() => import("./App"))

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
  <Scaffold>
      <App />
  </Scaffold>, 
)
