<script>
	import './styles.css';
	import Controls from 'src/components/audio-player/Controls.svelte';
	import { register } from 'swiper/element/bundle';
	register();
</script>

<div class="h-screen flex flex-col">
	<main class="flex-1 overflow-auto">
		<slot />
	</main>
	<Controls />
</div>
