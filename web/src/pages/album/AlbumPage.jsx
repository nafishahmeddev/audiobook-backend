import {
    Box, TextField, Stack, Button,
    Grid, Switch
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useEffect } from "react";
import { useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as AlbumServices from "@app/services/admin/album/AlbumServices";
import { useSnackbar } from 'notistack';
import FormDialog from "./components/form.dialog";
import TrackDialog from "./components/track.dialog";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

import { useNavigate } from "react-router-dom";


import MainCard from '@app/themes/ui-component/cards/MainCard';
import Country from "@app/assets/Countries.js";
import LanguageData from "@app/assets/LanguageData.js";

function AlbumPage() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();


    const [albumsCount, setAlbumsCount] = useState(0);
    const [albumsLimit, setAlbumsLimit] = useState(20);
    const [albumsPage, setAlbumsPage] = useState(0);
    const [albumsLoading, setAlbumsLoading] = useState(false);
    const [albums, setAlbums] = useState([]);

    const [formDialog, setFormDialog] = useState({
        open: false,
        row: null
    });

    const [trackDialog, setTrackDialog] = useState({
        open: false,
        row: null
    });


    const columns = [
        {
            field: 'title',
            headerName: 'Title',
            minWidth: 200,
            flex: 1,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'authors',
            headerName: 'Author',
            minWidth: 100,
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            renderCell: ({ value }) => value?.map((author) => author.firstName)?.join(', '),
        },
        {
            field: 'language',
            headerName: 'Language',
            minWidth: 50,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ value }) => LanguageData[value ?? 'en'].name,
        },
        {
            field: 'type',
            headerName: 'Audio Book Type',
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDelete(params.row)}
                    key={`action_delete`}
                />,
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit Album"
                    onClick={() => navigate(`${params.row._id}/add-albums`)}
                    key={`action-edit-admin`}
                />,
                <GridActionsCellItem
                    icon={<QueueMusicIcon />}
                    label="Toggle Track Dialog"
                    onClick={() => navigate(`${params.row._id}/track-list`)}
                    key={`action-edit-track-dialog`}
                />,
            ],
        },

    ];
    const formik = useFormik({
        initialValues: {
            name: "",
        },
        validationSchema: yup.object({
            name: yup.string("Please enter order id"),
        }),
        onSubmit: (values) => {
            fetchPublisher(values);
        },
    });

    const fetchPublisher = (filter = {}) => {
        setAlbumsLoading(true);
        AlbumServices.all({ filter }, albumsPage + 1, albumsLimit).then(res => {
            setAlbums(res.result.albums);
            setAlbumsCount(res.result.count);
        }).catch(err => {
            console.error(err);
            setAlbumsLoading(false);
        }).finally(() => {
            setAlbumsLoading(false);
        });
    }

    //form dialog
    const handleOpenFormDialog = (row = null) => {
        setFormDialog({
            open: true,
            row: row
        })
    }
    const handleCloseFormDialog = () => {
        setFormDialog({
            open: false,
            row: null
        })
    }

    //track dialog
    const handleOpenTrackDialog = (row = null) => {
        setTrackDialog({
            open: true,
            row: row
        })
    }
    const handleCloseTrackDialog = () => {
        setTrackDialog({
            open: false,
            row: null
        })
    }

    const addNewAlbum = () => {
        navigate('/add-albums');
    }

    const updateBook = (_id, body) => {
        AlbumServices.update(_id, body).then((res) => {
            enqueueSnackbar(res.message, { variant: "success" });
            formik.handleSubmit();
        }).catch(err => {
            enqueueSnackbar(err.message, { variant: "error" });
        })
    }

    const handleDelete = (row = null) => {
        if (window.confirm("Are you sure?")) {
            AlbumServices.destroy(row._id).then(res => {
                enqueueSnackbar(res.message, { variant: "success" });
                formik.handleSubmit();
            }).catch(err => {
                enqueueSnackbar(err.message, { variant: "error" });
            })
        }
    }

    const { handleSubmit } = formik;

    useEffect(() => {
        handleSubmit();
    }, [albumsLimit, albumsPage, handleSubmit]);

    return (
        <MainCard title="Albums">
            <Stack direction="column" alignItems="center" justifyContent="space-between" mb={5}>
                <Box sx={{ width: '100%' }}>
                    <Box>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2} direction="row" alignItems="flex-end">
                                <Grid item xs sx={{ minWidth: 150 }}>
                                    <TextField margin="dense"
                                        variant="standard"
                                        label="Name"
                                        name="name"
                                        id="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button color="secondary" variant="contained" type="submit" size="small">Search</Button>
                                </Grid>
                                <Grid item>
                                    <Button color="secondary" variant="contained" type="button" size="small" onClick={() => { formik.resetForm(); formik.handleSubmit() }}>Reset</Button>
                                </Grid>

                                <Grid item>
                                    <Button color="secondary" variant="contained" type="button" size="small" onClick={() => { addNewAlbum() }}>New Album</Button>
                                </Grid>

                            </Grid>
                        </form>
                    </Box>

                </Box>
            </Stack>

            <Box>
                <DataGrid
                    rows={albums ?? []}
                    rowCount={albumsCount}
                    loading={albumsLoading}
                    checkboxSelection
                    rowsPerPageOptions={[20, 50, 100]}
                    pagination
                    page={albumsPage}
                    pageSize={albumsLimit}
                    paginationMode="server"
                    onPageChange={(page) => setAlbumsPage(page)}
                    onPageSizeChange={pageSize => setAlbumsLimit(pageSize)}

                    columns={columns}
                    disableSelectionOnClick
                    autoHeight
                    getRowId={(record) => record._id}
                    getRowClassName={() => 'paxton-table--row'}
                    getRowHeight={() => 50}
                    density="compact"
                    initialState={{
                        pagination: {
                            page: 1,
                        },
                    }}
                />
            </Box>


            <FormDialog
                {...formDialog}
                onClose={handleCloseFormDialog}
                onConfirm={() => {
                    handleCloseFormDialog();
                    formik.handleSubmit()
                }} />

            <TrackDialog
                {...trackDialog}
                onClose={handleCloseTrackDialog}
                onConfirm={() => {
                    handleCloseTrackDialog();
                    formik.handleSubmit()
                }} />
        </MainCard>
    )
}
export default AlbumPage;