import { Box, AppBar, Toolbar, IconButton, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import SideBar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { AppActions } from "../../store/slices/app";
export default function TopBar() {
    const dispatch = useDispatch();
    const isDrawerOpen = useSelector(state => state.app.isDrawerOpen);
    const handleDrawerOpen = () => {
        dispatch(AppActions.openDrawer());
    }

    const handleDrawerClose = () => {
        dispatch(AppActions.closeDrawer());
    }
    return (
        <React.Fragment>
            <Box sx={(theme) => ({
                display: "none",
                [theme.breakpoints.down("md")]: { display: "flex" }
            })}>
                <AppBar position="static" >
                    <Toolbar>
                        <IconButton edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }} onClick={handleDrawerOpen}><MenuIcon /></IconButton>
                    </Toolbar>
                </AppBar>
            </Box>
            <Drawer open={isDrawerOpen} onClose={handleDrawerClose}>
                <SideBar />
            </Drawer>
        </React.Fragment>
    )
}