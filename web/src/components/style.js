import styled, { css } from 'styled-components';

const primary = '#0658c2',
  darkGray = '#666',
  lightGray = '#999';

const defaultStyle = css`
  display: flex;
  align-items: center;
  min-width: 322px;
  max-width: 508px;
  height: 100px;
  border: dashed 2px ${primary};
  padding: 0px 16px 0px 8px;
  border-radius: 5px;
  cursor: pointer;
  flex-grow: 0;

  &.is-disabled {
    border: dashed 2px ${darkGray};
    cursor: no-drop;
    svg {
      fill: ${darkGray};
      color: ${darkGray};
      path {
        fill: ${darkGray};
        color: ${darkGray};
      }
    }
  }
`;

export const UploaderWrapper = styled.label`
  position: relative;
  ${(props) => (props.overRide ? '' : defaultStyle)};
  &:focus-within {
    outline: 2px solid black;
  }
  & > input {
    display: block;
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }
`;

export const HoverMsg = styled.div`
  border: dashed 2px ${darkGray};
  border-radius: 5px;
  background-color: ${lightGray};
  opacity: 0.5;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  & > span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
`;

export const DescriptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  & > span {
    font-size: 12px;
    color: ${(props) => (props.error ? 'red' : darkGray)};
  }
  .file-types {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100px;
  }
`;

export const Description = styled.span`
  font-size: 14px;
  color: ${darkGray};
  span {
    text-decoration: underline;
  }
`;