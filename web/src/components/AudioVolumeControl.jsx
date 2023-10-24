import * as React from 'react';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import VolumeOff from '@mui/icons-material/VolumeOff';
import VolumeUp from '@mui/icons-material/VolumeUp';
import cx from 'classnames';

import PLAYER from './state/player';

import styled from '@emotion/styled';

export const useComponentStyles = styled((theme) => {
  return {
    sliderContainer: {
      flex: '1 1 auto',
    },
    slider: (props) => ({
      color: props.playerColors.active,
    }),
    commonContainer: {
      flex: '0 0 auto',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    icon: (props) => ({
      color: props.playerColors.active,
      '&:hover': {
        color: props.playerColors.hover,
      },
    }),
    volumeIconContainer: {
      position: 'relative',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    volumeControlContainer: {
      position: 'absolute',
      display: 'none',
      zIndex: 10,
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
        height: '60px',
      },
      padding: '10px 5px',
    },
  };
});

export const AudioVolumeControl = ({
  muted = null,
  muteAudio,
  unmuteAudio,
  classNames = {},
  volume,
  changeAudioVolume,
  icons = {},
  playerColors,
}) => {
  const classes = useComponentStyles({ playerColors });
  const { VolumeUpIcon = VolumeUp, VolumeOffIcon = VolumeOff } = icons;
  const handleVolumeChange = (event, value) => {
    changeAudioVolume(value);
  };
  const [volumeSlider, openVolumeSlider] = React.useState(false);
  const toggleVolumeSlider = (value) => () => {
    openVolumeSlider(value);
  };
  return (
    <Grid
      item={true}
      className={cx(classes.commonContainer, classes.volumeIconContainer)}
      onMouseEnter={toggleVolumeSlider(true)}
      onMouseLeave={toggleVolumeSlider(false)}
    >
      {volume.status === PLAYER.VOLUME.STATUS.UNMUTE ? (
        <VolumeUpIcon
          fontSize="large"
          className={cx(classes.icon, classNames.volumeIcon)}
          onClick={typeof muted !== 'boolean' ? muteAudio : () => { }}
        />
      ) : (
        <VolumeOffIcon
          fontSize="large"
          className={cx(classes.icon, classNames.volumeIcon)}
          onClick={typeof muted !== 'boolean' ? unmuteAudio : () => { }}
        />
      )}
      {volumeSlider && (
        <Paper
          className={cx(
            classes.volumeControlContainer,
            classNames.volumeSliderContainer
          )}
        >
          <Slider
            orientation="vertical"
            aria-labelledby="volume-control"
            value={volume.value}
            defaultValue={PLAYER.VOLUME.DEFAULT_VALUE}
            onChange={handleVolumeChange}
            className={cx(classes.slider, classNames.volumeSlider)}
          />
        </Paper>
      )}
    </Grid>
  );
};
export default React.memo(AudioVolumeControl);