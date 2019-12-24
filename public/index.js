const log = console.log;

// import {h, app} from 'hyperapp'

const hyperapp = require('hyperapp')

app({
  init: 0,
  view: state =>
    h("main", {}, [
      h("h1", {}, state),
      h("button", { onClick: state => state - 1 }, "-"),
      h("button", { onClick: state => state + 1 }, "+")
    ]),
  node: document.getElementById("app")
})