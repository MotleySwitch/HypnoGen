import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { SearchProvider } from "./util/useQuery"

ReactDOM.render(<SearchProvider><App /></SearchProvider>, document.getElementById("root"))

if (import.meta.hot) {
  import.meta.hot.accept()
}
