import { useEffect, useState } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
    DialogActions,
    Box, Grid,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import { FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import * as PublisherService from "@app/services/admin/publisher/PublisherServices";


import PropTypes from 'prop-types';

FormDialog.propTypes = {
    open: PropTypes.bool,
    row: PropTypes.object,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
}


function FormDialog({ open, row, onClose, onConfirm }) {
    const { enqueueSnackbar } = useSnackbar();
    const [banksName] = useState([]);
    const [countries] = useState([]);
    //confirmation form
    const formik = useFormik({
        initialValues: {
            name: "",
            country: "",
            email: "",
            contactNumber: "",
            contactPerson: "",
            address: "",
            IBAN: "",
            bankName: "",
            ownerOfBankAccount: "",
        },
        validationSchema: yup.object({
            name: yup.string('Enter name').required('Name is required'),
            country: yup.string("Select Country").required("Country is required"),
            email: yup.string('Enter email').email("Please enter valid email").required('Email is required'),
            contactNumber: yup.string('Enter Contact Number').required('Contact Number is required'),
            contactPerson: yup.string('Enter Contact Person').required('Contact Person is required'),
            address: yup.string("Enter Address").required('Address is required'),
            IBAN: yup.string("Enter IBAN").required('IBAN is required'),
            ownerOfBankAccount: yup.string("Enter Owner Of Bank Account").required("Owner Of Bank Account is required"),
            bankName: yup.string("Select Bank Name").required('Bank Name is required'),
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
            country: row?.country ?? "",
            email: row?.email ?? "",
            contactNumber: row?.contactNumber ?? "",
            contactPerson: row?.contactPerson ?? "",
            address: row?.address ?? "",
            IBAN: row?.IBAN ?? "",
            bankName: row?.bankName ?? "",
            ownerOfBankAccount: row?.ownerOfBankAccount ?? "",
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
                            <span style={{ fontSize: "18px" }}> {row ? "Update" : "Create"} Publisher </span>
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

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="email"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="contactNumber"
                                    name="contactNumber"
                                    label="Contact Number"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.contactNumber}
                                    onChange={formik.handleChange}
                                    error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                                    helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                                />

                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="address"
                                    name="address"
                                    label="Address"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                            </Grid>


                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="IBAN"
                                    name="IBAN"
                                    label="IBAN"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.IBAN}
                                    onChange={formik.handleChange}
                                    error={formik.touched.IBAN && Boolean(formik.errors.IBAN)}
                                    helperText={formik.touched.IBAN && formik.errors.IBAN}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    label="Bank Name"
                                    margin="dense"
                                    variant="standard"
                                    name="bankName"
                                    fullWidth
                                    select
                                    onChange={formik.handleChange}
                                    value={formik.values.bankName}
                                    error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                                    helperText={formik.touched.bankName && formik.errors.bankName}>
                                    <MenuItem value=""></MenuItem>
                                    {banksName.map(bankName => (
                                        <MenuItem value={bankName._id} key={`country-item-${bankName._id}`}>
                                            {bankName.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    label="Country"
                                    margin="dense"
                                    variant="standard"
                                    name="country"
                                    fullWidth
                                    select
                                    onChange={formik.handleChange}
                                    value={formik.values.country}
                                    error={formik.touched.country && Boolean(formik.errors.country)}
                                    helperText={formik.touched.country && formik.errors.country}>
                                    <MenuItem value=""></MenuItem>
                                    {countries.map(country => (
                                        <MenuItem value={country.isoCode} key={`country-item-${country.isoCode}`}>
                                            {country.name} ({country.isoCode})
                                        </MenuItem>
                                    ))}

                                </TextField>
                            </Grid>


                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="ownerOfBankAccount"
                                    name="ownerOfBankAccount"
                                    label="Owner Of Bank Account"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.ownerOfBankAccount}
                                    onChange={formik.handleChange}
                                    error={formik.touched.ownerOfBankAccount && Boolean(formik.errors.ownerOfBankAccount)}
                                    helperText={formik.touched.ownerOfBankAccount && formik.errors.ownerOfBankAccount}
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