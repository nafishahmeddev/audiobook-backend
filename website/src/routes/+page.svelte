<script>
	import Track from 'src/components/audio-player/Track.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<Track
		title="Gymnop�die no. 1"
		artist="Erik Satie"
		file="https://sveltejs.github.io/assets/music/satie.mp3"
	/>

	<Track
		title="Mars, the Bringer of War"
		artist="Gustav Holst"
		file="https://sveltejs.github.io/assets/music/holst.mp3"
	/>

	<Track
		title="The Blue Danube Waltz"
		artist="Johann Strauss"
		file="https://sveltejs.github.io/assets/music/strauss.mp3"
	/>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
