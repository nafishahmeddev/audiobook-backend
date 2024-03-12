import { writable, get } from 'svelte/store'

export const audioPlayer = writable();
export const status = writable('default');
export const isPlaying = writable(false);

export const currentTrack = writable(null);

export const queue = writable([]);

export const addTrack = track => {
    queue.update(v => [...v, track])
};