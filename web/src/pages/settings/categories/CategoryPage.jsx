import {
    Typography, Box, TextField, Stack, Button, Card,
    MenuItem, Grid, Container, Avatar
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useEffect } from "react";
import { useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as CategoryServices from "@app/services/admin/settings/category/CategoryServices";
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

function CategoriesPage() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [unitTemplateCount, setUnitTemplateCount] = useState(0);
    const [unitTemplateLimit, setUnitTemplateLimit] = useState(20);
    const [unitTemplatePage, setUnitTemplatePage] = useState(0);
    const [unitTemplateLoading, setUnitTemplateLoading] = useState(false);
    const [unitTemplates, setUnitTemplates] = useState([]);

    const [formDialog, setFormDialog] = useState({
        open: false,
        row: null
    });


    const columns = [
        {
            field: 'icon',
            headerName: 'Uploaded Cover',
            minWidth: 100,
            flex: 1,
            align:'left',
            headerAlign: 'left',
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
            icon: "",
            name: "",
        },
        validationSchema: yup.object({
            icon: yup.string("Please select icon"),
            name: yup.string("Please enter order id"),
        }),
        onSubmit: (values) => {
            fetchunitTemplate(values);
        },
    });

    const fetchunitTemplate = (filter = {}) => {
        console.log('gone to service');
        setUnitTemplateLoading(true);
        CategoryServices.all({ filter }, unitTemplatePage + 1, unitTemplateLimit).then(res => {
            setUnitTemplates(res.data.records);
            setUnitTemplateCount(res.data.count);
            console.log('the length is ', Object.keys(filter).length);
            if (filter.name == "") {
                // setunitTemplateList(res.data.records);
            }
        }).catch(err => {
            console.error(err);
            setUnitTemplateLoading(false);
        }).finally(() => {
            setUnitTemplateLoading(false);
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
            CategoryServices.destroy(row._id).then(res => {
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
    }, [unitTemplateLimit, unitTemplatePage, handleSubmit]);

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
                                    <Button color="secondary" variant="contained" type="button" size="small" onClick={() => { handleOpenFormDialog() }}>Add unitTemplate</Button>
                                </Grid>

                            </Grid>
                        </form>
                    </Box>

                </Box>
            </Stack>

            <Box sx={{ height: '70vh' }}>
            <DataGrid
                rows={unitTemplates}
                rowCount={unitTemplateCount}
                loading={unitTemplateLoading}
                // checkboxSelection
                rowsPerPageOptions={[20, 50, 100]}
                pagination
                page={unitTemplatePage}
                pageSize={unitTemplateLimit}
                paginationMode="server"
                onPageChange={(page) => setUnitTemplatePage(page)}
                onPageSizeChange={pageSize => setUnitTemplateLimit(pageSize)}

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
export default CategoriesPage;