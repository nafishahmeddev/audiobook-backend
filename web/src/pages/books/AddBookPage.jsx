import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Box,
    MenuItem, Grid, Container, Avatar, Switch, Stack, FormControlLabel, Typography, Tab
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react"
import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import * as BooksServices from "@app/services/admin/books/BooksServices";
import * as PublisherServices from "@app/services/admin/publisher/PublisherServices";
import * as AuthorServices from "@app/services/admin/settings/author/AuthorServices";
import * as SpeakerServices from "@app/services/admin/settings/speaker/SpeakerServices";
import * as CountryServices from "@app/services/admin/settings/country/CountryServices";
import * as CategoryServices from "@app/services/admin/settings/category/CategoryServices";
import * as ListServices from "@app/services/admin/settings/list/ListServices";
import * as TagServices from "@app/services/admin/settings/tag/TagServices";
import * as GenreServices from "@app/services/admin/settings/genre/GenreServices";
import * as ProvisionTemplateServices from "@app/services/admin/settings/provision-template/ProvisionTemplateServices";
import { useSnackbar } from 'notistack';
import ChapterDialog from "./components/chapter.dialog";
import ChapterRow from "./components/chapter.row";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useNavigate } from "react-router-dom";


import SubCard from '@app/themes/ui-component/cards/SubCard';
import MainCard from '@app/themes/ui-component/cards/MainCard';
import SecondaryAction from '@app/themes/ui-component/cards/CardSecondaryAction';
import Country from "@app/assets/Countries.js";
import LanguageData from "@app/assets/LanguageData.js";
import PropTypes from 'prop-types';
import { Tabs as MuiTabs } from '@mui/material';
import { styled } from '@mui/material';
import { ChapterUploader } from "@app/components/DragDropFiles";

const fileTypes = ["MP3", "OGG", "WAV"];

