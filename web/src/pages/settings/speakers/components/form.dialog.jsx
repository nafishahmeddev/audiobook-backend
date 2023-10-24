import { useEffect, useState } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
    DialogActions, RadioGroup, FormControlLabel, FormLabel,
    Box, Grid, IconButton, Typography, FormHelperText, Radio
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import { FieldArray, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import * as SpeakerServices from "@app/services/admin/settings/speaker/SpeakerServices";

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
            language: "",
            sex: "",
            rating: 0
        },
        validationSchema: yup.object({
            name: yup.string('Enter Min From').required('Min From is required'),
            language: yup.string("Select Language").required("Language is required"),
            sex: yup.string('Enter Sex').required('Sex is required'),
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
            res = SpeakerServices.update(row._id, values)
        } else {
            values.balance = 0;
            res = SpeakerServices.create(values)
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
            language: row?.language ?? "",
            sex: row?.sex ?? "",
        })
    }, [row, setValues])

    const handleSexChange = e => formik.values.sex = e.target.value;

    return (
        <>
            <Dialog open={open}
                maxWidth="xs"
                fullWidth
                onClose={() => handleOnClose()}>
                <FormikProvider value={formik}>
                    <DialogTitle display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <span style={{ fontSize: "18px" }}> {row ? "Update" : "Create"} Speakers </span>
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
                                    id="language"
                                    name="language"
                                    label="Language"
                                    type="number"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.language}
                                    onChange={formik.handleChange}
                                    error={formik.touched.language && Boolean(formik.errors.language)}
                                    helperText={formik.touched.language && formik.errors.language}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{mt: 2}}>
                                <FormLabel id="sex">Gender</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="sex"
                                    name="sex"
                                >
                                    <FormControlLabel value="female" control={<Radio />} onChange={e => handleSexChange(e)} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} onChange={e => handleSexChange(e)} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} onChange={e => handleSexChange(e)} label="Other" />
                                </RadioGroup>
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