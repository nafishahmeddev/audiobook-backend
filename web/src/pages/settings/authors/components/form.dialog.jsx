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
    const [authorImage, setAuthorImage] = useState();
    //confirmation form
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            image: "",
            gender: "male",
            description: "",
            dob: "",
            dod: "",
            slug: "",
        },
        validationSchema: yup.object({
            firstName: yup.string('Enter First Name').required('First Name is required'),
            lastName: yup.string('Enter Last Name').required('Last Name is required'),
            // image: yup.string("Select To").required("Image is required"),
            gender: yup.string('Select gender').required('Gender is required'),
            description: yup.string('Enter Description').required('Description is required'),
            dob: yup.string('Enter Date of Birth').required('Date of birth is required'),
            dod: yup.string('Enter Date of Death').required('Date of birth is required'),
            slug: yup.string('Enter slug').required('slug is required'),
        }),
        onSubmit: (values) => {
            handleOnConfirm(values);
            alert(
                JSON.stringify(
                    {
                        fileName: values.image.name,
                        type: values.image.type,
                        size: `${values.image.size} bytes`
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
            firstName: row?.firstName ?? "",
            lastName: row?.lastName ?? "",
            image: row?.image ?? "",
            sex: row?.sex ?? "",
            description: row?.description ?? "",
            dob: row?.dob ?? "",
            dod: row?.dod ?? "",
            slug: row?.slug ?? "",
        })
    }, [row, setValues]);

    return (
        <>
            <Dialog open={open}
                maxWidth="md"
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
                            {authorImage &&
                                <Grid item xs={12}>
                                    <img src={authorImage} alt="Author Image" height="300" />
                                </Grid>
                            }

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
                                                setAuthorImage(URL.createObjectURL(event.target.files[0]));
                                                formik.setValues({
                                                    firstName: formik.values.firstName,
                                                    lastName: formik.values.lastName,
                                                    image: event.target.files[0],
                                                    gender: formik.values.gender,
                                                    description: formik.values.description,
                                                    dob: formik.values.dob,
                                                    dod: formik.values.dod,
                                                    slug: formik.values.slug,
                                                });
                                            }}
                                        />
                                    </label>
                                </Stack>

                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="firstName"
                                    name="firstName"
                                    label="Author First Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="lastName"
                                    name="lastName"
                                    label="Author Last Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormLabel id="sex">Author Gender</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="sex"
                                    name="sex"
                                    onChange={(e) => {
                                        formik.setValues({
                                            firstName: formik.values.firstName,
                                            lastName: formik.values.lastName,
                                            image: formik.values.image,
                                            gender: e.currentTarget.value,
                                            description: formik.values.description,
                                            dob: formik.values.dob,
                                            dod: formik.values.dod,
                                            slug: formik.values.slug,
                                        });
                                    }}
                                >
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
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

                            <Grid item xs={6}>
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

                            <Grid item xs={6}>
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