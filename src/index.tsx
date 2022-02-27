import "core-js/stable"
import "regenerator-runtime/runtime"

import React from "react"
import ReactDOM from "react-dom"

import Scaffold from "./Scaffold"

const App = React.lazy(() => import("./App"))

ReactDOM.render(
  <Scaffold>
      <App />
  </Scaffold>, document.getElementById("root")
)
