import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100dvh">
            <Box textAlign="center">
                <Typography variant="h1">{error.status}</Typography>
                <Typography>Sorry, an unexpected error has occurred.</Typography>
                <Typography>
                    <i>{error.statusText || error.message}</i>
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/")}>Go back to home</Button>
            </Box>
        </Box>
    );
}