const Tabs = styled(MuiTabs)(({ theme }) => ({
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

function AddBookPage({ row, onClose, onConfirm }) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [publisherList, setPublisherList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [authorList, setAuthorList] = useState([]);
    const [speakerList, setSpeakerList] = useState([]);
    const [proTemplateList, setProTemplateList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [lists, setLists] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [value, setValue] = useState(0);
    const [chapterRows, setChaptersRows] = useState([]);
    const [file, setFile] = useState(null);
    const [booksLoading, setBooksLoading] = useState(false);

    const reference = useRef();
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

    const [chapterDialog, setChapterDialog] = useState({
        open: false,
        row: null,
    });

    const ChapterUpload = (data) => {
        setChaptersRows(data);
    }

    const formik = useFormik({
        initialValues: {
            audioBookType: "",
            publisher: "",
            originalName: "",
            bookName: "",
            author: "",
            speakers: "",
            language: "",
            countries: "",
            isbn: "",
            publishingYear: "",
            provisionTemplate: "",
            bookCover: "",
            releaseDate: "",
            category: "",
            lists: "",
            tags: "",
            genres: "",
            isExclusive: false,
            active: false,
            audioBookSample: "",
            audioBookSampleLength: "",
            chapters: [],
        },
        validationSchema: yup.object({
            audioBookType: yup.string("Select Audio Book Type").required("Audio Book Type is required"),
            publisher: yup.string("Select Publisher").required("Publisher is required"),
            originalName: yup.string("Enter Original Name").required("Original Name is required"),
            bookName: yup.string("Enter Book Name").required("Book Name is required"),
            author: yup.string("Select Author").required("Author is required"),
            speakers: yup.string("Select Speakers").required("Speakers is required"),
            language: yup.string("Select language").required("Language is required"),
            countries: yup.string("Select countries").required("Countries is required"),
            isbn: yup.string("Enter ISBN").required("ISBN is required"),
            publishingYear: yup.string("Select Publishing Year").required("Publishing Year is required"),
            provisionTemplate: yup.string("Select Provision Template").required("Provision Template is required"),
            bookCover: yup.string("Select Book Cover").required("Book Cover is required"),
            releaseDate: yup.string("Select Release Date").required("Release Date is required"),
            category: yup.string("Select Category").required("Category is required"),
            lists: yup.string("Select Lists").required("Lists is required"),
            tags: yup.string("Select Tags").required("Tags is required"),
            genres: yup.string("Select Tags").required("Tags is required"),
            audioBookSample: yup.string("Select Audio Book Sample").required("Audio Book Sample is required"),
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

        }).finally(() => {
            setBooksLoading(false);
        });


    }

    const { setValues } = formik;
    useEffect(() => {
        setValues({
            audioBookType: row?.audioBookType ?? "",
            publisher: row?.publisher ?? "",
            originalName: row?.originalName ?? "",
            bookName: row?.bookName ?? "",
            author: row?.author ?? "",
            speakers: row?.speakers ?? "",
            language: row?.language ?? "",
            countries: row?.countries ?? "",
            isbn: row?.isbn ?? "",
            publishingYear: row?.publishingYear ?? "",
            provisionTemplate: row?.provisionTemplate ?? "",
            bookCover: row?.bookCover ?? "",
            releaseDate: row?.releaseDate ?? "",
            category: row?.category ?? "",
            lists: row?.lists ?? "",
            tags: row?.tags ?? "",
            genres: row?.genres ?? "",
            isExclusive: row?.isExclusive ?? false,
            active: row?.active ?? false,
            audioBookSample: row?.audioBookSample ?? "",
            audioBookSampleLength: row?.audioBookSampleLength ?? "",
            chapters: row?.chapters ?? [],
        })
    }, [row, setValues])

    // const updateBook = (_id, body) => {
    //     BooksServices.update(_id, body).then((res) => {
    //         enqueueSnackbar(res.message, { variant: "success" });
    //         formik.handleSubmit();
    //     }).catch(err => {
    //         enqueueSnackbar(err.message, { variant: "error" });
    //     })
    //   }

    const initialData = () => {
        AuthorServices.getAll().then(res => {
            setAuthorList(res.data.records);
        }).catch(err => {
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });

        SpeakerServices.getAll().then(res => {
            setSpeakerList(res.data.records);
        }).catch(err => {
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });

        CountryServices.getAll().then(res => {
            console.log('the country data is ', res.data);
            setCountryList(res.data.records);
        }).catch(err => {
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });

        CategoryServices.getAll().then(res => {
            setCategoryList(res.data.records);
        }).catch(err => {
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });

        ListServices.getAll().then(res => {
            setLists(res.data.records);
        }).catch(err => {
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });

        TagServices.getAll().then(res => {
            setTagList(res.data.records);
        }).catch(err => {
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });

        GenreServices.getAll().then(res => {
            setGenreList(res.data.records);
        }).catch(err => {
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });

        PublisherServices.getAll().then(res => {
            setPublisherList(res.data.records);
        }).catch(err => {
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });

        ProvisionTemplateServices.getAll().then(res => {
            setProTemplateList(res.data.records);
        }).catch(err => {
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
        });
    }

    // const { handleSubmit } = formik;

    // useEffect(() => {
    //     handleSubmit();
    // }, [handleSubmit]);

    useEffect(() => {
        console.log('the chapter Rows are ', chapterRows);
        initialData();
    }, [chapterRows]);

    const handleReset = () => {
        setValues({
            audioBookType: row?.audioBookType ?? "",
            publisher: row?.publisher ?? "",
            originalName: row?.originalName ?? "",
            bookName: row?.bookName ?? "",
            author: row?.author ?? "",
            speakers: row?.speakers ?? "",
            language: row?.language ?? "",
            countries: row?.countries ?? "",
            isbn: row?.isbn ?? "",
            publishingYear: row?.publishingYear ?? "",
            provisionTemplate: row?.provisionTemplate ?? "",
            bookCover: row?.bookCover ?? "",
            releaseDate: row?.releaseDate ?? "",
            category: row?.category ?? "",
            lists: row?.lists ?? "",
            tags: row?.tags ?? "",
            genres: row?.genres ?? "",
            isExclusive: row?.isExclusive ?? false,
            active: row?.active ?? false,
            audioBookSample: row?.audioBookSample ?? "",
            audioBookSampleLength: row?.audioBookSampleLength ?? "",
            chapters: row?.chapters ?? [],
        })
    }

    //chapter dialog
    const handleChapterOpenDialog = (row = null, chaptersRow = null) => {
        setChapterDialog({
            open: true,
            row: row,
        })
    }
    const handleChapterCloseDialog = () => {
        setChapterDialog({
            open: false,
            row: null,
        })
    }

    const handleAdd = () => {
        const file = reference.current.files[0];
        if (!file) return alert("Please select file...")
        const key = Math.round(Math.random() * 9999);
        UploaderService.saveCacheFile(key, file)
            .then(res => {
                dispatch(ChapterQueuesActions.add({
                    key,
                    title: `This is title ${key}`,
                    bookName: "Ahilaki",
                    chapterName: "Chapter 1",
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
        <MainCard title="Add Book">

            <Box>
                <form onSubmit={formik.handleSubmit} encType="multipart/form-data">

                    <Grid container spacing={2} rowSpacing={1}>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Book Basic Info" {...a11yProps(0)} />
                                    <Tab label="Book General Info" {...a11yProps(1)} />
                                    <Tab label="Chapters" {...a11yProps(2)} />
                                    <Tab label="Publisher Info" {...a11yProps(3)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={value} index={0}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                    <EditIcon /><span style={{ fontSize: "16px", marginLeft: "2%" }}> Please enter basic book info below </span>
                                </Box>
                                <Grid container spacing={4} rowSpacing={0.1}>
                                    <Grid item xs={6}>
                                        <TextField
                                            InputLabelProps={{ shrink: true }}
                                            margin="dense"
                                            name="releaseDate"
                                            label="Release Date"
                                            type="date"
                                            fullWidth
                                            variant="standard"
                                            onChange={formik.handleChange}
                                            value={formik.values.releaseDate}
                                            error={Boolean(formik.touched.releaseDate && formik.errors.releaseDate)}
                                            helperText={formik.touched.releaseDate && formik.errors.releaseDate}
                                        />
                                    </Grid>


                                    <Grid item xs={6}>
                                        <TextField
                                            label="AudioBook Type"
                                            margin="dense"
                                            variant="standard"
                                            name="audioBookType"
                                            fullWidth
                                            select
                                            onChange={formik.handleChange}
                                            value={formik.values.audioBookType}
                                            error={formik.touched.audioBookType && Boolean(formik.errors.audioBookType)}
                                            helperText={formik.touched.audioBookType && formik.errors.audioBookType}>
                                            <MenuItem value="1" key="book">Book</MenuItem>
                                            <MenuItem value="2" key="podcast">Podcast</MenuItem>
                                        </TextField>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            margin="dense"
                                            id="originalName"
                                            name="originalName"
                                            label="Original Name"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            value={formik.values.originalName}
                                            onChange={formik.handleChange}
                                            error={formik.touched.originalName && Boolean(formik.errors.originalName)}
                                            helperText={formik.touched.originalName && formik.errors.originalName}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            margin="dense"
                                            id="bookName"
                                            name="bookName"
                                            label="Book Name"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            value={formik.values.bookName}
                                            onChange={formik.handleChange}
                                            error={formik.touched.bookName && Boolean(formik.errors.bookName)}
                                            helperText={formik.touched.bookName && formik.errors.bookName}
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
                                            label="Speaker"
                                            margin="dense"
                                            variant="standard"
                                            name="speakers"
                                            fullWidth
                                            select
                                            onChange={formik.handleChange}
                                            value={formik.values.speakers}
                                            error={formik.touched.speakers && Boolean(formik.errors.speakers)}
                                            helperText={formik.touched.speakers && formik.errors.speakers}>
                                            <MenuItem value=""></MenuItem>
                                            {speakerList.map(speaker => (
                                                <MenuItem value={speaker._id} key={`speaker-item-${speaker._id}`}>
                                                    {speaker.name}
                                                </MenuItem>
                                            ))}

                                        </TextField>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            label="Countries"
                                            margin="dense"
                                            variant="standard"
                                            name="countries"
                                            fullWidth
                                            select
                                            onChange={formik.handleChange}
                                            value={formik.values.countries}
                                            error={formik.touched.countries && Boolean(formik.errors.countries)}
                                            helperText={formik.touched.countries && formik.errors.countries}>
                                            <MenuItem value=""></MenuItem>
                                            {countryList.map(country => (
                                                <MenuItem value={country._id} key={`country-item-${country._id}`}>
                                                    {country.name}
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

                                    <Grid item xs={12}>
                                        <TextField
                                            margin="dense"
                                            id="isbn"
                                            name="isbn"
                                            label="ISBN"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            value={formik.values.isbn}
                                            onChange={formik.handleChange}
                                            error={formik.touched.isbn && Boolean(formik.errors.isbn)}
                                            helperText={formik.touched.isbn && formik.errors.isbn}
                                        />
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

                                    <Grid item xs={6}>
                                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                                            <span style={{ fontSize: "16px", marginLeft: "2%" }}> Sample Audio Book: </span>
                                            <label htmlFor="audioBookSample">
                                                <Button variant="contained" component="span">
                                                    Upload Sample Audio Book
                                                </Button>
                                                <input
                                                    id="audioBookSample"
                                                    hidden
                                                    name="audioBookSample"
                                                    accept="image/*"
                                                    type="file"
                                                    onChange={(event) => {
                                                        formik.setFieldValue('audioBookSample', event.currentTarget.files[0]);
                                                    }}
                                                />
                                            </label>
                                            {formik.values.audioBookSample && <img src={formik.values.audioBookSample} alt="Author Image" height="300" />}
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
                                            label="Category"
                                            margin="dense"
                                            variant="standard"
                                            name="category"
                                            fullWidth
                                            select
                                            multiple
                                            onChange={formik.handleChange}
                                            value={formik.values.category}
                                            error={formik.touched.category && Boolean(formik.errors.category)}
                                            helperText={formik.touched.category && formik.errors.category}>
                                            <MenuItem value=""></MenuItem>
                                            {categoryList.map(category => (
                                                <MenuItem value={category._id} key={`category-item-${category._id}`}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}

                                        </TextField>
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

                                    <Grid item xs={12}>
                                        <Grid container spacing={24}>
                                            <Grid container item xs={6}>
                                                <FormControlLabel
                                                    value={formik.values.isExclusive}
                                                    control={<Switch color="primary" />}
                                                    label="Exclusive"
                                                    labelPlacement="start"
                                                    defaultChecked={formik.values.isExclusive}
                                                    onChange={formik.handleChange}
                                                />
                                            </Grid>

                                            <Grid container item xs={6}>
                                                <FormControlLabel
                                                    value={formik.values.active}
                                                    control={<Switch color="primary" />}
                                                    label="Active"
                                                    labelPlacement="start"
                                                    defaultChecked={formik.values.active}
                                                    onChange={formik.handleChange}
                                                />
                                            </Grid>
                                        </Grid>
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
                                                    <Button onClick={() => handleTabChange("submit", 3)} color="success" variant="contained">Next</Button>
                                                    <Button onClick={() => handleReset()} color="warning" variant="contained">Reset</Button>
                                                    <Button onClick={() => handleTabChange("previous", 1)} color="info" variant="contained">Previous</Button>
                                                </Box>
                                            </Box>
                                            {/* <Button variant="contained" component="span" onClick={() => handleChapterOpenDialog()}>
                                                Add Chapters
                                            </Button> */}
                                            {/* <input
                                            id="chapters"
                                            hidden
                                            name="chapters"
                                            accept="image/*"
                                            type="file"
                                            onChange={(event) => {
                                                formik.setFieldValue('chapters', event.currentTarget.files[0]);
                                            }}
                                        />
                                    </label>
                                    {formik.values.chapters && <img src={formik.values.chapters} alt="Author Image" height="300" />} */}

                                        </Stack>


                                    </Grid>
                                </Grid>
                            </CustomTabPanel>

                            <CustomTabPanel value={value} index={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                    <EditIcon /><span style={{ fontSize: "16px", marginLeft: "2%" }}> Publishers Info Here... </span>
                                </Box>
                                <Grid container spacing={4} rowSpacing={0.1}>

                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                        <TextField
                                            InputLabelProps={{ shrink: true }}
                                            margin="dense"
                                            id="publishingYear"
                                            name="publishingYear"
                                            label="Publishing Year"
                                            type="date"
                                            fullWidth
                                            variant="standard"
                                            value={formik.values.publishingYear}
                                            onChange={formik.handleChange}
                                            error={formik.touched.publishingYear && Boolean(formik.errors.publishingYear)}
                                            helperText={formik.touched.publishingYear && formik.errors.publishingYear}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            label="Publisher"
                                            margin="dense"
                                            variant="standard"
                                            name="publisher"
                                            fullWidth
                                            select
                                            onChange={formik.handleChange}
                                            value={formik.values.publisher}
                                            error={formik.touched.publisher && Boolean(formik.errors.publisher)}
                                            helperText={formik.touched.publisher && formik.errors.publisher}>
                                            <MenuItem value=""></MenuItem>
                                            {publisherList.map(publisher => (
                                                <MenuItem value={publisher._id} key={`publisher-item-${publisher._id}`}>
                                                    {publisher.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            label="Provision Template"
                                            margin="dense"
                                            variant="standard"
                                            name="countries"
                                            fullWidth
                                            select
                                            onChange={formik.handleChange}
                                            value={formik.values.provisionTemplate}
                                            error={formik.touched.provisionTemplate && Boolean(formik.errors.provisionTemplate)}
                                            helperText={formik.touched.provisionTemplate && formik.errors.provisionTemplate}>
                                            <MenuItem value=""></MenuItem>
                                            {proTemplateList.map(proTemplate => (
                                                <MenuItem value={proTemplate._id} key={`pro-template-${proTemplate._id}`}>
                                                    {proTemplate.name}
                                                </MenuItem>
                                            ))}

                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Box mb={3} mt={3} display={"flex"} gap={2} flexDirection={"row-reverse"}>
                                    <Button type="submit" color="success" variant="contained">Save</Button>
                                    <Button onClick={() => handleReset()} color="warning" variant="contained">Reset</Button>
                                    <Button onClick={() => handleTabChange("previous", 2)} color="info" variant="contained">Previous</Button>
                                </Box>
                            </CustomTabPanel>
                        </Box>

                    </Grid>
                </form>
            </Box>

            {/* <ChapterDialog
                {...chapterDialog}
                chaptersRow={ChapterUpload}
                onClose={handleChapterCloseDialog}
                onConfirm={() => {
                    handleChapterCloseDialog();
                    formik.handleSubmit()
                }} /> */}

        </MainCard>
    )
}
export default AddBookPage;