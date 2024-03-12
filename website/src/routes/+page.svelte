<script>
	import { queue } from '../lib/stores';
	import { onMount } from 'svelte';
	import { siteURL } from '../lib/utilities';
	import TrackSquare from '../components/TrackSquare.svelte';
	import Track from '../components/audio-player/Track.svelte';
	$: promise = null;

	const loadHomePage = () => {
		promise = fetch(siteURL('/home')).then((res) => res.json());
	};

	onMount(() => {
		loadHomePage();
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="p-3 w-full">
	<button on:click={loadHomePage}>Reload</button>
	{#await promise}
		<p>Please wait while loading....</p>
	{:then resp}
		<div class="w-full">
			<h3>Top Charts</h3>
			<swiper-container
				slides-per-view="auto"
				mousewheel-force-to-axis="true"
				space-between="25"
				class="items-stretch"
			>
				{#each resp?.result?.tracks ?? [] as track}
					<swiper-slide style="width: 150px;"><TrackSquare {track} /></swiper-slide>
				{/each}
			</swiper-container>
		</div>
	{:catch err}
		<p>Something went wrong</p>
	{/await}

	{#each $queue as track}
		<Track {track} />
	{/each}
</section>
