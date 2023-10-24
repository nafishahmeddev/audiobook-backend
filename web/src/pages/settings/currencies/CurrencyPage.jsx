import {
    Typography, Box, TextField, Stack, Button, Card,
    MenuItem, Grid, Container, Avatar
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useEffect } from "react";
import { useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as CurrencyService from "@app/services/admin/settings/currency/CurrencyServices";
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


    const [currencyCount, setCurrencyCount] = useState(0);
    const [currencyLimit, setCurrencyLimit] = useState(20);
    const [currencyPage, setCurrencyPage] = useState(0);
    const [currencyLoading, setCurrencyLoading] = useState(false);
    const [addressUpdate] = useState(false);
    const [currencies, setCurrencies] = useState([]);

    const [formDialog, setFormDialog] = useState({
        open: false,
        row: null
    });


    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 100,
            flex: 1,
            align:'left',
            headerAlign: 'left',
        },
        {
            field: 'namePlural',
            headerName: 'Plural Name',
            minWidth: 150,
            align:'left',
            headerAlign: 'left',
            flex: 1,
        },
        {
            field: 'code',
            headerName: 'Code',
            minWidth: 100,
            align:'center',
            headerAlign: 'center',
            flex: 1,
        },
        {
            field: 'symbol',
            headerName: 'Symbol',
            minWidth: 100,
            align:'center',
            headerAlign: 'center',
            flex: 1,
        },
        {
            field: 'symbolNative',
            headerName: 'Native Symbol',
            minWidth: 100,
            align:'center',
            headerAlign: 'center',
            flex: 1,
        },
        {
            field: 'decimalDigits',
            headerName: 'Decimal digits',
            minWidth: 100,
            align:'center',
            headerAlign: 'center',
            flex: 1,
        },
        {
            field: 'rounding',
            headerName: 'Rounding',
            minWidth: 100,
            align:'center',
            headerAlign: 'center',
            flex: 1,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 200,
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
            fetchcurrency(values);
        },
    });

    const fetchcurrency = (filter = {}) => {
        console.log('gone to service');
        setCurrencyLoading(true);
        CurrencyService.all({ filter }, currencyPage + 1, currencyLimit).then(res => {
            setCurrencies(res.data.records);
            setCurrencyCount(res.data.count);
            console.log('the length is ', Object.keys(filter).length);
            if (filter.name == "") {
                // setcurrencyList(res.data.records);
            }
        }).catch(err => {
            console.error(err);
            setCurrencyLoading(false);
        }).finally(() => {
            setCurrencyLoading(false);
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
            CurrencyService.destroy(row._id).then(res => {
                enqueueSnackbar(res.message, { variant: "success" });
                formik.handleSubmit();
            }).catch(err => {
                enqueueSnackbar(err.message, { variant: "error" });
            })
        }
    }

    const handleUpdate = (row, data) => {
        if (window.confirm("Are you sure?")) {
            CurrencyService.update(row._id, data).then(res => {
                enqueueSnackbar(res.message, { variant: "success" });
                setCurrencies(currencies.map(ob => {
                    if (ob._id == row._id) {
                        ob = {
                            ...ob,
                            ...data
                        }
                    }
                    return ob;
                }));
            }).catch(err => {
                enqueueSnackbar(err.message, { variant: "error" });
            })
        }
    }

    const { handleSubmit } = formik;

    useEffect(() => {
        handleSubmit();
    }, [currencyPage, handleSubmit]);

    useEffect(() => {
        if (currencyPage === 0) handleSubmit();
    }, [currencyLimit, currencyPage, handleSubmit]);

    return (
        <MainCard title="Currencies">
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
                                    <Button color="secondary" variant="contained" type="button" size="small" onClick={() => { handleOpenFormDialog() }}>Add Currency</Button>
                                </Grid>

                            </Grid>
                        </form>
                    </Box>

                </Box>
            </Stack>

            <Box sx={{ height: '70vh' }}>
            <DataGrid
                rows={currencies}
                rowCount={currencyCount}
                loading={currencyLoading}
                checkboxSelection
                rowsPerPageOptions={[20, 50, 100]}
                pagination
                page={currencyPage}
                pageSize={currencyLimit}
                paginationMode="server"
                onPageChange={(page) => setCurrencyPage(page)}
                onPageSizeChange={pageSize => setCurrencyLimit(pageSize)}

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