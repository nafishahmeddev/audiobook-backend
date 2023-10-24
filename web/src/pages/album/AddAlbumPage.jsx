import {
    Button, TextField, Box,
    MenuItem, Grid, Stack, Typography, Tab
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react"
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as BooksServices from "@app/services/admin/books/BooksServices";
import * as AuthorServices from "@app/services/admin/settings/author/AuthorServices";
import * as ListServices from "@app/services/admin/settings/list/ListServices";
import * as GenreServices from "@app/services/admin/settings/genre/GenreServices";
import { useSnackbar } from 'notistack';
import ChapterRow from "./components/chapter.row";

import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useNavigate } from "react-router-dom";

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

AddAlbumPage.propTypes = {
    row: PropTypes.object,
}

function AddAlbumPage({ row }) {
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

    const formik = useFormik({
        initialValues: {
            title: "",
            excerpt: "",
            description: "",
            slug: "",
            language: "",
            totalTracks: "",
            thumbnail: "",
            duration: "",
            authors: [],
            genres: [],
            lists: [],
            type: ""
        },
        validationSchema: yup.object({
            title: yup.string("Enter Audio Book Type").required("Audio Book Type is required"),
            excerpt: yup.string("Enter Excerpt").required("Excerpt is required"),
            description: yup.string("Enter Description").required("Description is required"),
            slug: yup.string("Enter slug").required("slug is required"),
            language: yup.string("Select language").required("language is required"),
            totalTracks: yup.string("Enter Total Tracks").required("Total Tracks is required"),
            thumbnail: yup.string("Select thumbnail").required("thumbnail is required"),
            duration: yup.string("Select duration").required("duration is required"),
            authors: yup.string("Select Authors").required("Authors is required"),
            genres: yup.string("Select genres").required("genres is required"),
            lists: yup.string("Select Lists").required("Lists is required"),
            type: yup.string("Select type").required("type is required"),
        }),
        onSubmit: (values) => {
            addBook(values);
        },
    });

    const addBook = (values) => {
        setBooksLoading(true);
        let request;
        if (values._id) {
            request = BooksServices.update(values._id, values);
        } else {
            request = BooksServices.create(values);
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
            type: row?.type ?? ""
        })
    }, [row, setValues])

    const initialData = () => {
        console.log(file);
        console.log(booksLoading);
        AuthorServices.getAll().then(res => {
            setAuthorList(res.data.records);
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
        console.log('the chapter Rows are ', chapterRows);
        initialData();
    }, [chapterRows]);

    const handleReset = () => {
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
            type: row?.type ?? ""
        })
    }


    const handleAbort = (queue) => {
        controller.abort();
        setController(null);
        dispatch(ChapterQueuesActions.update({
            ...queue,
            isFailed: true,
            retried: 3,
            progress: 0
        }));
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
        <MainCard title="Add Album">

            <Box>
                <form onSubmit={formik.handleSubmit} encType="multipart/form-data">

                    <Grid container spacing={2} rowSpacing={1}>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Book Basic Info" {...a11yProps(0)} />
                                    <Tab label="Book General Info" {...a11yProps(1)} />
                                    <Tab label="Chapters" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={value} index={0}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                    <EditIcon /><span style={{ fontSize: "16px", marginLeft: "2%" }}> Please enter basic book info below </span>
                                </Box>
                                <Grid container spacing={4} rowSpacing={0.1}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="AudioBook Type"
                                            margin="dense"
                                            variant="standard"
                                            name="type"
                                            fullWidth
                                            select
                                            onChange={formik.handleChange}
                                            value={formik.values.type}
                                            error={formik.touched.type && Boolean(formik.errors.type)}
                                            helperText={formik.touched.type && formik.errors.type}>
                                            <MenuItem value="1" key="book">Book</MenuItem>
                                            <MenuItem value="2" key="podcast">Podcast</MenuItem>
                                            <MenuItem value="2" key="song">Song</MenuItem>
                                        </TextField>
                                    </Grid>

                                    <Grid item xs={12}>
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
                                            label="Author"
                                            margin="dense"
                                            variant="standard"
                                            name="author"
                                            fullWidth
                                            select
                                            onChange={formik.handleChange}
                                            value={formik.values.author}
                                            error={formik.touched.author && Boolean(formik.errors.author)}
                                            helperText={formik.touched.author && formik.errors.author}>
                                            <MenuItem value=""></MenuItem>
                                            {authorList.map(author => (
                                                <MenuItem value={author._id} key={`author-item-${author._id}`}>
                                                    {author.name}
                                                </MenuItem>
                                            ))}

                                        </TextField>
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
                                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                                            <span style={{ fontSize: "16px", marginLeft: "2%" }}>  Upload Book Cover: </span>
                                            <label htmlFor="bookCover">
                                                <Button variant="contained" component="span">
                                                    Upload Book Cover
                                                </Button>
                                                <input
                                                    id="bookCover"
                                                    hidden
                                                    name="bookCover"
                                                    accept="image/*"
                                                    type="file"
                                                    onChange={(event) => {
                                                        formik.setFieldValue('bookCover', event.currentTarget.files[0]);
                                                    }}
                                                />
                                            </label>
                                            {formik.values.bookCover && <img src={formik.values.bookCover} alt="Author Image" height="300" />}
                                        </Stack>
                                    </Grid>


                                </Grid>

                                <Box mb={3} mt={3} display={"flex"} gap={2} flexDirection={"row-reverse"}>
                                    <Button onClick={() => handleTabChange("submit", 1)} color="success" variant="contained">Next</Button>
                                    <Button onClick={() => handleReset()} color="warning" variant="contained">Reset</Button>
                                    <Button onClick={() => navigate('/book')} color="error" variant="contained">Cancel</Button>
                                </Box>
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                    <EditIcon /><span style={{ fontSize: "16px", marginLeft: "2%" }}> Please enter general info below </span>
                                </Box>
                                <Grid container spacing={4} rowSpacing={0.1}>


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
                                            <MenuItem value=""></MenuItem>
                                            {lists.map(list => (
                                                <MenuItem value={list._id} key={`country-item-${list._id}`}>
                                                    {list.name}
                                                </MenuItem>
                                            ))}

                                        </TextField>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            label="Tags"
                                            margin="dense"
                                            variant="standard"
                                            name="tags"
                                            fullWidth
                                            select
                                            multiple
                                            onChange={formik.handleChange}
                                            value={formik.values.tags}
                                            error={formik.touched.tags && Boolean(formik.errors.tags)}
                                            helperText={formik.touched.tags && formik.errors.tags}>
                                            <MenuItem value=""></MenuItem>
                                            {tagList.map(tag => (
                                                <MenuItem value={tag._id} key={`tag-item-${tag._id}`}>
                                                    {tag.name}
                                                </MenuItem>
                                            ))}

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
                                            <MenuItem value=""></MenuItem>
                                            {genreList.map(genre => (
                                                <MenuItem value={genre._id} key={`genre-item-${genre._id}`}>
                                                    {genre.name}
                                                </MenuItem>
                                            ))}

                                        </TextField>
                                    </Grid>


                                </Grid>
                                <Box mb={3} mt={3} display={"flex"} gap={2} flexDirection={"row-reverse"}>
                                    <Button onClick={() => handleTabChange("submit", 2)} color="success" variant="contained">Next</Button>
                                    <Button onClick={() => handleReset()} color="warning" variant="contained">Reset</Button>
                                    <Button onClick={() => handleTabChange("previous", 0)} color="info" variant="contained">Previous</Button>
                                </Box>
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={2}>
                                {/* Chapters uploading form */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                    <CloudUploadIcon /><span style={{ fontSize: "16px", marginLeft: "2%" }}> Upload Chapters Here... </span>
                                </Box>

                                <Grid container spacing={4} rowSpacing={0.1}>
                                    <Grid item xs={12}>
                                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                                            <span style={{ fontSize: "16px", marginLeft: "2%" }}> Chapters: </span>
                                            {/* <label htmlFor="chapters"> */}
                                            {chapterRows &&
                                                <ChapterRow chapterRows={chapterRows} />
                                            }

                                            {Object.values(queues).map(queue => (
                                                <ChapterQueueItem key={queue.key}
                                                    queue={{ ...queue, isUploading: isUploading == queue.key }}
                                                    onAbort={handleAbort}
                                                    onDelete={handleDelete} />
                                            ))}

                                            <Box>
                                                <ChapterUploader handleChange={handleChange} handleAudioWithTitle={audioWithTitle} name="file" types={fileTypes} multiple={true} />
                                                <Box mb={3} mt={10} mr={3} display={"flex"} gap={2} flexDirection={"row-reverse"}>
                                                    <Button type="submit" color="success" variant="contained">Save</Button>
                                                    <Button onClick={() => handleReset()} color="warning" variant="contained">Reset</Button>
                                                    <Button onClick={() => handleTabChange("previous", 1)} color="info" variant="contained">Previous</Button>
                                                </Box>
                                            </Box>

                                        </Stack>


                                    </Grid>
                                </Grid>
                            </CustomTabPanel>
                        </Box>

                    </Grid>
                </form>
            </Box>

        </MainCard>
    )
}
export default AddAlbumPage;