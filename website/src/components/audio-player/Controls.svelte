<script>
	import { status, isPlaying, audioPlayer, currentTrack, queue } from '$lib/stores.js';
	import { format } from '$lib/utilities.js';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import RangeSlider from '../RangeSlider.svelte';

	let duration = 0;
	let currentTime = 0;
	let formattedTime = format(currentTime);
	let paused = true;
	let volume = 0.5;

	function playTrack() {
		$isPlaying = true;
		$audioPlayer.play();
	}

	function pauseTrack() {
		$audioPlayer.pause();
		$isPlaying = false;
	}

	function previousTrack() {
		$isPlaying = false;
		currentTime = 0;
		let currentIndex = $queue.findIndex((e) => e._id == $currentTrack._id);
		let t;
		if (currentIndex == 0) return false;
		if (currentIndex > 0) t = $queue[currentIndex - 1];
		$currentTrack = t;
	}

	function nextTrack() {
		$isPlaying = false;
		currentTime = 0;
		let currentIndex = $queue.findIndex((e) => e._id == $currentTrack._id);
		let t;
		if (currentIndex < $queue.length - 1) {
			t = $queue[currentIndex + 1];
		} else {
			return false;
		}
		$currentTrack = t;
	}

	onMount(() => {
		$audioPlayer && $audioPlayer.load();
		currentTrack.subscribe(() => {
			$audioPlayer.src = $currentTrack.audioUrl;
			$audioPlayer.load();
			$isPlaying = true;
			$audioPlayer.play();
		});
	});
</script>

<audio
	bind:this={$audioPlayer}
	bind:duration
	bind:currentTime
	bind:paused
	bind:volume
	on:canplay={() => ($status = 'can play some')}
	on:canplaythrough={() => ($status = 'can play all')}
	on:waiting={() => ($status = 'waiting')}
	on:timeupdate={() => ($status = 'playing')}
	on:seeking={() => ($status = 'seeking')}
	on:ended={() => {
		$isPlaying = false;
		currentTime = 0;
	}}
	src={$currentTrack?.audioUrl}
/>
{#if $currentTrack}
	<div class="w-screen">
		<div class="progress-slider w-screen">
			<RangeSlider
				bind:value={currentTime}
				max={duration}
				step={0.01}
				precision={2}
				formatter={(v) => format(v)}
			/>
		</div>
		<div class="flex gap-5 items-center px-4 justify-between h-20">
			<div class="flex gap-5 flex-1 items-center">
				<div>
					<img
						class="h-12 w-12 bg-emerald-300 border-none"
						alt="cover"
						src="https://d1csarkz8obe9u.cloudfront.net/themedlandingpages/tlp_hero_album-covers-d12ef0296af80b58363dc0deef077ecc.jpg?ts%20=%201698246112"
					/>
				</div>
				<div>
					<div class="title">
						<p>{$currentTrack.title}</p>
					</div>
				</div>
			</div>

			<div
				class="buttons text-nowrap flex-nowrap flex gap-4 py-2 flex-1 items-center justify-center"
			>
				<div class="progress text-nowrap p-2 py-1 rounded-full border border-stone-600 text-xs">
					<span class="time">{format(currentTime)}</span>
					/
					<span class="duration">{format(duration)}</span>
				</div>
				<button
					class="prev text-2xl h-8 w-8 flex items-center justify-center"
					on:click={previousTrack}
				>
					<Icon icon="iconoir:skip-prev-solid" />
				</button>

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

				<button class="next text-2xl h-8 w-8 flex items-center justify-center" on:click={nextTrack}>
					<Icon icon="iconoir:skip-next-solid" />
				</button>
			</div>
			<div class=" flex items-center flex-1 justify-end">
				<div class="group relative z-10">
					<div
						class="group-hover:flex hidden absolute bottom-full right-0 w-[32px] justify-center border pb-2 pt-2 rounded-full border-stone-600 bg-white"
					>
						<input
							type="range"
							bind:value={volume}
							min="0"
							max="1"
							step="0.01"
							class="w-1"
							style="writing-mode: vertical-lr"
						/>
					</div>
					<button
						class="text-xl h-8 w-8 flex items-center justify-center border border-stone-600 rounded-full static z-50"
					>
						<Icon icon="iconoir:sound-high" />
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	audio {
		display: none;
	}
	.play-button {
		height: 2.5rem;
		aspect-ratio: 1 / 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
	}
</style>
