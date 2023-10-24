import * as React from 'react';
import Close from '@mui/icons-material/Close';
import cx from 'classnames';

import { createTheme } from '@mui/material/styles';
import styled from '@emotion/styled';
const theme = createTheme();

export const useComponentStyles = styled({
  icon: (props) => ({
    color: props.playerColors.active,
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 16,
    cursor: 'pointer',
    '&:hover': {
      color: props.playerColors.hover,
    },
  }),
});

const AudioPlayCloseButton = ({
  playerColors,
  onClose,
  icons = {},
  classNames = {},
}) => {
  const { CloseIcon = Close } = icons;
  const classes = useComponentStyles({ playerColors });
  return (
    <CloseIcon
      onClick={onClose}
      className={cx(classes.icon, classNames.closeIcon)}
    />
  );
};
export default React.memo(AudioPlayCloseButton);