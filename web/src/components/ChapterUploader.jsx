import {
  Description,
  DescriptionWrapper,
  HoverMsg,
  UploaderWrapper
} from './style';
import { acceptedExt, checkType, getFileSizeMB } from './utils';
import React, { useEffect, useRef, useState } from 'react';

import DrawTypes from './DrawTypes';
import ImageAdd from './ImageAdd';
import useDragging from './useDragging';
import AudioPlayer from "@app/components/AudioPlayer";

import {
  TextField, CardHeader,
  Grid, Card,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import * as yup from 'yup';
import Dropzone from './Dropzone';
import ChapterQueueDrawer from './ChapterQueueDrawer';

const ChapterUploader = ({
  name,
  hoverTitle,
  types,
  handleChange,
  classes,
  children,
  maxSize,
  minSize,
  fileOrFiles,
  onSizeError,
  onTypeError,
  onSelect,
  onDrop,
  disabled,
  label,
  multiple,
  required,
  onDraggingStateChange,
  dropMessageStyle,
  handleAudioWithTitle
}) => {


  const labelRef = useRef(null);
  const inputRef = useRef(null);
  const [uploaded, setUploaded] = useState(false);
  const [currFiles, setFile] = useState();
  const [error, setError] = useState(false);



  const validateFile = (file) => {
    if (types && !checkType(file, types)) {
      setError(true);
      if (onTypeError) onTypeError('File type is not supported');
      return false;
    }
    if (maxSize && getFileSizeMB(file.size) > maxSize) {
      setError(true);
      if (onSizeError) onSizeError('File size is too big');
      return false;
    }
    if (minSize && getFileSizeMB(file.size) < minSize) {
      setError(true);
      if (onSizeError) onSizeError('File size is too small');
      return false;
    }
    return true;
  };

  const handleChanges = (files) => {
    if (!Array.isArray(files) && !(files instanceof FileList)) files = [files];
    files = Array.from(files);
    let checkError = false;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      checkError = !validateFile(file) || checkError;

    }
    if (checkError) {
      console.log('the error is ', checkError);
      return false;
    }
    if (handleChange) handleChange(files);
    setFile(files);
    // setUploaded(true);
    // setError(false);

    return true;
  };

  const blockEvent = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
  };
  const handleClick = (ev) => {
    ev.stopPropagation();
    // eslint-disable-next-line no-param-reassign
    if (inputRef && inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

  const handleInputChange = (ev) => {
    const allFiles = ev.target.files;
    const files = multiple ? allFiles : allFiles[0];
    const success = handleChanges(files);
    if (onSelect && success) onSelect(files);
  };
  const dragging = useDragging({
    labelRef,
    inputRef,
    multiple,
    handleChanges,
    onDrop
  });

  useEffect(() => {
    onDraggingStateChange?.(dragging);
  }, [dragging]);

  useEffect(() => {
    if (fileOrFiles) {
      setUploaded(true);
      // setFile(fileOrFiles);
    } else {
      if (inputRef.current) inputRef.current.value = '';
      setUploaded(false);
      // setFile(null);
    }
    handleAudioWithTitle(currFiles);
  }, [fileOrFiles, currFiles]);

  return (
    <>
      <UploaderWrapper
        overRide={children}
        className={`${classes || ''} ${disabled ? 'is-disabled' : ''}`}
        ref={labelRef}
        htmlFor={name}
        onClick={blockEvent}
      >
        <input
          onClick={handleClick}
          onChange={handleInputChange}
          accept={acceptedExt(types)}
          ref={inputRef}
          type="file"
          name={name}
          disabled={disabled}
          multiple={multiple}
          required={required}
        />
        {dragging && (
          <HoverMsg style={dropMessageStyle}>
            <span>{hoverTitle || 'Drop Here'}</span>
          </HoverMsg>
        )}
        {!children && (
          <>
            <ImageAdd />
            <DescriptionWrapper error={error}>
              <Dropzone currFile={currFiles} uploaded={uploaded} error={error} disabled={disabled} label={label} />
              <DrawTypes types={types} minSize={minSize} maxSize={maxSize} />
            </DescriptionWrapper>
          </>
        )}
        {children}
      </UploaderWrapper>
    </>
  );
};
export default ChapterUploader;