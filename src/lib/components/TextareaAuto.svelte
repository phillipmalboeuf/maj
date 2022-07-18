<script>
	export let value = '';
	export let minRows = 1;
	export let maxRows
  export let id
  export let placeholder
  export let name
	export let required
	
	$: minHeight = `${1 + minRows * 1.2}em`;
	$: maxHeight = maxRows ? `${1 + maxRows * 1.2}em` : `auto`;
</script>

<div class="container">
	<pre
		aria-hidden="true"
		style="min-height: {minHeight}; max-height: {maxHeight}"
	>{value + '\n'}</pre>

	<textarea maxlength="50000" {id} {placeholder} {name} {required} bind:value></textarea>	
</div>

<style>
	.container {
		position: relative;
	}
	
	pre, textarea {
		width: 100%;
		white-space: pre-line;
		font-family: inherit;
		box-sizing: border-box;
		/* border: 1px solid #eee; */
		/* line-height: 1.2; */
		overflow: hidden;
	}
	
	textarea {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		resize: none;
	}
</style>