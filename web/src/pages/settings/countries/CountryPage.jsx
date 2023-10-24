import {
    Typography, Box, TextField, Stack, Button, Card,
    MenuItem, Grid, Container, Avatar
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useEffect } from "react";
import { useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { useNavigate } from "react-router-dom";


import SubCard from '@app/themes/ui-component/cards/SubCard';
import MainCard from '@app/themes/ui-component/cards/MainCard';
import SecondaryAction from '@app/themes/ui-component/cards/CardSecondaryAction';
import CountriesImage from "@app/assets/CountriesImage.js";
import FormDialog from "./components/form.dialog";

//services
import * as CountryService from "@app/services/admin/settings/country/CountryServices";

function AdminDealersPage() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();


    const [countryCount, setCountryCount] = useState(0);
    const [countryLimit, setCountryLimit] = useState(20);
    const [countryPage, setCountryPage] = useState(0);
    const [countryLoading, setCountryLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [countryList, setCountryList] = useState([]);

    const [formDialog, setFormDialog] = useState({
        open: false,
        row: null
    });


    const columns = [
        {
            field: 'isoCode',
            headerName: 'Country',
            minWidth: 150,
            flex: 1,
            renderCell: ({ value, row }) => <Box sx={{display: "flex", alignItems: 'center'}}><Avatar
                alt={value}
                src={CountriesImage[value]}
            />&nbsp;
            ({value})
            </Box>
        },
        {
            field: 'currency',
            headerName: 'Currency',
            minWidth: 100,
            align:'left',
            headerAlign: 'left',
            flex: 1,
        },
        {
            field: 'paymentGateways',
            headerName: 'Payment Gateways',
            minWidth: 250,
            align:'left',
            headerAlign: 'left',
            flex: 1,
            renderCell: ({ value, row }) => value.map(gateway => gateway).join(', ')
        },
        {
            field: 'sharedMessage',
            headerName: 'Shared Message',
            minWidth: 200,
            flex: 1,
            align:'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            align:'center',
            headerAlign: 'center',
            flex: 1,
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
            fetchCountry(values);
        },
    });

    const fetchCountry = (filter = {}) => {
        setCountryLoading(true);
        CountryService.all({ filter }, countryPage + 1, countryLimit).then(res => {
            setCountries(res.data.records);
            setCountryList(res.data.countries);
            setCountryCount(res.data.count);
        }).catch(err => {
            console.error(err);
            setCountryLoading(false);
        }).finally(() => {
            setCountryLoading(false);
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
            CountryService.destroy(row._id).then(res => {
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
    }, [countryLimit, countryPage, handleSubmit]);

    return (
        <MainCard title="Country">
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
                                    <Button color="secondary" variant="contained" type="button" size="small" onClick={() => { handleOpenFormDialog() }}>New country</Button>
                                </Grid>

                            </Grid>
                        </form>
                    </Box>

                </Box>
            </Stack>

            <Box sx={{ height: '70vh' }}>
            <DataGrid
                rows={countries}
                rowCount={countryCount}
                loading={countryLoading}
                checkboxSelection
                rowsPerPageOptions={[20, 50, 100]}
                pagination
                page={countryPage}
                pageSize={countryLimit}
                paginationMode="server"
                onPageChange={(page) => setCountryPage(page)}
                onPageSizeChange={pageSize => setCountryLimit(pageSize)}
                slotProps={{
                    pagination: { classes: null }
                  }}
                columns={columns}
                disableSelectionOnClick
                autoHeight
                getRowId={(record) => record._id}
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
                countryList={countryList}
                onClose={handleCloseFormDialog}
                onConfirm={() => {
                    handleCloseFormDialog();
                    formik.handleSubmit()
                }} />
        </MainCard>
    )
}
export default AdminDealersPage;