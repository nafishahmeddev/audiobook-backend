import {
    Button, TextField, Box, Select, FormControl, InputLabel,
    MenuItem, Grid, Stack, Typography, Tab
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react"
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as TrackServices from "@app/services/admin/album/TrackServices";
import * as AuthorServices from "@app/services/admin/settings/author/AuthorServices";
import * as ListServices from "@app/services/admin/settings/list/ListServices";
import * as GenreServices from "@app/services/admin/settings/genre/GenreServices";
import { useSnackbar } from 'notistack';
import ChapterRow from "./components/chapter.row";

import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useNavigate, useParams } from "react-router-dom";

import MainCard from '@app/themes/ui-component/cards/MainCard';
import LanguageData from "@app/assets/LanguageData.js";
import PropTypes from 'prop-types';
import { Tabs as MuiTabs } from '@mui/material';
import { styled } from '@mui/material';
import { ChapterUploader } from "@app/components/DragDropFiles";

const fileTypes = ["MP3", "OGG", "WAV"];

const Tabs = styled(MuiTabs)(() => ({
    '& .MuiTab-root': {
        lineHeight: 0,
        minHeight: "unset",
        padding: "16px",
        backgroundColor: "lightgreen",
        // color: "black",
        fontWeight: 500
    },
    '& .MuiTab-root.Mui-selected': {
        // margin: "8px 0px 0px 5px",
        padding: "25px 10px 25px 10px",
        // borderRadius: "6px",
        backgroundColor: "lightyellow",
        fontWeight: 500,
        color: "black"
    }
}));

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function AddTrackPage() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [authorList, setAuthorList] = useState([]);
    const [lists, setLists] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [value, setValue] = useState(0);
    const [chapterRows, setChaptersRows] = useState([]);
    const [file, setFile] = useState(null);
    const [booksLoading, setBooksLoading] = useState(false);
    const queues = useSelector(state => state.chapterQueue);
    const dispatch = useDispatch();
    const [controller, setController] = useState(new AbortController());
    const [isUploading, setIsUploading] = useState(null);
    const [thumbnailImage, setThumbnailImage] = useState();
    const [audioUpload, setAudioUpload] = useState();
    const [albumsLoading, setAlbumsLoading] = useState(false);
    const [album, setAlbum] = useState();

    const params = useParams();
    const handleChange = (file) => {
        setFile(file);
    };

    const audioWithTitle = (file) => {
        if (file)
            setChaptersRows(chapterRows?.concat(file));
    };


    const handleTabChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 1) {

        }
    };

    const fetchAlbum = () => {
        setAlbumsLoading(true);
        TrackServices.one(params.album_id).then(res => {
            console.log('the fectched album is ', res.result);
            setAlbum(res.result.album);
            console.log('the image is ', import.meta.env.VITE_SERVER + res.result.album.thumbnail);
            setThumbnailImage(import.meta.env.VITE_SERVER + res.result.album.thumbnail)
        }).catch(err => {
            console.error(err);
            setAlbumsLoading(false);
        }).finally(() => {
            setAlbumsLoading(false);
        });
    }

    const formik = useFormik({
        initialValues: {
            thumbnail: "",
            audio: "",
            title: "",
            position: "",
            language: "",
            lists: [],
            genres: [],
            type: "",
            authors: [],
            excerpt: "",
            description: "",
            album: params?.album_id
        },
        validationSchema: yup.object({
            // thumbnail: yup.string("Select thumbnail").required("thumbnail is required"),
            // audio: yup.string("Select audio").required("audio is required"),
            title: yup.string("Select Track Title").required("Track title is required"),
            position: yup.string("Enter Position").required("Position is required"),
            language: yup.string("Select language").required("language is required"),
            lists: yup.string("Select Lists").required("Lists is required"),
            genres: yup.string("Select genres").required("genres is required"),
            type: yup.string("Select type").required("type is required"),
            // authors: yup.array().of(yup.string("Select Authors").required("Authors is required")),
            excerpt: yup.string("Enter Excerpt").required("Excerpt is required"),
            description: yup.string("Enter Description").required("Description is required"),
        }),
        onSubmit: (values) => {
            console.log('the values are ', values);
            addTrack(values);
        },
    });

    const addTrack = (values) => {
        setBooksLoading(true);
        let request;
        if (values._id) {
            request = TrackServices.update(values._id, values);
        } else {
            request = TrackServices.create(values);
        }

        request.create().then(res => {
            formik.setValues({
                _id: res.data.records._id,
                data: res.data.records
            })
            enqueueSnackbar()
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setBooksLoading(false);
        });


    }

    const { setValues } = formik;
    useEffect(() => {
        setValues({
            thumbnail: album?.thumbnail ?? "",
            audio: album?.audio ?? "",
            title: album?.title ?? "",
            position: album?.position ?? "",
            language: album?.language ?? "",
            lists: album?.lists ?? [],
            genres: album?.genres ?? [],
            type: album?.type ?? "",
            authors: album?.authors ?? [],
            excerpt: album?.excerpt ?? "",
            description: album?.description ?? "",
            album: params?.album_id
        })
    }, [album, setValues])

    const initialData = () => {
        if (params.album_id) {
            fetchAlbum();
        }
        AuthorServices.getAll().then(res => {
            setAuthorList(res.result.authors);
        }).catch(err => {
            console.error(err);
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });

        ListServices.getAll().then(res => {
            setLists(res.data.records);
        }).catch(err => {
            console.error(err);
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });

        GenreServices.getAll().then(res => {
            setGenreList(res.data.records);
        }).catch(err => {
            console.error(err);
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });

    }

    useEffect(() => {
        initialData();
    }, [chapterRows]);

    const handleReset = () => {
        setValues({
            thumbnail: album?.thumbnail ?? "",
            audio: album?.audio ?? "",
            title: album?.title ?? "",
            position: album?.position ?? "",
            language: album?.language ?? "",
            lists: album?.lists ?? [],
            genres: album?.genres ?? [],
            type: album?.type ?? "",
            authors: album?.authors ?? [],
            excerpt: album?.excerpt ?? "",
            description: album?.description ?? "",
            album: params?.album_id
        })
    }

    const handleDelete = async (queue) => {
        dispatch(ChapterQueuesActions.remove(queue));
        await UploaderService.deleteCacheFile(queue.key).catch(console.error)
    }
    const processQueue = useCallback(async () => {
        if (Object.values(queues).filter(queue => !queue.isFailed).length == 0 || isUploading) return false
        const queue = Object.values(queues).filter(queue => !queue.isFailed)[0];
        setIsUploading(queue.key);
        try {

            const blob = await UploaderService.getCacheFile(queue.key);
            console.log(blob);
            const file = new File([blob], queue.file.name, {
                type: queue.file.type
            })
            const fd = new FormData();
            fd.append("file", file);
            const _controller = new AbortController();
            setController(_controller);
            await UploaderService.upload(fd, _controller, ({ progress }) => {
                dispatch(ChapterQueuesActions.update({
                    ...queue,
                    progress: progress
                }));
            });
            await fetch(`/persist/delete?id=${queue.key}`);
            dispatch(ChapterQueuesActions.remove(queue));
            setIsUploading(null);
        } catch (err) {
            console.error(err);
            const retried = (queue.retried ?? 0) + 1;
            dispatch(ChapterQueuesActions.update({
                ...queue,
                retried: retried,
                isFailed: retried >= 3,
            }));
            setIsUploading(null);
        }
    }, [queues, isUploading]);


    useEffect(() => {
        processQueue();
    }, [queues, isUploading])

    return (
        <MainCard title="Add Track">

            <Box>
                <form onSubmit={formik.handleSubmit} encType="multipart/form-data">

                    <Grid container spacing={2} rowSpacing={1}>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                <EditIcon /><span style={{ fontSize: "16px", marginLeft: "2%" }}> Please enter Track info below </span>
                            </Box>
                            <Grid container spacing={2} rowSpacing={1}>
                                <Grid item xs={6}>
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                                        <span style={{ fontSize: "16px", marginLeft: "2%" }}>  Upload Audio: </span>
                                        <label htmlFor="audio">
                                            <Button variant="contained" component="span">
                                                Upload Track Cover
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
                                        <span style={{ fontSize: "16px", marginLeft: "2%" }}>  Upload Cover: </span>
                                        <label htmlFor="thumbnail">
                                            <Button variant="contained" component="span">
                                                Upload Track Cover
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
                                        label="Track Title"
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

                                <Grid item xs={6}>
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


                                <Grid item xs={6}>
                                    <TextField
                                        label="Type"
                                        margin="dense"
                                        variant="standard"
                                        name="type"
                                        fullWidth
                                        select
                                        onChange={formik.handleChange}
                                        value={formik.values.type}
                                        error={formik.touched.type && Boolean(formik.errors.type)}
                                        helperText={formik.touched.type && formik.errors.type}>
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

                            </Grid>
                            <Box mb={3} mt={3} display={"flex"} gap={2} flexDirection={"row-reverse"}>
                                <Button onClick={() => formik.handleSubmit()} color="success" variant="contained">Save</Button>
                                <Button onClick={() => handleReset()} color="warning" variant="contained">Reset</Button>
                                <Button onClick={() => handleTabChange("previous", 0)} color="info" variant="contained">Previous</Button>
                            </Box>

                        </Box>

                    </Grid>
                </form>
            </Box>

        </MainCard>
    )
}
export default AddTrackPage;