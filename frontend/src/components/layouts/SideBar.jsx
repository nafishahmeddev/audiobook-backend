import { Box, Collapse, ListItemIcon, ListItemText, Typography, ListItemButton, List, Grid, IconButton, Avatar } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { adminMenu } from "@app/config/menus";
import * as AuthServices from "@app/services/auth.service";
import { useDispatch, useSelector } from "react-redux";
import { AppActions } from "../../store/slices/app";
import { Icon } from '@iconify/react';
import Iconify from "@app/components/base/iconify";


const SideBarMenuItem = ({ item, base }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState();

    const route = "/" + [...base, item.route].join("/");
    const hasChild = item.children && item.children.length > 0;
    const isSelected = route == location.pathname;

    const toggle = () => {
        setExpanded(!expanded);
    }

    const onClick = () => {
        if (hasChild) return toggle();
        navigate(route);
        dispatch(AppActions.closeDrawer());
    }
    return (
        <>
            <ListItemButton selected={isSelected} onClick={onClick} sx={{
                "&.Mui-selected .MuiListItemIcon-root": {
                    color: (theme)=>theme.palette.secondary.main
                }, 
                "&.Mui-selected .MuiListItemText-root": {
                    color: (theme)=>theme.palette.secondary.main
                },
                "& .MuiListItemText-root" : {
                    color: (theme)=>theme.palette.grey[600]
                },
                py: 0.6
            }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                    {base.length == 0 && item.icon && <Icon height={20} width={20} icon={item.icon} />}

                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: 400, pt:0.2 }} />
                {
                    hasChild && (<Iconify icon="ph:caret-right" height={18} width={18} sx={{transform: `rotate(${expanded? 90:0}deg)`, transition: "0.25s"}}  />)
                }
            </ListItemButton>
            {
                hasChild && (
                    <Collapse in={expanded}>
                        <SideBarList items={item.children} base={[...base, item.route]} />
                    </Collapse>
                )
            }
        </>
    )
}

SideBarMenuItem.propTypes = {
    item: PropTypes.object,
    base: PropTypes.array,
}
function SideBarList({ items = [], base = [], }) {
    return (
        <List disablePadding>
            {items.map(item => <SideBarMenuItem key={item.route} base={base} item={item} />)}
        </List>
    )
}

SideBarList.propTypes = {
    items: PropTypes.array,
    base: PropTypes.array,
}

export default function SideBar() {
    const profile = useSelector(state => state.auth.profile);
    const logout = () => {
        AuthServices.logout();
    }
    return (
        <>
            <Box bgcolor="primary.main" color="white" p={2} py={3}>
                <Grid spacing={2} container alignItems="center">
                    <Grid item>
                        <Avatar sx={{ width: 50, height: 50, bgcolor: "secondary.main", color:"white" }}><Iconify height={35} width={35} icon="solar:user-bold-duotone"/></Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography>{profile?.name}</Typography>
                        <Typography variant="body2">{profile?.email}</Typography>
                    </Grid>
                    <Grid item alignSelf="flex-start" >
                        <IconButton size="small" sx={{ color: "white" }} onClick={logout}><Iconify icon="solar:logout-3-bold" /> </IconButton>
                    </Grid>
                </Grid>
            </Box>
            <Box flexGrow="1" overflow="auto">
                <Box>
                    {adminMenu.groups.map(group => (
                        <Box key={group.label} mb={2} mt={2}>
                            <Typography sx={{ px: 2, fontSize: 11, fontWeight: 700, color: (theme) => theme.palette.grey[500], letterSpacing: 1.1 }}>{group.label}</Typography>
                            <Box mt={1}>
                                <SideBarList items={group.items} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </>
    );
}

