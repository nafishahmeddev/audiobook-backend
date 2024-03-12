<script>
	import { status, isPlaying, audioPlayer, currentTrack, queue, addTrack } from '$lib/stores.js';

	export let track;
	const { thumbnailUrl, artists, title } = track;
	$: playing = track._id === $currentTrack._id;
</script>

<div class="" class:border-b={playing}>
	<div class="">
		<p>{title}</p>
	</div>
</div>
