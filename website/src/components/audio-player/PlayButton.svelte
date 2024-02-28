<script>
	import { status, isPlaying, audioPlayer, index, trackList, addTrack } from '$lib/stores.js';
	import Icon from '@iconify/svelte';

	export let controls = false;
	export let track = false;
	export let title = '';
	export let artist = '';
	export let file = '';

	function playTrack() {
		$audioPlayer.play();
		$isPlaying = true;
	}

	function pauseTrack() {
		$audioPlayer.pause();
		$isPlaying = false;
	}

	function loadTrack($index) {
		title = $trackList[$index].title;
		artist = $trackList[$index].artist;
		$audioPlayer.src = $trackList[$index].file;
		$audioPlayer.load();
	}

	function addAndPlayTrack() {
		addTrack({ title, artist, file });
		$index = $trackList.length - 1;
		// 		$currentTime = 0;
		// Load and play the new track
		loadTrack($index);
		playTrack();
	}
</script>

{#if controls}
	{#if $isPlaying === false}
		<button class="play-button controls text-xl bg-rose-600 text-white" on:click={playTrack}>
			<Icon icon="iconoir:play-solid" />
		</button>
	{:else if $isPlaying === true && ($status === 'waiting' || $status === 'loading' || $status === 'can play some' || $status === 'can play all')}
		<button class="play-button controls text-xl bg-rose-600 text-white" on:click={pauseTrack}>
			<Icon icon="line-md:loading-loop" />
		</button>
	{:else if $isPlaying === true}
		<button class="play-button controls text-xl bg-rose-600 text-white" on:click={pauseTrack}>
			<Icon icon="iconoir:pause-solid" />
		</button>
	{/if}
{:else if track}
	{#if title !== $trackList[$index].title}
		<button class="play-button track text-2xl bg-white" on:click={addAndPlayTrack}>
			<Icon icon="iconoir:play-solid" />
		</button>
	{:else if title === $trackList[$index].title && $isPlaying === true && ($status === 'loading' || $status === 'can play some' || $status === 'can play all' || $status === 'waiting')}
		<button class="play-button track playing text-2xl bg-white" on:click={pauseTrack}>
			<Icon icon="line-md:loading-loop" />
		</button>
	{:else if title === $trackList[$index].title && $isPlaying === true}
		<button class="play-button track playing text-2xl bg-white" on:click={pauseTrack}>
			<Icon icon="iconoir:pause-solid" />
		</button>
	{:else if title === $trackList[$index].title && $isPlaying === false}
		<button class="play-button track playing text-2xl bg-white" on:click={playTrack}>
			<Icon icon="iconoir:play-solid" />
		</button>
	{/if}
{/if}

<style>
	.play-button {
		margin: 0;
		padding: 0;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4rem;
		border: 1px solid transparent;
	}

	.controls {
		width: 2.5rem;
		height: 2.5rem;
	}

	.track {
		width: 2.5rem;
		height: 2.5rem;
	}

	.playing {
		border: 1px solid #000;
	}
</style>
