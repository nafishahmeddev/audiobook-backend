<script>
	export let value;
	export let max;
	export let min;
	export let step;

	$: hovered = false;
	$: interacting = false;
	const handleInteractStart = (_evt) => {
		interacting = true;
	};

	const handleInteractEnd = (_evt) => {
		handleInteractMove(_evt);
		interacting = false;
	};

	const handleInteractMove = (_evt) => {
		if (interacting) {
			console.log(_evt);
			const precentage = _evt.offsetX / _evt.target.clientWidth;
			value = precentage * max;
		}
	};

	const handleHover = (_evt) => {
		hovered = true;
	};

	const handleBlur = (_evt) => {
		hovered = false;
	};
</script>

<div class="w-full">
	<input type="range" bind:value {max} {min} {step} class="w-full hidden" />
	<div
		class=" w-screen h-[3px] relative bg-stone-200"
		on:touchstart|preventDefault={handleInteractStart}
		on:mousedown={handleInteractStart}
		on:touchend|preventDefault={handleInteractEnd}
		on:mouseup={handleInteractEnd}
		on:mousemove={handleInteractMove}
		on:focus={console.log}
		on:mouseover={handleHover}
		on:blur={handleBlur}
		role="presentation"
	>
		<div
			class="progress h-full bg-red-600 relative pointer-events-none"
			style={`width: ${(value / max) * 100}%;`}
		/>
	</div>
</div>

<style>
	.progress::after {
		content: '';
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		height: 300%;
		aspect-ratio: 1 / 1;
		background-color: inherit;
		border-radius: 10px;
	}
</style>
