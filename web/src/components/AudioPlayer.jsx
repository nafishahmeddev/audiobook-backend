import React from 'react';

class AudioPlayer extends React.Component {
  state = {
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    currentTrack: 0,
    tracks: [],
  }

  audioRef = React.createRef()

  componentDidMount() {
    this.setState({ tracks: this.props.tracks });
  }

  handlePlay = () => {
    this.audioRef.current.play()
    this.setState({ playing: true })
  }

  handlePause = () => {
    this.audioRef.current.pause()
    this.setState({ playing: false })
  }

  handleTimeUpdate = () => {
    this.setState({
      currentTime: this.audioRef.current.currentTime,
      duration: this.audioRef.current.duration
    })
  }

  handleVolumeChange = (e) => {
    this.setState({ volume: e.target.value });
    this.audioRef.current.volume = e.target.value;
  }

  handleSeek = (e) => {
    this.audioRef.current.currentTime = e.target.value;
  }

  handleNextTrack = () => {
    if (this.state.currentTrack < this.state.tracks.length - 1) {
      this.setState(prevState => ({ currentTrack: prevState.currentTrack + 1 }));
    }
  }

  handlePrevTrack = () => {
    if (this.state.currentTrack > 0) {
      this.setState(prevState => ({ currentTrack: prevState.currentTrack - 1 }));
    }
  }

  render() {
    const { playing, currentTime, duration, volume, currentTrack, tracks } = this.state
    console.log('the tracks in audio player are', tracks, ' current track ', currentTrack);
    return (
      <div>
        <audio
          ref={this.audioRef}
          src={tracks}
          onTimeUpdate={this.handleTimeUpdate}
          onEnded={this.handleNextTrack}
        />
        <div>
          <button onClick={this.handlePrevTrack}>Prev</button>
          <button onClick={playing ? this.handlePause : this.handlePlay}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button onClick={this.handleNextTrack}>Next</button>
          {/* <p>{tracks[currentTrack].name}</p> */}
        </div>
        <div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={this.handleVolumeChange}
          />
          <input
            type="range"
            min={0}
            max={duration}
            step={0.01}
            value={currentTime}
            onChange={this.handleSeek}
          />
        </div>
      </div>
    )
  }
}

export default AudioPlayer