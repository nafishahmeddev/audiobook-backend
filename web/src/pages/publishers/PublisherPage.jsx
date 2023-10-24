import {
    Typography, Box, TextField, Stack, Button, Card,
    MenuItem, Grid, Container, Avatar
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useEffect } from "react";
import { useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as PublisherService from "@app/services/admin/publisher/PublisherServices";
import { useSnackbar } from 'notistack';
import FormDialog from "./components/form.dialog";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreTimeIcon from '@mui/icons-material/MoreTime';

import { useNavigate } from "react-router-dom";


import SubCard from '@app/themes/ui-component/cards/SubCard';
import MainCard from '@app/themes/ui-component/cards/MainCard';
import SecondaryAction from '@app/themes/ui-component/cards/CardSecondaryAction';
import Country from "@app/assets/Countries.js";
import CountriesImage from "@app/assets/CountriesImage.js";

function AdminDealersPage() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();


    const [publisherCount, setPublisherCount] = useState(0);
    const [publisherLimit, setPublisherLimit] = useState(20);
    const [publisherPage, setPublisherPage] = useState(0);
    const [publisherLoading, setPublisherLoading] = useState(false);
    const [publishers, setPublisher] = useState([]);

    const [formDialog, setFormDialog] = useState({
        open: false,
        row: null
    });


    const columns = [
        {
            field: 'country',
            headerName: 'Country',
            minWidth: 100,
            flex: 1,
            renderCell: ({ value, row }) => <Box sx={{display: "flex", alignItems: 'center'}}><Avatar
                alt={value}
                src={CountriesImage[value]}
            />&nbsp;
            ({value})
            </Box>
        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 100,
            flex: 1,
            align:'left',
            headerAlign: 'left',
        },
        {
            field: 'contactPerson',
            headerName: 'Contact Person',
            minWidth: 200,
            flex: 1,
            align:'left',
            headerAlign: 'left',
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 150,
            flex: 1,
            align:'left',
            headerAlign: 'left',
        },
        {
            field: 'balance',
            headerName: 'Balance',
            minWidth: 100,
            flex: 1,
            align:'center',
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
        setPublisherLoading(true);
        PublisherService.all({ filter }, publisherPage + 1, publisherLimit).then(res => {
            setPublisher(res.data.records);
            setPublisherCount(res.data.count);
            if (filter.name == "") {
                // setPublisherList(res.data.records);
            }
        }).catch(err => {
            console.error(err);
            setPublisherLoading(false);
        }).finally(() => {
            setPublisherLoading(false);
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



    const handleDelete = (row = null) => {
        if (window.confirm("Are you sure?")) {
            PublisherService.destroy(row._id).then(res => {
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
    }, [publisherPage, handleSubmit]);

    useEffect(() => {
        if (publisherPage === 0) handleSubmit();
    }, [publisherLimit, publisherPage, handleSubmit]);

    return (
        <MainCard title="Publishers">
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
                                    <Button color="secondary" variant="contained" type="button" size="small" onClick={() => { handleOpenFormDialog() }}>New Publisher</Button>
                                </Grid>

                            </Grid>
                        </form>
                    </Box>

                </Box>
            </Stack>

            <Box sx={{ height: '70vh' }}>
            <DataGrid
                rows={publishers}
                rowCount={publisherCount}
                loading={publisherLoading}
                checkboxSelection
                rowsPerPageOptions={[20, 50, 100]}
                pagination
                page={publisherPage}
                pageSize={publisherLimit}
                paginationMode="server"
                onPageChange={(page) => setPublisherPage(page)}
                onPageSizeChange={pageSize => setPublisherLimit(pageSize)}

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
export default AdminDealersPage;