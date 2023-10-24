import {
    Typography, Box, TextField, Stack, Button, Card,
    MenuItem, Grid, Container, Avatar
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useEffect } from "react";
import { useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as ProvisionTemplateService from "@app/services/admin/settings/provision-template/ProvisionTemplateServices";
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

function ProvisionTemplatePage() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [templateCount, setTemplateCount] = useState(0);
    const [templateLimit, setTemplateLimit] = useState(20);
    const [templatePage, setTemplatePage] = useState(0);
    const [templateLoading, setTemplateLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [countries, setCountries] = useState([]);

    const [formDialog, setFormDialog] = useState({
        open: false,
        row: null
    });


    const columns = [
        {
            field: 'countryIso',
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
            field: 'name',
            headerName: 'Name',
            minWidth: 150,
            align:'center',
            headerAlign: 'center',
            flex: 1,
        },
        {
            field: 'percentage',
            headerName: 'Percentage',
            minWidth: 100,
            align:'center',
            headerAlign: 'center',
            flex: 1,
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
            fetchTemplate(values);
        },
    });

    const fetchTemplate = (filter = {}) => {
        setTemplateLoading(true);
        ProvisionTemplateService.all({ filter }, templatePage + 1, templateLimit).then(res => {
            setTemplates(res.data.records);
            setTemplateCount(res.data.count);
        }).catch(err => {
            console.error(err);
            setTemplateLoading(false);
        }).finally(() => {
            setTemplateLoading(false);
        });

        CountryService.all({ filter }, countryPage + 1, countryLimit).then(res => {
            setCountries(res.data.records);
            setCountryList(res.data.countries);
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
            ProvisionTemplateService.destroy(row._id).then(res => {
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
    }, [templateLimit, templatePage, handleSubmit]);

    return (
        <MainCard title="Unit Templates">
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
                                    <Button color="secondary" variant="contained" type="button" size="small" onClick={() => { handleOpenFormDialog() }}>Add Provision Template</Button>
                                </Grid>

                            </Grid>
                        </form>
                    </Box>

                </Box>
            </Stack>

            <Box sx={{ height: '70vh' }}>
            <DataGrid
                rows={templates}
                rowCount={templateCount}
                loading={templateLoading}
                checkboxSelection
                rowsPerPageOptions={[20, 50, 100]}
                pagination
                page={templatePage}
                pageSize={templateLimit}
                paginationMode="server"
                onPageChange={(page) => setTemplatePage(page)}
                onPageSizeChange={pageSize => setTemplateLimit(pageSize)}

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
                countries={countries}
                onClose={handleCloseFormDialog}
                onConfirm={() => {
                    handleCloseFormDialog();
                    formik.handleSubmit()
                }} />
        </MainCard>
    )
}
export default ProvisionTemplatePage;