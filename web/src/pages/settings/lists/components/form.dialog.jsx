import { useEffect, useState } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
    DialogActions, Stack,
    Box, Grid, IconButton, Typography, FormHelperText,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import * as ListServices from "@app/services/admin/settings/list/ListServices";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from 'prop-types';
import { fontSize } from "@mui/system";

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
            position: "",
        },
        validationSchema: yup.object({
            name: yup.string('Enter Name').required('Name is required'),
            icon: yup.string("Select Icon").required("Icon is required"),
            position: yup.string('Enter position').required('Position is required'),
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
        const country = countries.find(country => country.isoCode === values.country );
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
                           <span style={{fontSize: "18px"}}> {row ? "Update" : "Create"} List </span>
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