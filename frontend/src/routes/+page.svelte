<script>
  import { Player, Hls } from "@vime/svelte";
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/default.css"
  />
</svelte:head>
<div>
    <Player controls>
        <Hls crossorigin="" poster="https://media.vimejs.com/poster.png">
          <!-- These are passed directly to the underlying HTML5 `<video>` element. -->
          <!-- Why `data-src`? Lazy loading, you can always use `src` if you prefer.  -->
          <source data-src="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8" type="	application/vnd.apple.mpegurl" />
          <track
            default
            kind="subtitles"
            src="https://media.vimejs.com/subs/english.vtt"
            srclang="en"
            label="English"
          />
          </Hls>
      
        <!-- ... -->
      </Player>
</div>
