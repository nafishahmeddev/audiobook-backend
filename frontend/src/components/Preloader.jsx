import { Box, CircularProgress, Dialog, Paper } from "@mui/material";
import { useSelector } from "react-redux";

export default function Preloader() {
    const preloader = useSelector(state=>state.preloader);
    return (
        <Dialog height="100vh" open={preloader?.show}>
            <Box p={3} component={Paper}>
                <CircularProgress/>
            </Box>
        </Dialog>
    )
}