import { useEffect, useState } from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
    DialogActions, TextareaAutosize, RadioGroup, FormControlLabel, FormLabel,
    Box, Grid, Radio, Stack
} from "@mui/material";

import { FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import * as AuthorService from "@app/services/admin/settings/author/AuthorServices";


import PropTypes from 'prop-types';
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
    margin-top: 5%;
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
    const [authorImage, setAuthorImage] = useState();
    //confirmation form
    const formik = useFormik({
        initialValues: {
            name: "",
            file: "",
            picture: "",
            gender: "",
            description: "",
            dob: "",
            dod: "",
            slug: "",
        },
        validationSchema: yup.object({
            name: yup.string('Enter Name').required('Name is required'),
            picture: yup.string("Select To").required("Picture is required"),
            gender: yup.string('Select gender').required('Gender is required'),
            description: yup.string('Enter Description').required('Description is required'),
            dob: yup.string('Enter Date of Birth').required('Date of birth is required'),
            slug: yup.string('Enter slug').required('slug is required'),
        }),
        onSubmit: (values) => {
            handleOnConfirm(values);
            alert(
                JSON.stringify(
                    {
                        fileName: values.file.name,
                        type: values.file.type,
                        size: `${values.file.size} bytes`
                    },
                    null,
                    2
                )
            );
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
            res = AuthorService.update(row._id, values)
        } else {
            values.balance = 0;
            res = AuthorService.create(values)
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
            file: row?.file ?? "",
            picture: row?.picture ?? "",
            sex: row?.sex ?? "",
            description: row?.description ?? "",
            dob: row?.dob ?? "",
            dod: row?.dod ?? "",
            slug: row?.slug ?? "",
        })
    }, [row, setValues]);

    const setFieldValue = (eventVal) => {
        console.log('the event is ', eventVal);
        setAuthorImage(eventVal);
    }

    return (
        <>
            <Dialog open={open}
                maxWidth="xs"
                fullWidth
                onClose={() => handleOnClose()}>
                <FormikProvider value={formik}>
                    <DialogTitle display="flex" alignItems="center">
                        <Box flexGrow={1}>
                            <span style={{ fontSize: "18px" }}> {row ? "Update" : "Create"} Authors </span>
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
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                                    <label htmlFor="file">
                                        <Button variant="contained" component="span">
                                            Upload Author Image
                                        </Button>
                                        <input
                                            id="file"
                                            hidden
                                            name="file"
                                            accept="image/*"
                                            type="file"
                                            onChange={(event) => {
                                                setFieldValue(event.currentTarget.files[0]);
                                            }}
                                        />
                                    </label>
                                    {authorImage && <img src={authorImage.file} alt="Author Image" height="300" />}
                                </Stack>

                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormLabel id="sex">Gender</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="sex"
                                    name="sex"
                                >
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                                </RadioGroup>
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

                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="dob"
                                    name="dob"
                                    label="dob"
                                    type="date"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.dob}
                                    onChange={formik.handleChange}
                                    error={formik.touched.dob && Boolean(formik.errors.dob)}
                                    helperText={formik.touched.dob && formik.errors.dob}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="dod"
                                    name="dod"
                                    label="dod"
                                    type="date"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.dod}
                                    onChange={formik.handleChange}
                                    error={formik.touched.dod && Boolean(formik.errors.dod)}
                                    helperText={formik.touched.dod && formik.errors.dod}
                                />
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