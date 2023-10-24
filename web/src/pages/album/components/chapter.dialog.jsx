import { useEffect, useState } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions,
    Box, Grid,
} from "@mui/material";

import { FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import * as PublisherService from "@app/services/admin/publisher/PublisherServices";


import PropTypes from 'prop-types';


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

                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <ChapterUploader handleChange={handleChange} handleAudioWithTitle={audioWithTitle} name="file" types={fileTypes} multiple={true} />
                            </Grid>

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