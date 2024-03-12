<script>
	import { status, isPlaying, audioPlayer, currentTrack, queue, addTrack } from '$lib/stores.js';
	export let track;
	const { thumbnailUrl, authors, title } = track;
	$: playing = $currentTrack && track._id === $currentTrack._id;

	const handleOnClick = () => {
		if ($queue.find((e) => e._id == track._id)) return false;
		addTrack(track);
		$currentTrack = track;
	};
</script>

<div class="w-full h-full aspect-[1/1.2]" role="presentation" on:click={handleOnClick}>
	<img src={thumbnailUrl} class="w-full aspect-square" alt="cool" />
	<div class="p-1.5">
		<p class="text-sm dots" class:font-medium={playing}>{title}</p>
		<p class="text-xs text-gray-500 dots">
			{authors?.map((e) => e.firstName + ' ' + e.lastName).join(', ')}
		</p>
	</div>
</div>

<style>
	.dots {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
