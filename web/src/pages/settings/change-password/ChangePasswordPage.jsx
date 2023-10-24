import {
    Typography, Box, TextField, Stack, Button, Card,
    MenuItem, Grid, Container, Avatar
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useEffect } from "react";
import { useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as AppAdminServices from "@app/services/admin/users/AppAdminServices";
import { useSnackbar } from 'notistack';

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreTimeIcon from '@mui/icons-material/MoreTime';

import { useNavigate } from "react-router-dom";


import SubCard from '@app/themes/ui-component/cards/SubCard';
import MainCard from '@app/themes/ui-component/cards/MainCard';
import SecondaryAction from '@app/themes/ui-component/cards/CardSecondaryAction';
import Country from "@app/assets/Countries.js";
import CountriesImage from "@app/assets/CountriesImage.js";

function ChangePasswordPage() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [formDialog, setFormDialog] = useState({
        open: false,
        row: null
    });


    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: yup.object({
            password: yup.string("Please enter password"),
            confirmPassword: yup.string("Please enter confirmation password"),
        }),
        onSubmit: (values) => {
            if (values.password != values.confirmPassword) {
                enqueueSnackbar("password don't match", { variant: "error" });
            }
            else {
                fetchUnitTemplate(values);
            }
        },
    });

    const fetchUnitTemplate = (id, data) => {
        setUnitTemplateLoading(true);
        AppAdminServices.update(id, data).then(res => {
            res.then(res => {
                enqueueSnackbar(res.message, { variant: "success" });
                formik.resetForm();
            }).catch(err => {
                enqueueSnackbar(err.message, { variant: "error" });
            })
        }).catch(err => {
            setUnitTemplateLoading(false);
        }).finally(() => {
            setUnitTemplateLoading(false);
        });
    }

    //form dialog
    const handleOpenFormDialog = (row = null) => {
        setFormDialog({
            open: true,
            row: row
        })
    }
    const handleCloseFormDialog = () => {
        setFormDialog({
            open: false,
            row: null
        })
    }

    const { handleSubmit } = formik;

    useEffect(() => {
        handleSubmit();
    }, [handleSubmit]);

    return (
        <MainCard title="Change Password">
            <Box sx={{ width: '100%' }}>
                <Box sx={{ justifyContent: 'center', alignContent: 'center' }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} rowSpacing={1}>
                            <Grid item xs={12}>
                                <TextField margin="dense"
                                    variant="standard"
                                    label="Password"
                                    name="password"
                                    id="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField margin="dense"
                                    variant="standard"
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button color="secondary" variant="contained" type="button" size="small" onClick={() => { handleOpenFormDialog() }}>Change Password</Button>
                            </Grid>

                        </Grid>
                    </form>
                </Box>

            </Box>

        </MainCard>
    )
}
export default ChangePasswordPage;