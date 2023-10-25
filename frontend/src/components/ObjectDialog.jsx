import { Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ObjectView } from 'react-object-view'
import { ObjectDialogActions } from "../store/slices/objectDialog";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
function ReactJson({src}){
    return (
        <pre>{JSON.stringify(src, null, 2)}</pre>
    )
}
ReactJson.propTypes= {
    src : PropTypes.any
}
export default function ObjectDialog() {
    const dispatch = useDispatch();
    const objectDialog = useSelector(state => state.objectDialog);
    const { options, payload } = objectDialog;
    const handleCloseDialog = () => {
        dispatch(ObjectDialogActions.closeDialog());
    }
    return (
        <Dialog open={objectDialog?.isDialogOpen ?? false} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", py: 1, px: 1.5 }} component={Box}>
                <Typography variant="h5" flexGrow={1} sx={{ my: 0 }}>  Source Inspector</Typography>

                <Box onClick={handleCloseDialog} display="flex" alignItems="center" sx={{cursor:"pointer"}}>
                    <CloseIcon />
                </Box>

            </DialogTitle>
            <DialogContent sx={{ px: 0, py: 0 }}>
                <Stack spacing={2}>
                    {
                        Array.isArray(payload) ? (
                            <Box>
                                {objectDialog.payload.map((obj, index) => options?.expanded ? <ReactJson src={obj} key={index} collapsed={false} /> : <ObjectView key={index} data={obj} />)}
                            </Box>
                        ) : (options?.expanded ? <ReactJson src={payload ?? {}} collapsed={false}/> : <ObjectView data={payload ?? {}} />)
                    }
                </Stack>

            </DialogContent>
        </Dialog>
    )
}