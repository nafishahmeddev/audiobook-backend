import { useEffect, useState } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
    DialogActions, Stack,
    Box, Grid,
} from "@mui/material";

import { FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import * as ListServices from "@app/services/admin/settings/list/ListServices";


import PropTypes from 'prop-types';

FormDialog.propTypes = {
    open: PropTypes.bool,
    row: PropTypes.object,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
}


function FormDialog({ open, row, onClose, onConfirm }) {
    const { enqueueSnackbar } = useSnackbar();
    const [banksName, setBanksName] = useState([]);
    const [countries, setCountries] = useState([]);
    //confirmation form
    const formik = useFormik({
        initialValues: {
            name: "",
            icon: "",
            thumbnail: "",
            slug: "",
            position: "",
        },
        validationSchema: yup.object({
            name: yup.string('Enter Name').required('Name is required'),
            icon: yup.string("Select Icon").required("Icon is required"),
            position: yup.string('Enter position').required('Position is required'),
            thumbnail: yup.string('Select thumbnail').required('thumbnail is required'),
            slug: yup.string('Enter slug').required('slug is required'),
        }),
        onSubmit: (values) => {
            handleOnConfirm(values);
        },
    });
    const handleOnClose = () => {
        formik.resetForm();
        onClose();
    }
    const handleOnConfirm = (values) => {
        const country = countries.find(country => country.isoCode === values.country);
        values.currency = country.currency;
        let res = null;
        if (row) {
            res = ListServices.update(row._id, values)
        } else {
            values.balance = 0;
            res = ListServices.create(values)
        }

        res.then(res => {
            enqueueSnackbar(res.message, { variant: "success" });
            onConfirm();
            formik.resetForm();
        }).catch(err => {
            enqueueSnackbar(err.message, { variant: "error" });
        })
    }

    const { setValues } = formik;
    useEffect(() => {
        setValues({
            name: row?.name ?? "",
            icon: row?.icon ?? "",
            position: row?.position ?? "",
            thumbnail: row?.thumbnail ?? "",
            slug: row?.slug ?? "",
        })
    }, [row, setValues])

    return (
        <>
            <Dialog open={open}
                maxWidth="xs"
                fullWidth
                onClose={() => handleOnClose()}>
                <FormikProvider value={formik}>
                    <DialogTitle display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <span style={{ fontSize: "18px" }}> {row ? "Update" : "Create"} List </span>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter information below
                        </DialogContentText>


                        <Grid container spacing={2} rowSpacing={1}>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    name="name"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="position"
                                    name="position"
                                    label="Position"
                                    type="number"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.position}
                                    onChange={formik.handleChange}
                                    error={formik.touched.position && Boolean(formik.errors.position)}
                                    helperText={formik.touched.position && formik.errors.position}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                                    <label htmlFor="icon">
                                        <Button variant="contained" component="span">
                                            Upload List Cover
                                        </Button>
                                        <input
                                            id="icon"
                                            hidden
                                            name="icon"
                                            accept="image/*"
                                            type="file"
                                            onChange={(event) => {
                                                formik.setFieldValue('icon', event.currentTarget.files[0]);
                                            }}
                                        />
                                    </label>
                                    {formik.values.icon && <img src={formik.values.icon} alt="Author Image" height="300" />}
                                </Stack>
                            </Grid>

                            <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                                    <label htmlFor="thumbnail">
                                        <Button variant="contained" component="span">
                                            Upload Thumbnail
                                        </Button>
                                        <input
                                            id="thumbnail"
                                            hidden
                                            name="thumbnail"
                                            accept="image/*"
                                            type="file"
                                            onChange={(event) => {
                                                formik.setFieldValue('thumbnail', event.currentTarget.files[0]);
                                            }}
                                        />
                                    </label>
                                    {formik.values.thumbnail && <img src={formik.values.thumbnail} alt="thumbnail Image" height="300" />}
                                </Stack>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="slug"
                                    name="slug"
                                    label="slug"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.slug}
                                    onChange={formik.handleChange}
                                    error={formik.touched.slug && Boolean(formik.errors.slug)}
                                    helperText={formik.touched.slug && formik.errors.slug}
                                />
                            </Grid>

                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleOnClose()} color="info" variant="contained">Cancel</Button>
                        <Button onClick={formik.handleSubmit} color="success" variant="contained">Confirm</Button>
                    </DialogActions>
                </FormikProvider>
            </Dialog>


        </>
    )
}
export default FormDialog;