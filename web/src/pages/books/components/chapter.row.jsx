import { useCallback, useEffect, useRef, useState } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
    DialogActions, Stack, CardHeader, Card, CircularProgress,
    Box, Grid, IconButton, Typography, FormHelperText,
} from "@mui/material";

import MenuItem from "@mui/material/MenuItem";

import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import * as PublisherService from "@app/services/admin/publisher/PublisherServices";
import CardContent from '@mui/material/CardContent';

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

import AudioPlayer from "@app/components/AudioPlayer";

import { ChapterUploader } from "@app/components/DragDropFiles";
import { useDispatch } from "react-redux";
import UploaderService from "@app/services/admin/UploaderService";

const fileTypes = ["MP3", "OGG", "WAV"];

ChapterRow.propTypes = {
    chapterRows: PropTypes.array,
}


function ChapterRow({ chapterRows }) {
    const { enqueueSnackbar } = useSnackbar();
    const reference = useRef();
    const inputRef = useRef();
    const dispatch = useDispatch();
    const getText = () => {
        if (queue.isUploading) return "Uploading...";
        if (queue.isFailed) return "Failed";
        return "Pending";
    }
    const getColor = () => {
        if (queue.isUploading) return "#0000ff";
        if (queue.isFailed) return "#ff0000";
        return "yellow";
    }

    const handleRetry = () => {
        dispatch(ChapterQueuesActions.update({
            ...queue,
            isFailed: false,
            retried: 2
        }))
    }
    //confirmation form
    const formik = useFormik({
        initialValues: [{
            title: [],
            length: "",
            file: "",
        }],
        validationSchema: yup.object({
            title: yup.string('Enter title').required('Title is required'),
            file: yup.string("Select File").required("File is required"),
        }),
        onSubmit: (values) => {
            handleOnConfirm(values);
        },
    });

    let audioWithTitle = [];

    const { setValues } = formik;
    let titlePush = [];
    useEffect(() => {
        if (chapterRows?.length > 0) {
            chapterRows.map((row, i) => {
                if (row) {
                    let allTitle = { name: row?.name?.replace(/\.[^/.]+$/, "") ?? '' };
                    titlePush.push({ ...allTitle });
                }
            }
            )
        }
        setValues({ title: titlePush });
    }, [chapterRows, setValues]);

    const handleAdd = (rowIndex) => {
        const file = chapterRows[rowIndex];
        console.log('the file is ', chapterRows[rowIndex].name, formik.values?.title[rowIndex]?.name);
        if (!file) return alert("Please select file...")
        const key = Math.round(Math.random() * 9999);
        UploaderService.saveCacheFile(key, file)
            .then(res => {
                dispatch(ChapterQueuesActions.add({
                    key,
                    title: formik.values?.title[rowIndex]?.name ?? `This is title ${key}`,
                    bookName: "Ahilaki",
                    chapterName: formik.values?.title[rowIndex]?.name ?? `Chapter ${key}`,
                    file: {
                        name: file.name,
                        size: file.size,
                        type: file.type
                    }
                }));
            })
            .catch(err => {
                console.log(err);
            });
    }

    Array.from(chapterRows).forEach((chapter, i) => {
        if (chapter) {
            audioWithTitle.push(
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
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    margin="dense"
                                    name="title"
                                    label="Title"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values?.title[i]?.name}
                                    onChange={(event) => {
                                        formik.setFieldValue(`title[${i}].name`, event.target.value);
                                    }}
                                />
                            }
                            subheader={
                                <>
                                    <audio controls autoplay>
                                        <source src={URL.createObjectURL(chapter)} type={chapter.type} />
                                    </audio>
                                    <Button onClick={()=>handleAdd(i)}>Upload</Button>
                                </>
                            }
                        />
                    </Card>
                </div>);
        }
    });

    return (
        <>
            <Grid container spacing={2} rowSpacing={1}>
                {audioWithTitle}
            </Grid>
        </>
    )
}
export default ChapterRow;