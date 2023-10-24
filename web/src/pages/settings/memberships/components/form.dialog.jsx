import { useEffect, useState } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
    DialogActions, TextareaAutosize,
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
import { styled } from '@mui/system';

FormDialog.propTypes = {
    open: PropTypes.bool,
    row: PropTypes.object,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
  }

const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
};

const StyledTextarea = styled(TextareaAutosize)(
    ({ theme }) => `
    width: 100%;
    margin-top: 2%;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
);

function FormDialog({ open, row, onClose, onConfirm }) {
    const { enqueueSnackbar } = useSnackbar();
    const [banksName, setBanksName] = useState([]);
    const [countries, setCountries] = useState([]);
    //confirmation form
    const formik = useFormik({
        initialValues: {
            name: "",
            cost: "",
            period: "",
            periodType: "",
            description: "",
            countryIso: "",
            cover: "",
            maxDaysForDownloads: "",
            maxDevices: "",
            maxDownloads: "",
            trialPeriod: "",
            trialPeriodType: "",
        },
        validationSchema: yup.object({
            name: yup.string('Enter Name').required('Name is required'),
            cost: yup.string('Enter Cost').required('Cost is required'),
            period: yup.string('Enter Period').required('Period is required'),
            periodType: yup.string('Select Period Type').required('Period Type is required'),
            description: yup.string('Enter description').required('Description is required'),
            countryIso: yup.string('Select Country').required('Country is required'),
            cover: yup.string('Enter Cover Address').required('Cover Address is required'),
            maxDaysForDownloads: yup.string('Enter Max days for downloads').required('Max days for download is required'),
            maxDevices: yup.string('Enter Max Devices').required('Max Devices is required'),
            maxDownloads: yup.string('Enter Max Downloads').required('Max Downloads is required'),
            trialPeriod: yup.string('Enter Trial Period').required('Trial Period is required'),
            trialPeriodType: yup.string('Enter Trial Period Type').required('Trial period type is required'),
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
            minFrom: row?.minFrom ?? "",
            minTo: row?.minTo ?? "",
            units: row?.units ?? "",
        })
    }, [row, setValues])

    return (
        <>
            <Dialog open={open}
                maxWidth="md"
                fullWidth
                onClose={() => handleOnClose()}>
                <FormikProvider value={formik}>
                    <DialogTitle display="flex" alignItems="center">
                        <Box flexGrow={1}>
                           <span style={{fontSize: "18px"}}> {row ? "Update" : "Create"} Membership </span>
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
                                    label="Country"
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
                                        <MenuItem value={country.isoCode} key={`country-item-${country.isoCode}`}>
                                            {country.name} ({country.isoCode})
                                        </MenuItem>
                                    ))}

                                </TextField>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    label="Period Type"
                                    margin="dense"
                                    variant="standard"
                                    name="periodType"
                                    fullWidth
                                    select
                                    onChange={formik.handleChange}
                                    value={formik.values.periodType}
                                    error={formik.touched.periodType && Boolean(formik.errors.periodType)}
                                    helperText={formik.touched.periodType && formik.errors.periodType}>
                                    <MenuItem value="days" key="days">Days</MenuItem>
                                    <MenuItem value="months" key="months">Months</MenuItem>
                                    <MenuItem value="years" key="years">Years</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="period"
                                    name="period"
                                    label={`Period ${formik.values.periodType ? ' in ' + formik.values.periodType :''} `}
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.period}
                                    onChange={formik.handleChange}
                                    error={formik.touched.period && Boolean(formik.errors.period)}
                                    helperText={formik.touched.period && formik.errors.period}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    label="Trial Period Type"
                                    margin="dense"
                                    variant="standard"
                                    name="trialPeriodType"
                                    fullWidth
                                    select
                                    onChange={formik.handleChange}
                                    value={formik.values.trialPeriodType}
                                    error={formik.touched.trialPeriodType && Boolean(formik.errors.trialPeriodType)}
                                    helperText={formik.touched.trialPeriodType && formik.errors.trialPeriodType}>
                                    <MenuItem value="days" key="days">Days</MenuItem>
                                    <MenuItem value="months" key="months">Months</MenuItem>
                                    <MenuItem value="years" key="years">Years</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="trialPeriod"
                                    name="trialPeriod"
                                    label={`Trial Period ${formik.values.trialPeriodType ? ' in ' + formik.values.trialPeriodType :''}`}
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.trialPeriod}
                                    onChange={formik.handleChange}
                                    error={formik.touched.trialPeriod && Boolean(formik.errors.trialPeriod)}
                                    helperText={formik.touched.trialPeriod && formik.errors.trialPeriod}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="cost"
                                    name="cost"
                                    label="Cost"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.cost}
                                    onChange={formik.handleChange}
                                    error={formik.touched.cost && Boolean(formik.errors.cost)}
                                    helperText={formik.touched.cost && formik.errors.cost}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="maxDevices"
                                    name="maxDevices"
                                    label="Permitted Devices"
                                    type="number"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.maxDevices}
                                    onChange={formik.handleChange}
                                    error={formik.touched.maxDevices && Boolean(formik.errors.maxDevices)}
                                    helperText={formik.touched.maxDevices && formik.errors.maxDevices}
                                />
                            </Grid>


                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="maxDownloads"
                                    name="maxDownloads"
                                    label="Max Downloads"
                                    type="number"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.maxDownloads}
                                    onChange={formik.handleChange}
                                    error={formik.touched.maxDownloads && Boolean(formik.errors.maxDownloads)}
                                    helperText={formik.touched.maxDownloads && formik.errors.maxDownloads}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    id="maxDaysForDownloads"
                                    name="maxDaysForDownloads"
                                    label="Max Days For Downloads"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.maxDaysForDownloads}
                                    onChange={formik.handleChange}
                                    error={formik.touched.maxDaysForDownloads && Boolean(formik.errors.maxDaysForDownloads)}
                                    helperText={formik.touched.maxDaysForDownloads && formik.errors.maxDaysForDownloads}
                                />
                            </Grid>


                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="cover"
                                    name="cover"
                                    label="Cover"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.cover}
                                    onChange={formik.handleChange}
                                    error={formik.touched.cover && Boolean(formik.errors.cover)}
                                    helperText={formik.touched.cover && formik.errors.cover}
                                />
                            </Grid>


                            <Grid item xs={12}>
                                <StyledTextarea
                                    id="description"
                                    name="description"
                                    label="description"
                                    minRows={3}
                                    placeholder="Description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
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