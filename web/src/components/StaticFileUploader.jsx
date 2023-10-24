import {
  Description,
  DescriptionWrapper,
  HoverMsg,
  UploaderWrapper
} from './style';
import { acceptedExt, checkType, getFileSizeMB } from './utils';
import { useEffect, useRef, useState } from 'react';

import DrawTypes from './DrawTypes';
import ImageAdd from './ImageAdd';
import useDragging from './useDragging';
import AudioPlayer from "@app/components/AudioPlayer";

import PropTypes from 'prop-types';
import {
  TextField, CardHeader,
  Grid, Card,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';



const drawDescription = (
  currFile,
  uploaded,
  typeError,
  disabled,
  label
) => {
  return typeError ? (
    <span>File type/size error, Hovered on types!</span>
  ) : (
    <Description>
      {disabled ? (
        <span>Upload disabled</span>
      ) : !currFile && !uploaded ? (
        <>
          {label ? (
            <>
              <span>{label.split(' ')[0]}</span>{' '}
              {label.substr(label.indexOf(' ') + 1)}
            </>
          ) : (
            <>
              <span>Upload</span> or drop a file right here
            </>
          )}
        </>
      ) : (
        <>
          <span>Uploaded Successfully!</span> Upload another?
        </>
      )}
    </Description>
  );
};

const StaticFileUploader = ({
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
  dropMessageStyle
}) => {
  const labelRef = useRef(null);
  const inputRef = useRef(null);
  const [uploaded, setUploaded] = useState(false);
  const [currFiles, setFile] = useState(null);
  const [error, setError] = useState(false);


  const formik = useFormik({
    initialValues: [{
      title: "",
    }],
    validationSchema: yup.array(yup.object({
      title: yup.string("Enter Title").required("Title is required"),
    })),
    onSubmit: (values) => {
      addChapters(values);
    },
  });

  const validateFile = (file) => {
    console.log('Gone inside validate with file as ', file);
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
    console.log(' the files in handle changes are ', files.length);
    let checkError = false;
    if (files) {
      if (files instanceof File) {
        checkError = !validateFile(files);
      } else {
        console.log('the else is ', files);
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          checkError = !validateFile(file) || checkError;
        }
      }
      if (checkError) return false;
      if (handleChange) handleChange(files);
      console.log('setting the files', Array.from(files));
      setFile(files);

      setUploaded(true);
      setError(false);
      return true;
    }
    return false;
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
    console.log('the files in input change is ', allFiles, ' multiple ', multiple);
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
    console.log('uploading file', currFiles, ' length ', currFiles?.length);
  }, [fileOrFiles, currFiles]);

  const options = [];
  if (currFiles)
    if (currFiles.length > 1) {
      console.log('yes length is greater than one', currFiles.length);
      Array.from(currFiles).forEach((audioFile, i) => {
        let fileUrl = URL.createObjectURL(audioFile);
        options.push(
          <div key={`val-${i}`}>
            <Card variant="outlined" sx={{ marginBottom: 5 }}>
              <CardHeader
                action={
                  <IconButton aria-label="settings">
                    <CloseIcon />
                  </IconButton>
                }
                title={
                  <TextField
                    margin="dense"
                    name="title"
                    label="Title"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={formik.handleChange}
                    value={formik.values.title}
                    error={Boolean(formik.touched.title && formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                }
                subheader={
                  <AudioPlayer
                    elevation={1}
                    width="100%"
                    variation="default"
                    spacing={3}
                    download={true}
                    autoplay={true}
                    order="standard"
                    preload="auto"
                    loop={true}
                    tracks={fileUrl}
                  />
                }
              />
            </Card>
          </div>);
      });
    } else {
      console.log('length is smaller than one');
      options.push(
        <div>
          <Card variant="outlined">
            <Grid container spacing={4} rowSpacing={0.1}>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="title"
                  label="Title"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={formik.handleChange}
                  value={formik.values.title}
                  error={Boolean(formik.touched.title && formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>

              <Grid item xs={12}>
                <AudioPlayer
                  elevation={1}
                  width="100%"
                  variation="default"
                  spacing={3}
                  download={true}
                  autoplay={true}
                  order="standard"
                  preload="auto"
                  loop={true}
                  tracks={currFiles}
                />
              </Grid>
            </Grid>
          </Card>
        </div>);
    }

  return (
    <>
      {currFiles &&
        <div>{options}</div>
      }

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
              {drawDescription(currFiles, uploaded, error, disabled, label)}
              <DrawTypes types={types} minSize={minSize} maxSize={maxSize} />
            </DescriptionWrapper>
          </>
        )}
        {children}
      </UploaderWrapper>
    </>
  );
};

StaticFileUploader.propTypes = {
  name: PropTypes.string,
  hoverTitle: PropTypes.func,
  types: PropTypes.func,
  handleChange: PropTypes.func,
  classes: PropTypes.func,
  children: PropTypes.func,
  maxSize: PropTypes.func,
  minSize: PropTypes.func,
  fileOrFiles: PropTypes.func,
  onSizeError: PropTypes.func,
  onTypeError: PropTypes.func,
  onSelect: PropTypes.func,
  onDrop: PropTypes.func,
  disabled: PropTypes.func,
  label: PropTypes.func,
  multiple: PropTypes.func,
  required: PropTypes.func,
  onDraggingStateChange: PropTypes.func,
  dropMessageStyle: PropTypes.func,
  currFile: PropTypes.func,
  uploaded: PropTypes.func,
  typeError: PropTypes.func,
  disabled: PropTypes.func,
  label: PropTypes.func
}

export default StaticFileUploader;