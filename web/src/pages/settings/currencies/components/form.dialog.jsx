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

import * as PublisherService from "@app/services/admin/publisher/PublisherServices";

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
            namePlural: "",
            code: "",
            symbol: "",
            symbolNative: "",
            decimalDigits: "",
            rounding: "",
        },
        validationSchema: yup.object({
            name: yup.string('Enter name').required('Name is required'),
            namePlural: yup.string("Enter Currency Plural Name").required("Currency Plural Name is required"),
            code: yup.string('Enter Currency code').required('Currency code is required'),
            symbol: yup.string('Enter Currency symbol').required('Currency symbol is required'),
            symbolNative: yup.string('Enter Native symbol').required('Native symbol is required'),
            decimalDigits: yup.string("Enter Decimal Digits").required('Decimal Digits is required'),
            rounding: yup.string("Enter rounding").required('rounding is required'),
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
            res = PublisherService.update(row._id, values)
        } else {
            values.balance = 0;
            res = PublisherService.create(values)
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
            namePlural: row?.namePlural ?? "",
            code: row?.code ?? "",
            symbol: row?.symbol ?? "",
            symbolNative: row?.symbolNative ?? "",
            decimalDigits: row?.decimalDigits ?? "",
            rounding: row?.rounding ?? "",
        })
    }, [row, setValues])

    // const initializeComponent = async () => {
    //     await PublisherService.all().then(res => {
    //         setProvisionModels(res.data.records);
    //     }).catch(err => {
    //         console.error(err);
    //     });
    // }
    
    // useEffect(() => {
    //     initializeComponent();
    // }, []);

    return (
        <>
            <Dialog open={open}
                maxWidth="xs"
                fullWidth
                onClose={() => handleOnClose()}>
                <FormikProvider value={formik}>
                    <DialogTitle display="flex" alignItems="center">
                        <Box flexGrow={1}>
                           <span style={{fontSize: "18px"}}> {row ? "Update" : "Create"} Currency </span>
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
                                    label="Currency Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="namePlural"
                                    name="namePlural"
                                    label="Currency Plural Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.namePlural}
                                    onChange={formik.handleChange}
                                    error={formik.touched.namePlural && Boolean(formik.errors.namePlural)}
                                    helperText={formik.touched.namePlural && formik.errors.namePlural}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="code"
                                    name="code"
                                    label="Currency Code"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.code}
                                    onChange={formik.handleChange}
                                    error={formik.touched.code && Boolean(formik.errors.code)}
                                    helperText={formik.touched.code && formik.errors.code}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="symbol"
                                    name="symbol"
                                    label="Currency Symbol"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.symbol}
                                    onChange={formik.handleChange}
                                    error={formik.touched.symbol && Boolean(formik.errors.symbol)}
                                    helperText={formik.touched.symbol && formik.errors.symbol}
                                />

                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="symbolNative"
                                    name="symbolNative"
                                    label="Currency Native Symbol"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.symbolNative}
                                    onChange={formik.handleChange}
                                    error={formik.touched.symbolNative && Boolean(formik.errors.symbolNative)}
                                    helperText={formik.touched.symbolNative && formik.errors.symbolNative}
                                />
                            </Grid>


                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="decimalDigits"
                                    name="decimalDigits"
                                    label="Decimal Digits"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.decimalDigits}
                                    onChange={formik.handleChange}
                                    error={formik.touched.decimalDigits && Boolean(formik.errors.decimalDigits)}
                                    helperText={formik.touched.decimalDigits && formik.errors.decimalDigits}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="rounding"
                                    name="rounding"
                                    label="Rounding"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.rounding}
                                    onChange={formik.handleChange}
                                    error={formik.touched.rounding && Boolean(formik.errors.rounding)}
                                    helperText={formik.touched.rounding && formik.errors.rounding}
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