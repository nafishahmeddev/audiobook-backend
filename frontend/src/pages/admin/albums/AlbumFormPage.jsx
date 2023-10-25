import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import AlbumServices from "@app/services/admin/AlbumServices";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import * as yup from "yup";


export default function AlbumFormPage() {
    const params = useParams();
    const [thumbnailUrl, setThumbnailUrl] = useState();



    const formik = useFormik({
        initialValues: {
            title: "",
            excerpt: "",
            description: "",
            language: "en",
            thumbnail: "",
            duration: "",
            authors: [],
            genres: [],
            lists: [],
            type: "ALBUM"
        },
        validationSchema: yup.object({
            title: yup.string().required(),
            description: yup.string().required(),
            excerpt: yup.string().required(),
        }),
        onSubmit: submit,
    });

    const { values, errors, touched, setValues, handleSubmit } = formik;

    const fetchBanner = useCallback(() => {
        AlbumServices.get(params._id)
            .then(res => {
                setThumbnailUrl(`http://localhost:4200${res.result.album.thumbnail}`);
                delete res.result.album.thumbnail;
                setValues(res.result.album);
            })
            .catch(err => enqueueSnackbar(err.message, { variant: "error" }))
    }, [params, setValues]);

    const handleSelectImage = (e) => {
        const file = e.target.files[0];
        const url = window.URL.createObjectURL(file);
        formik.setFieldValue("thumbnail", file);
        setThumbnailUrl(url);

    }

    function submit(values) {
        const fd = new FormData();
        Object.keys(values).forEach(key => {
            if (key == "_id") return;
            fd.append(key, values[key]);
        })
        let req;
        if (values._id) {
            req = AlbumServices.update(values._id, fd);
        } else {
            req = AlbumServices.create(fd);
        }

        return req.then(res => {
            enqueueSnackbar(res.message ?? "", { variant: "success" });
            setThumbnailUrl(`http://localhost:4200${res.result.album.thumbnail}`);
            delete res.result.album.thumbnail;
            setValues(res.result.album);
        }).catch(err => {
            enqueueSnackbar(err.message, { variant: "error" });
        }).finally(() => {
            formik.setSubmitting(false);
        })
    }

    const initComponent = useCallback(() => {
        fetchBanner();
    }, [fetchBanner]);

    useEffect(() => {
        initComponent()
    }, [initComponent, params])

    return (
        <Container sx={{ my: 4 }} maxWidth="xl">

            <Grid container>

                <Grid item xs={3}>

                    <Typography variant="h4">Album Details</Typography>

                    <Grid container gap={2} sx={{ mt: 3 }}>
                        <Grid item xs={12}>
                            <label htmlFor="thumbnail" style={{ height: 150, width: 150, display: "block", backgroundColor: "#cccccc20", borderRadius: 10, overflow: "hidden", cursor: "pointer" }} >
                                <input onChange={e => handleSelectImage(e)} type="file" accept="image/png, image/jpeg, image/jpg" style={{ display: "none" }} id="thumbnail" />
                                <img src={thumbnailUrl} style={{ height: "100%", width: "100%", objectFit: "cover" }} onError={e => e.target.src = "https://placehold.co/100"} />
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth {...formik.getFieldProps("title")} error={errors?.title && touched?.title} size="small" variant="filled" label="Title" />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField multiline fullWidth {...formik.getFieldProps("excerpt")} error={errors?.excerpt && touched?.excerpt} size="small" variant="filled" label="Excerpt" />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField multiline fullWidth {...formik.getFieldProps("description")} error={errors?.description && touched?.description} size="small" variant="filled" label="Description" />
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
            <Button onClick={handleSubmit}>Save</Button>
        </Container>
    )
}