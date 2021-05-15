<script context="module">
  let monaco_promise;
  let _monaco;

  monaco_promise = import('./monaco.js');
  monaco_promise.then(mod => {
    _monaco = mod.default;
  })
</script>

<script>
  import { onMount } from 'svelte';

  let monaco;
  let container;
  let editor;
  export let value;
  export let language;

  console.log(language)

  onMount(() => {
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
</script>

<div class="monaco-container" bind:this={container} style="height: 100%; text-align: left">
</div>