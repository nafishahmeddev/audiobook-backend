import { Box, TextField, Stack, Card, CardContent, Button, Typography, Divider, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import * as AuthService from "@app/services/auth.service.js";
import { enqueueSnackbar } from "notistack";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        onSubmit: (values) => AuthService.login(values.username, values.password)
            .then((res) => {
                enqueueSnackbar(res.message, { variant: "success" });
                AuthService.me();
            }).catch((err) => {
                enqueueSnackbar(err.message, { variant: "error" });
            }).finally(() => {
                formik.setIsSubmitting(false);
            })

    });

    return (
        <Box p={5} display="flex" alignItems="center" justifyContent="center" height="100vh" width="100vw">
            <Box flexGrow={1} maxWidth={400}>
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <form onSubmit={formik.handleSubmit}>
                            <Typography variant="h4">Sign In</Typography>
                            <Typography sx={{ mt: 1 }}>Please login to continue</Typography>
                            <Stack spacing={3} py={4}>
                                <TextField
                                    name="username"
                                    placeholder="example@domain.com"
                                    label="Email"
                                    type="email"
                                    required
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.username}
                                    error={Boolean(formik.errors.username && formik.touched.username)}
                                    helperText={formik.touched.username && formik.errors.username} />

                                <TextField
                                    name="password"
                                    placeholder=""
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    //onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    error={Boolean(formik.errors.password && formik.touched.password)}
                                    helperText={formik.touched.password && formik.errors.password} />


                            </Stack>
                            <Box height={70} display="flex" alignItems="center" justifyContent="center">
                                {formik.isSubmitting ? (<CircularProgress/>) : (
                                    <Button variant="contained" color="primary" type="submit" size="large" fullWidth disabled={formik.isSubmitting}>
                                        Sign In
                                    </Button>
                                )}
                            </Box>

                            <Divider sx={{mt:2}}>
                                <Typography fontSize={15} color="grey">ViMo Software</Typography>
                            </Divider>
                        </form>
                    </CardContent>
                </Card>

            </Box>
        </Box>
    )
}