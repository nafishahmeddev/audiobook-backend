import {
    Box, TextField, Stack, Button,
    Grid, Avatar
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useEffect } from "react";
import { useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as AuthorService from "@app/services/admin/settings/author/AuthorServices";
import { useSnackbar } from 'notistack';
import FormDialog from "./components/form.dialog";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useNavigate } from "react-router-dom";


import MainCard from '@app/themes/ui-component/cards/MainCard';

function AuthorsPage() {
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
            field: 'image',
            headerName: 'Image',
            minWidth: 100,
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            renderCell: ({ value, row }) => <Avatar
                alt={value}
                src={value}
            />
        },
        {
            field: 'firstName',
            headerName: 'Name',
            minWidth: 150,
            align: 'center',
            headerAlign: 'center',
            flex: 1,
        },
        {
            field: 'gender',
            headerName: 'Gender',
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
            flex: 1,
            renderCell: ({ value, row }) => value?.charAt(0)?.toUpperCase() + value?.slice(1)
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
            fetchunitTemplate(values);
        },
    });

    const fetchunitTemplate = (filter = {}) => {
        setUnitTemplateLoading(true);
        AuthorService.all({ filter }, unitTemplatePage + 1, unitTemplateLimit).then(res => {
            setUnitTemplates(res.result.authors);
            setUnitTemplateCount(res.result.count);
            console.log(res.result);
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
            AuthorService.destroy(row._id).then(res => {
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
        <MainCard title="Authors">
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
                                    <Button color="secondary" variant="contained" type="button" size="small" onClick={() => { handleOpenFormDialog() }}>Add Authors</Button>
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
export default AuthorsPage;