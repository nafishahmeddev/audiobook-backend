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

//marterial UI
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from 'prop-types';

//services
import * as CountryService from "@app/services/admin/settings/country/CountryServices";
import * as CurrencyService from "@app/services/admin/settings/currency/CurrencyServices";
import * as GatewayService from "@app/services/admin/settings/payment/GatewayServices";

FormDialog.propTypes = {
    open: PropTypes.bool,
    row: PropTypes.object,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
  }


function FormDialog({ open, row, onClose, onConfirm, countryList }) {
    const { enqueueSnackbar } = useSnackbar();
    const [currencies, setCurrencies] = useState([]);
    const [gateways, setPaymentGateways] = useState([]);

    //confirmation form
    const formik = useFormik({
        initialValues: {
            name: "",
            banks: "",
            currency: "",
            paymentGateways: "",
            sharedMessage: "",
        },
        validationSchema: yup.object({
            name: yup.string("Select Country").required("Country is required"),
            banks: yup.string('Enter Contact Number').required('Contact Number is required'),
            currency: yup.string('Select Currency').required('Currency is required'),
            paymentGateways: yup.string("Select Payment Gateways").required('Payment Gateways is required'),
            sharedMessage: yup.string("Enter Shared Message").required('Shared Message is required'),
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
            res = CountryService.update(row._id, values)
        } else {
            values.balance = 0;
            res = CountryService.create(values)
        }

        res.then(res => {
            enqueueSnackbar(res.message, { variant: "success" });
            onConfirm();
            formik.resetForm();
        }).catch(err => {
            enqueueSnackbar(err.message, { variant: "error" });
        })
    }

    const initializeComponent = async () => {
        console.log('this is called');

        await CurrencyService.getAll().then(res => {
            setCurrencies(res.data.records);
        }).catch(err => {
            console.error(err);
        });

        await GatewayService.getAll().then(res => {
            setPaymentGateways(res.data.records);
        }).catch(err => {
            console.error(err);
        });
    }

    const { setValues } = formik;
    useEffect(() => {
        setValues({
            name: row?.name ?? "",
            banks: row?.banks ?? "",
            currency: row?.currency ?? "",
            paymentGateways: row?.paymentGateways ?? "",
            sharedMessage: row?.sharedMessage ?? "",
        })
        initializeComponent();
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
                        <span style={{fontSize: "18px"}}>  {row ? "Update" : "Create"} Country </span>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter information below
                        </DialogContentText>


                        <Grid container spacing={2} rowSpacing={1}>

                        <Grid item xs={12}>
                                <TextField
                                    label="Name"
                                    margin="dense"
                                    variant="standard"
                                    name="name"
                                    fullWidth
                                    select
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}>
                                    <MenuItem value=""></MenuItem>
                                    {countryList.map(country => (
                                        <MenuItem value={country.name} key={`country-item-${country.name}`}>
                                            {country.name} ({country.isoCode})
                                        </MenuItem>
                                    ))}

                                </TextField>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    label="Banks"
                                    margin="dense"
                                    variant="standard"
                                    name="bankName"
                                    type="text"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    value={formik.values.bankName}
                                    error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                                    helperText={formik.touched.bankName && formik.errors.bankName}>
                                </TextField>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    label="Currency"
                                    margin="dense"
                                    variant="standard"
                                    name="currency"
                                    fullWidth
                                    select
                                    onChange={formik.handleChange}
                                    value={formik.values.currency}
                                    error={formik.touched.currency && Boolean(formik.errors.currency)}
                                    helperText={formik.touched.currency && formik.errors.currency}>
                                    <MenuItem value=""></MenuItem>
                                    {currencies.map(currency => (
                                        <MenuItem value={currency.code} key={`country-item-${currency.code}`}>
                                            {currency.code}
                                        </MenuItem>
                                    ))}

                                </TextField>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    label="Payment Gateways"
                                    margin="dense"
                                    variant="standard"
                                    name="paymentGateways"
                                    fullWidth
                                    select
                                    onChange={formik.handleChange}
                                    value={formik.values.paymentGateways}
                                    error={formik.touched.paymentGateways && Boolean(formik.errors.paymentGateways)}
                                    helperText={formik.touched.paymentGateways && formik.errors.paymentGateways}>
                                    <MenuItem value=""></MenuItem>
                                    {gateways.map(gateway => (
                                        <MenuItem value={gateway._id} key={`country-item-${gateway._id}`}>
                                            {gateway.name}
                                        </MenuItem>
                                    ))}

                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="sharedMessage"
                                    name="sharedMessage"
                                    label="Shared Message"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.sharedMessage}
                                    onChange={formik.handleChange}
                                    error={formik.touched.sharedMessage && Boolean(formik.errors.sharedMessage)}
                                    helperText={formik.touched.sharedMessage && formik.errors.sharedMessage}
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