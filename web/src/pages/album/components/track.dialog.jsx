import { useEffect, useState } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, TextField, Box, Select, FormControl, InputLabel,
    MenuItem, Grid, Stack, Typography,
} from "@mui/material";

import { FormikProvider, useFormik } from 'formik';
import * as AuthorServices from "@app/services/admin/settings/author/AuthorServices";
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import LanguageData from "@app/assets/LanguageData.js";

import * as PublisherService from "@app/services/admin/publisher/PublisherServices";


import PropTypes from 'prop-types';


import { ChapterUploader } from "@app/components/DragDropFiles";

const fileTypes = ["MP3", "OGG", "WAV"];

TrackDialog.propTypes = {
    open: PropTypes.bool,
    row: PropTypes.object,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
}


function TrackDialog({ open, row, chaptersRow, onClose, onConfirm }) {
    const { enqueueSnackbar } = useSnackbar();
    const [uploadedChapters, setUploadedChapters] = useState([]);
    const [bookData, setBookData] = useState(false);
    const [track, setTrack] = useState();
    const [authorList, setAuthorList] = useState([]);

    const [file, setFile] = useState(null);
    const [textAudio, setTextAudio] = useState(null);
    const [thumbnailImage, setThumbnailImage] = useState();
    const [audioUpload, setAudioUpload] = useState();

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
            excerpt: "",
            description: "",
            slug: "",
            language: "",
            thumbnail: "",
            audio: "",
            duration: "",
            authors: [],
            genres: [],
            lists: [],
            album: "",
            position: "",
            type: ""
        },
        validationSchema: yup.object({
            title: yup.string('Enter title').required('Title is required'),
            excerpt: yup.string("Enter Excerpt").required("File is required"),
            description: yup.string("Enter Description").required("File is required"),
            slug: yup.string("Enter Slug").required("File is required"),
            language: yup.string("Select Language").required("File is required"),
            thumbnail: yup.string("Select File").required("File is required"),
            audio: yup.string("Select File").required("File is required"),
            duration: yup.string("Enter Duration").required("File is required"),
            authors: yup.array().of(yup.string("Select Authors").required("Authors is required")),
            // genres: yup.string("Select File").required("File is required"),
            // lists: yup.string("Select File").required("File is required"),
            album: yup.string("Select File").required("File is required"),
            position: yup.string("Enter File").required("File is required"),
            type: yup.string("Enter File").required("File is required")
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

    const initialData = () => {
        AuthorServices.getAll().then(res => {
            setAuthorList(res.result.authors);
        }).catch(err => {
            console.error(err);
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });
    }

    useEffect(() => {
        setValues({
            title: row?.title ?? "",
            excerpt: row?.excerpt ?? "",
            description: row?.description ?? "",
            slug: row?.slug ?? "",
            language: row?.language ?? "",
            totalTracks: row?.totalTracks ?? "",
            thumbnail: row?.thumbnail ?? "",
            duration: row?.duration ?? "",
            authors: row?.authors ?? [],
            genres: row?.genres ?? [],
            lists: row?.lists ?? [],
            type: row?.type ?? "",
            audio: row?.audio ?? "",
            album: row?._id ?? "",
            position: row?.position ?? ""
        })
        initialData();
    }, [row, setValues])

    return (
        <>
            <Dialog open={open}
                maxWidth="md"
                fullWidth
                onClose={() => handleOnClose()}>
                <FormikProvider value={formik}>
                    <DialogTitle display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <span style={{ fontSize: "18px" }}> Add Track </span>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter information below
                        </DialogContentText>


                        <Grid container spacing={2} rowSpacing={1}>
                            <Grid item xs={6}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                                    <span style={{ fontSize: "16px", marginLeft: "2%" }}>  Upload Audio: </span>
                                    <label htmlFor="audio">
                                        <Button variant="contained" component="span">
                                            Upload Album Cover
                                        </Button>
                                        <input
                                            id="audio"
                                            hidden
                                            name="audio"
                                            accept="audio/*"
                                            type="file"
                                            onChange={(event) => {
                                                setAudioUpload(URL.createObjectURL(event.target.files[0]));
                                                formik.setFieldValue('audio', event.currentTarget.files[0]);
                                            }}
                                        />
                                    </label>
                                    {audioUpload && <audio controls> <source src={audioUpload} type="audio/*" /></audio>}
                                </Stack>
                            </Grid>

                            <Grid item xs={6}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                                    <span style={{ fontSize: "16px", marginLeft: "2%" }}>  Upload Book Cover: </span>
                                    <label htmlFor="thumbnail">
                                        <Button variant="contained" component="span">
                                            Upload Album Cover
                                        </Button>
                                        <input
                                            id="thumbnail"
                                            hidden
                                            name="thumbnail"
                                            accept="image/*"
                                            type="file"
                                            onChange={(event) => {
                                                setThumbnailImage(URL.createObjectURL(event.target.files[0]));
                                                formik.setFieldValue('thumbnail', event.currentTarget.files[0]);
                                            }}
                                        />
                                    </label>
                                    {thumbnailImage && <img src={thumbnailImage} alt="Thumbnail Image" height="300" />}
                                </Stack>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="title"
                                    name="title"
                                    label="Album Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="position"
                                    name="position"
                                    label="Position"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.position}
                                    onChange={formik.handleChange}
                                    error={formik.touched.position && Boolean(formik.errors.position)}
                                    helperText={formik.touched.position && formik.errors.position}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    label="Language"
                                    margin="dense"
                                    variant="standard"
                                    name="language"
                                    fullWidth
                                    select
                                    onChange={formik.handleChange}
                                    value={formik.values.language}
                                    error={formik.touched.language && Boolean(formik.errors.language)}
                                    helperText={formik.touched.language && formik.errors.language}>
                                    <MenuItem value=""></MenuItem>
                                    {Object.values(LanguageData).map(language => (
                                        <MenuItem value={language.iso} key={`language-item-${language.iso}`}>
                                            {language.name}
                                        </MenuItem>
                                    ))}

                                </TextField>
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined" margin="normal">
                                    <InputLabel id="author">Author</InputLabel>
                                    <Select
                                        labelId="authors"
                                        id="authors"
                                        // multiple
                                        label="Author"
                                        value={formik.values.authors}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        inputProps={{
                                            name: 'authors',
                                            id: 'id',
                                        }}
                                        renderValue={(selected) => (authorList?.find((item) => item._id === selected[0])?.firstName)}
                                    >
                                        {authorList.map((author) => (
                                            <MenuItem key={`author-item-${author._id}`} value={author._id}>
                                                {author.firstName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Lists"
                                    margin="dense"
                                    variant="standard"
                                    name="lists"
                                    fullWidth
                                    select
                                    multiple
                                    onChange={formik.handleChange}
                                    value={formik.values.lists}
                                    error={formik.touched.lists && Boolean(formik.errors.lists)}
                                    helperText={formik.touched.lists && formik.errors.lists}>
                                    <MenuItem value="65395adac23fd7cadf2a11e4" key="book-list">Book</MenuItem>
                                    <MenuItem value="65395adac23fd7cadf2a12e4" key="podcast-list">Podcast</MenuItem>
                                    <MenuItem value="65395adac23fd7cadf2a13e4" key="song-list">Song</MenuItem>
                                    {/* {lists.map(list => (
                                                <MenuItem value={list._id} key={`country-item-${list._id}`}>
                                                    {list.name}
                                                </MenuItem>
                                            ))} */}

                                </TextField>

                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Genres"
                                    margin="dense"
                                    variant="standard"
                                    name="genres"
                                    fullWidth
                                    select
                                    onChange={formik.handleChange}
                                    value={formik.values.genres}
                                    error={formik.touched.genres && Boolean(formik.errors.genres)}
                                    helperText={formik.touched.genres && formik.errors.genres}>
                                    <MenuItem value="65395adac21fd7cadf2a1ee4" key="pick-list">Pick</MenuItem>
                                    <MenuItem value="65395adac22fd7cadf2a1ee4" key="up-list">Up</MenuItem>
                                    <MenuItem value="65395adac24fd7cadf2a1ee4" key="this-list">THis</MenuItem>
                                    {/* {genreList.map(genre => (
                                                <MenuItem value={genre._id} key={`genre-item-${genre._id}`}>
                                                    {genre.name}
                                                </MenuItem>
                                            ))} */}

                                </TextField>
                            </Grid>


                            <Grid item xs={12}>
                                <TextField
                                    label="Type"
                                    margin="dense"
                                    variant="standard"
                                    name="genres"
                                    fullWidth
                                    select
                                    onChange={formik.handleChange}
                                    value={formik.values.genres}
                                    error={formik.touched.genres && Boolean(formik.errors.genres)}
                                    helperText={formik.touched.genres && formik.errors.genres}>
                                    <MenuItem value="EPISODE" key="EPISODE">EPISODE</MenuItem>
                                    <MenuItem value="CHAPTER" key="CHAPTER">CHAPTER</MenuItem>
                                    <MenuItem value="SONG" key="SONG">SONG</MenuItem>
                                    {/* {genreList.map(genre => (
                                                <MenuItem value={genre._id} key={`genre-item-${genre._id}`}>
                                                    {genre.name}
                                                </MenuItem>
                                            ))} */}

                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="excerpt"
                                    name="excerpt"
                                    label="Excerpt"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    maxRows={4}
                                    variant="outlined"
                                    value={formik.values.excerpt}
                                    onChange={formik.handleChange}
                                    error={formik.touched.excerpt && Boolean(formik.errors.excerpt)}
                                    helperText={formik.touched.excerpt && formik.errors.excerpt}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="description"
                                    name="description"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    maxRows={4}
                                    variant="outlined"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>


                            {/* <Grid item xs={12} sx={{ mt: 3 }}>
                                <ChapterUploader handleChange={handleChange} handleAudioWithTitle={audioWithTitle} name="file" types={fileTypes} multiple={true} />
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
export default TrackDialog;