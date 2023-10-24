import { useEffect, useState } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
    DialogActions, Stack,
    Box, Grid, IconButton, Typography, FormHelperText,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import * as PublisherService from "@app/services/admin/publisher/PublisherServices";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from 'prop-types';

import AudioPlayer from "@app/components/AudioPlayer";

import { ChapterUploader } from "@app/components/DragDropFiles";

const fileTypes = ["MP3", "OGG", "WAV"];

ChapterDialog.propTypes = {
    open: PropTypes.bool,
    row: PropTypes.object,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
}


function ChapterDialog({ open, row, chaptersRow, onClose, onConfirm }) {
    const { enqueueSnackbar } = useSnackbar();
    const [uploadedChapters, setUploadedChapters] = useState([]);
    const [bookData, setBookData] = useState(false);
    const [track, setTrack] = useState();

    const [file, setFile] = useState(null);
    const [textAudio, setTextAudio] = useState(null);

    const handleChange = (file) => {
        setFile(file);
    };

    const audioWithTitle = (file) => {
        setTextAudio(file);
    };

    const handleAudioWithTitle = () => {
        console.log('the text audio is ', textAudio);
        chaptersRow(textAudio);
        onClose();
    }

    //confirmation form
    const formik = useFormik({
        initialValues: {
            title: "",
            length: "",
            file: "",
        },
        validationSchema: yup.object({
            title: yup.string('Enter title').required('Title is required'),
            file: yup.string("Select File").required("File is required"),
        }),
        onSubmit: (values) => {
            handleOnConfirm(values);
        },
    });
    const handleOnClose = () => {
        formik.resetForm();
        onClose();
    }
    const handleOnConfirm = (values) => {
        let res = null;
        if (row) {
            res = PublisherService.update(row._id, values)
        } else {
            values.balance = 0;
            res = PublisherService.create(values)
        }

        res.then(res => {
            enqueueSnackbar(res.message, { variant: "success" });
            onConfirm();
            formik.resetForm();
        }).catch(err => {
            enqueueSnackbar(err.message, { variant: "error" });
        })
    }

    const audioPreview = (file) => {
        console.log('the file is ', file);
        console.log('the src is ', file.src);
        setBookData(true);
        setTrack(file);
    };

    const { setValues } = formik;
    useEffect(() => {
        setValues({
            title: row?.title ?? "",
            file: row?.file ?? "",
        })
    }, [row, setValues])

    // const initializeComponent = async () => {
    //     await PublisherService.all().then(res => {
    //         setProvisionModels(res.data.records);
    //     }).catch(err => {
    //         console.error(err);
    //     });
    // }

    // useEffect(() => {
    //     initializeComponent();
    // }, []);

    return (
        <>
            <Dialog open={open}
                maxWidth="xs"
                fullWidth
                onClose={() => handleOnClose()}>
                <FormikProvider value={formik}>
                    <DialogTitle display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <span style={{ fontSize: "18px" }}> Add Chapter </span>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter information below
                        </DialogContentText>


                        <Grid container spacing={2} rowSpacing={1}>
                            {/* <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="title"
                                    name="title"
                                    label="Title"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                            </Grid> */}

                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <ChapterUploader handleChange={handleChange} handleAudioWithTitle={audioWithTitle} name="file" types={fileTypes} multiple={true} />
                            </Grid>

                            {/* <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                                    <span style={{ fontSize: "16px", marginLeft: "2%" }}> Chapters: </span>
                                    <label htmlFor="file">
                                        <Button variant="contained" component="span">
                                            Chapter
                                        </Button>
                                        <input
                                            id="file"
                                            hidden
                                            multiple
                                            name="file"
                                            accept="audio/*"
                                            type="file"
                                            onChange={(event) => {
                                                audioPreview(event.currentTarget.files);
                                            }}
                                        />
                                    </label>
                                    {bookData &&
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
                                            tracks={track}
                                        />
                                    }
                                </Stack>
                            </Grid> */}

                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleOnClose()} color="info" variant="contained">Cancel</Button>
                        <Button onClick={() => handleAudioWithTitle()} color="success" variant="contained">Confirm</Button>
                    </DialogActions>
                </FormikProvider>
            </Dialog>


        </>
    )
}
export default ChapterDialog;