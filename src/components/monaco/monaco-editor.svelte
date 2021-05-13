<script context="module">
  let monaco_promise;
  let _monaco;

  monaco_promise = import('./monaco.js');
  monaco_promise.then(mod => {
    _monaco = mod.default;
  })
</script>

<script>
  import { afterUpdate, onMount } from 'svelte';

  let monaco;
  let container;
  let editor;
  export let value;
  export let language;

  console.log(language)

  onMount(() => {
    console.log(language)
		if (_monaco) {
      monaco = _monaco;
      editor = monaco.editor.create(
        container,
        {
            value: value.join("\n"),
            language: `${language}`
          }
      )
		} else {
      console.log('VALUE', value)
			monaco_promise.then(async mod => {
        monaco = mod.default;
        editor = monaco.editor.create(
          container,
          {
            value: value.join("\n"),
            language: `${language}`
          }
        )
			});
		}
		return () => {
      console.log('destroyed')
			destroyed = true;
		}
  });

  afterUpdate(() => {
    console.log('update');
	})
</script>

<div class="monaco-container" bind:this={container} style="height: 500px; text-align: left">
</div>