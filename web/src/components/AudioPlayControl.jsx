import * as React from 'react';
import PauseCircleFilled from '@mui/icons-material/PauseCircleFilled';
import PlayCircleFilledWhite from '@mui/icons-material/PlayCircleFilledWhite';
import Replay from '@mui/icons-material/Replay';
import cx from 'classnames';

import PLAYER from './state/player';
import { createTheme } from '@mui/material/styles';
import styled from '@emotion/styled';

export const useComponentStyles = styled({
  icon: (props) => ({
    color: props.playerColors.active,
    '&:hover': {
      color: props.playerColors.hover,
    },
  }),
});

const AudioPlayControl = ({
  playerStatus,
  playerColors,
  pauseAudio,
  playAudio,
  replayAudio,
  icons = {},
  classNames = {},
}) => {
  const {
    PlayIcon = PlayCircleFilledWhite,
    ReplayIcon = Replay,
    PauseIcon = PauseCircleFilled,
  } = icons;
  const classes = useComponentStyles({ playerColors });
  switch (playerStatus) {
    case PLAYER.STATUS.PLAY:
      return (
        <PauseIcon
          fontSize="large"
          onClick={pauseAudio}
          className={cx(classes.icon, classNames.pauseIcon)}
        />
      );
    case PLAYER.STATUS.STOP:
      return (
        <ReplayIcon
          fontSize="large"
          onClick={replayAudio}
          className={cx(classes.icon, classNames.replayIcon)}
        />
      );
    default:
      return (
        <PlayIcon
          fontSize="large"
          onClick={playAudio}
          className={cx(classes.icon, classNames.playIcon)}
        />
      );
  }
};
export default React.memo(AudioPlayControl);
