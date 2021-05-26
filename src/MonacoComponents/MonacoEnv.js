import { webWorker } from "@decoupled/magic"
import monaco from "monaco-editor"

const BASE = "./monaco-editor/esm/vs/"
// let's create a set of magic.webWorkers
// all they do once loaded is import the actual web worker code
// provided in the monaco-editor package
const json = webWorker(() => import(BASE + "language/json/json.worker"))
const editor = webWorker(() => import(BASE + "editor/editor.worker"))
const css = webWorker(() => import(BASE + "language/css/css.worker"))
const html = webWorker(() => import(BASE + "language/html/html.worker"))
const ts = webWorker(() => import(BASE + "language/typescript/ts.worker"))

const allWorkers = { editor, json, css, html, typescript: ts, javascript: ts }

// we extracted the base of the paths above to make our code more readable
// magic can handle this ;)


// let's make this right and encapsulate this in a function
// we can use it from a magic.spa, magic.static, or magic.electron app
export function initMonaco(container, opts = {}) {
  // since this function can be called multiple times now
  // we don't want to setup the environment twice
  if (!self.MonacoEnvironment) {
    self.MonacoEnvironment = {
      getWorkerUrl(_, label) {
        // each magic.webWorker exposes a URL property
        // which points to the js bundle at runtime
        // that's exactly what we need
        return allWorkers[label] ? allWorkers[label].url : editor.url
      }
    }
  }
  return;
}