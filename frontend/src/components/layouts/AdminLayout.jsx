import { Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import SideBar from "./SideBar";
import { Suspense } from "react";
import TopBar from "./TopBar";


export default function AdminLayout() {

    return (
        <Box height="100dvh" display="flex" flexDirection="column">
            <TopBar />
            <Box display="flex" flexGrow={1} overflow="auto">
                <Box minWidth={320} bgcolor="#cccccc20" boxShadow={1} display="flex" flexDirection="column"
                    sx={(theme) => ({
                        display: "none",
                        [theme.breakpoints.up("md")]: { display: "flex" }
                    })}>
                    <SideBar />
                </Box>
                <Box flexGrow={1} overflow="auto" >
                    <Suspense fallback={
                        <Box p={3} height="100%" display="flex" alignItems="center" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    }>

                        <Outlet />
                    </Suspense>
                </Box>
            </Box>
        </Box>
    )
}