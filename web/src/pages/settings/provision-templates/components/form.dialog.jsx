import { useEffect, useState } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
    DialogActions,
    Box, Grid, IconButton, Typography, FormHelperText,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import * as ProvisionTemplateServices from "@app/services/admin/settings/provision-template/ProvisionTemplateServices";

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


function FormDialog({ open, row, onClose, onConfirm, countries }) {
    const { enqueueSnackbar } = useSnackbar();
    //confirmation form
    const formik = useFormik({
        initialValues: {
            name: "",
            percentage: "",
            countryIso: "",
        },
        validationSchema: yup.object({
            name: yup.string('Enter Name').required('Number is required'),
            percentage: yup.string("Enter Percentage").required("Percentage is required"),
            countryIso: yup.string('Select Country').required('Country is required'),
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
            res = ProvisionTemplateServices.update(row._id, values)
        } else {
            values.balance = 0;
            res = ProvisionTemplateServices.create(values)
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
            minFrom: row?.minFrom ?? "",
            minTo: row?.minTo ?? "",
            units: row?.units ?? "",
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
                           <span style={{fontSize: "18px"}}> {row ? "Update" : "Create"} Unit Template </span>
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
                                    type="number"
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
                                    id="percentage"
                                    name="percentage"
                                    label="Percentage"
                                    type="number"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.percentage}
                                    onChange={formik.handleChange}
                                    error={formik.touched.percentage && Boolean(formik.errors.percentage)}
                                    helperText={formik.touched.percentage && formik.errors.percentage}
                                />
                            </Grid>

                            
                            <Grid item xs={12}>
                                <TextField
                                    label="Country Iso"
                                    margin="dense"
                                    variant="standard"
                                    name="countryIso"
                                    fullWidth
                                    select
                                    onChange={formik.handleChange}
                                    value={formik.values.countryIso}
                                    error={formik.touched.countryIso && Boolean(formik.errors.countryIso)}
                                    helperText={formik.touched.countryIso && formik.errors.countryIso}>
                                    <MenuItem value=""></MenuItem>
                                    {countries.map(country => (
                                        <MenuItem value={country.isoCode} key={`country-item-${country.name}`}>
                                            {country.name} ({country.isoCode})
                                        </MenuItem>
                                    ))}

                                </TextField>
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