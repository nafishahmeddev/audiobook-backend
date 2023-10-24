import {
    Box, TextField, Stack, Button,
    Grid, Switch
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useEffect } from "react";
import { useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as BooksServices from "@app/services/admin/books/BooksServices";
import { useSnackbar } from 'notistack';
import FormDialog from "./components/form.dialog";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useNavigate } from "react-router-dom";


import MainCard from '@app/themes/ui-component/cards/MainCard';
import Country from "@app/assets/Countries.js";
import LanguageData from "@app/assets/LanguageData.js";

function AlbumPage() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();


    const [booksCount, setBooksCount] = useState(0);
    const [booksLimit, setBooksLimit] = useState(20);
    const [booksPage, setBooksPage] = useState(0);
    const [booksLoading, setBooksLoading] = useState(false);
    const [books, setBooks] = useState([]);

    const [formDialog, setFormDialog] = useState({
        open: false,
        row: null
    });


    const columns = [
        {
            field: 'publisher',
            headerName: 'Publisher',
            minWidth: 100,
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            renderCell: ({ value }) => value?.name,
        },
        {
            field: 'bookName',
            headerName: 'Book Name',
            minWidth: 200,
            flex: 1,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'author',
            headerName: 'Author',
            minWidth: 100,
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            renderCell: ({ value }) => value?.name,
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
            field: 'countryIso',
            headerName: 'countries',
            minWidth: 50,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ value }) => value?.map(country => Country[country]),
        },
        {
            field: 'releaseDate',
            headerName: 'Release Date',
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'category',
            headerName: 'Category',
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ value }) => value?.name,
        },
        {
            field: 'isActive',
            headerName: 'Active',
            minWidth: 50,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ value, row }) => <Switch defaultChecked={value} onChange={e => updateBook(row._id, { isActive: e.target.checked })} />,
        },
        {
            field: 'audioBookType',
            headerName: 'Audio Book Type',
            minWidth: 50,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ value, row }) => value ?? "Book",
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDelete(params.row)}
                    key={`action_delete`}
                />,
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Toggle Admin"
                    onClick={() => handleOpenFormDialog(params.row)}
                    key={`action-edit-admin`}
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
        setBooksLoading(true);
        BooksServices.all({ filter }, booksPage + 1, booksLimit).then(res => {
            console.log('the res data is ', res.data);
            setBooks(res.data);
            setBooksCount(res.data.count);
        }).catch(err => {
            console.error(err);
            setBooksLoading(false);
        }).finally(() => {
            setBooksLoading(false);
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

    const addNewAlbum = () => {
        navigate('/add-albums');
    }

    const updateBook = (_id, body) => {
        BooksServices.update(_id, body).then((res) => {
            enqueueSnackbar(res.message, { variant: "success" });
            formik.handleSubmit();
        }).catch(err => {
            enqueueSnackbar(err.message, { variant: "error" });
        })
    }

    const handleDelete = (row = null) => {
        if (window.confirm("Are you sure?")) {
            BooksServices.destroy(row._id).then(res => {
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
    }, [booksLimit, booksPage, handleSubmit]);

    return (
        <MainCard title="Books">
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
                    rows={books ?? []}
                    rowCount={booksCount}
                    loading={booksLoading}
                    checkboxSelection
                    rowsPerPageOptions={[20, 50, 100]}
                    pagination
                    page={booksPage}
                    pageSize={booksLimit}
                    paginationMode="server"
                    onPageChange={(page) => setBooksPage(page)}
                    onPageSizeChange={pageSize => setBooksLimit(pageSize)}

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
        </MainCard>
    )
}
export default AlbumPage;