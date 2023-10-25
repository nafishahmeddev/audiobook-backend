import { Box, Button, Card, Container, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import AlbumServices from "@app/services/admin/AlbumServices";
import { useFormik } from "formik";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DataGrid } from "@mui/x-data-grid";
import Formatter from "@app/lib/formatter";
import { useNavigate } from "react-router-dom";


export default function AlbumsPage() {
    const [data, setData] = useState({ records: [], count: 0 });
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20, });
    const [sortModel, setSortModel] = useState([{ field: "updatedAt", sort: "desc" }]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const getPreviewUrl = (key) => {
        return `http://localhost:4200${key}`;
    }

    const fetchBanners = useCallback((vals) => {
        let values = { ...vals };
        if (values?.updatedAt?.$lte) {
            values.updatedAt.$lte = moment.utc(values.updatedAt.$lte).endOf("day");
        }
        setIsLoading(true);
        AlbumServices.all({
            filter: values,
            sort: sortModel,
        }, { page: paginationModel.page + 1, limit: paginationModel.pageSize, })
            .then(res => {
                setData({ count: res.result.count, records: res.result.albums })
            })
            .catch(err => enqueueSnackbar(err.message, { variant: "error" }))
            .finally(() => setIsLoading(false));
    }, [paginationModel.page, paginationModel.pageSize, sortModel]);

    const initComponent = useCallback(() => {
        fetchBanners();
    }, [fetchBanners]);

    const formik = useFormik({
        initialValues: {
            type: "",
        },
        onSubmit: (values) => {
            fetchBanners(values);
        },
        onReset: () => {
            formik.setValues({
                type: ""
            });
            fetchBanners();
        }
    });

    const handleOnDelete = (id) => {
        AlbumServices.destroy(id).then(res => {
            enqueueSnackbar(res.message, { variant: "success" });
            fetchBanners();
        }).catch(err => {
            enqueueSnackbar(err.message, { variant: "error" });
        })
    }

    //form dialog
    const handleOpenFormDialog = (row = null) => {
        navigate(`/albums/form/${row._id}`);
    }

    const columns = [
        {
            field: 'thumbnail',
            headerName: '',
            width: 40,
            renderCell: ({ value }) => <Box>
                <Box
                    component="img"
                    height={30}
                    width={30}
                    m={0.2}
                    alt="Banner Image"
                    src={getPreviewUrl(value)}
                    onError={e => e.target.src = "https://placehold.co/30"}
                    borderRadius={1.5}
                    sx={{ objectFit: "cover" }}
                />
            </Box>
        },
        {
            field: "title",
            headerName: "Title",
            flex: 1
        },
        {
            field: "type",
            headerName: "Type"
        },
        {
            field: "slug",
            headerName: "Slug",
            minWidth: 200,
        },
        {
            field: 'createdAt',
            headerName: 'Date',
            minWidth: 200,
            renderCell: ({ value }) => value ? Formatter.dateTimeFormat(value) : ""
        },
        {
            field: 'actions',
            type: 'actions',
            width: 120,
            getActions: (params) => {
                const actions = [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Banner Info"
                        onClick={() => handleOpenFormDialog(params.row)}
                        key={`action-edit`}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Banner Info"
                        onClick={() => handleOnDelete(params.row._id)}
                        key={`action-delete`}
                    />,
                ]

                return actions;
            },
        },
    ];

    const { handleSubmit } = formik;
    useEffect(() => {
        handleSubmit();
    }, [fetchBanners, paginationModel, sortModel, handleSubmit, initComponent])




    return (
        <Container sx={{ my: 4 }} maxWidth="xl">
            <Box>
                <Typography variant="h4">Albums</Typography>
            </Box>

            <Box my={2}>


                <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                    <Grid container spacing={3} alignItems="flex-end">
                        <Grid width={200} item>
                            <TextField
                                {...formik.getFieldProps("type")}
                                name="type"
                                label="Type"
                                fullWidth
                                size="small"
                                select
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="BOOK">Book</MenuItem>
                                <MenuItem value="PODCAST">Podcast</MenuItem>
                                <MenuItem value="ALBUM">Album</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item minWidth={150}>
                            <Stack direction="row" spacing={2} mt={2}>
                                <Button variant="contained" color="primary" type="submit" sx={{ mb: 0.2 }}>Filter</Button>
                                <Button variant="contained" color="primary" type="reset" sx={{ mb: 0.2 }}>Clear Filter</Button>
                                <Button variant="contained" color="primary" type="reset" sx={{ mb: 0.2 }} onClick={() => handleOpenFormDialog()}><CloudUploadIcon sx={{ mr: 1 }} /> Upload Banner</Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            <Card>
                <DataGrid
                    getRowId={row => row._id}
                    //density="compact"
                    rows={data.records}
                    rowCount={data.count}
                    columns={columns}
                    checkboxSelection
                    pageSizeOptions={[20, 50, 100]}
                    initialState={{
                        sorting: { sortModel: sortModel },
                        pagination: { paginationModel: paginationModel }
                    }}
                    paginationModel={paginationModel}
                    sortModel={sortModel}
                    paginationMode="server"
                    loading={isLoading}
                    onPaginationModelChange={(model) => setPaginationModel(model)}
                    sortingMode="server"
                    onSortModelChange={(model) => setSortModel(model)}
                    disableRowSelectionOnClick
                    autoHeight
                    disableColumnMenu
                />
            </Card>
        </Container>
    )
}