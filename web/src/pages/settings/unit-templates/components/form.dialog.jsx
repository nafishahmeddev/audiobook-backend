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

import * as UnitTemplateService from "@app/services/admin/settings/unit-template/UnitTemplateServices";

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

    //confirmation form
    const formik = useFormik({
        initialValues: {
            minFrom: "",
            minTo: "",
            units: "",
        },
        validationSchema: yup.object({
            minFrom: yup.string('Enter Min From').required('Min From is required'),
            minTo: yup.string("Enter Min To").required("Min To is required"),
            units: yup.string('Enter Units').required('Units is required'),
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
        let res = null;
        if (row) {
            res = UnitTemplateService.update(row._id, values)
        } else {
            values.balance = 0;
            res = UnitTemplateService.create(values)
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
                                    id="minFrom"
                                    name="minFrom"
                                    label="Min From"
                                    type="number"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.minFrom}
                                    onChange={formik.handleChange}
                                    error={formik.touched.minFrom && Boolean(formik.errors.minFrom)}
                                    helperText={formik.touched.minFrom && formik.errors.minFrom}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="minTo"
                                    name="minTo"
                                    label="Min To"
                                    type="number"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.minTo}
                                    onChange={formik.handleChange}
                                    error={formik.touched.minTo && Boolean(formik.errors.minTo)}
                                    helperText={formik.touched.minTo && formik.errors.minTo}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="units"
                                    name="units"
                                    label="Units"
                                    type="number"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.units}
                                    onChange={formik.handleChange}
                                    error={formik.touched.units && Boolean(formik.errors.units)}
                                    helperText={formik.touched.units && formik.errors.units}
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