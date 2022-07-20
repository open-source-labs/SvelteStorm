<script>

import define from './636c57cd4c8f785e@309.js'

import {Runtime, Library, Inspector} from "./runtime.js";
const runtime = new Runtime();
const main = runtime.module(define.default, name => {
    // if (name === "chart"){return Inspector.into(document.body)()}
    if (name === "chart"){return Inspector.into(document.querySelector('#daChart'))()}
  });

</script>

<main>
  <body>
    <div id="daChart">

    </div>
  
  </body>
</main>