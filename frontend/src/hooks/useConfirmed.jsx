import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { useState } from "react"

export default function useConfirmed() {
    const [state, setState] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: ()=>{},
        onCancel: ()=>{},
    });

    const confirmed = ({title, message, onConfirm, onCancel}) =>{
        setState({
            open: true,
            title: title,
            message: message,
            onConfirm: onConfirm,
            onCancel: onCancel
        })
    }

    const handleCloseDialog = () =>{
        setState({
            open: false,
            title: "",
            message: "",
            onConfirm: ()=>{},
            onCancel: ()=>{},
        })
    }
    const ConfirmDialog = () => {
        return (
            <Dialog open={state.open}>

                <DialogTitle>{state.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{state.message}</DialogContentText>
                </DialogContent>
                <DialogActions sx={{px:2, pb:2}}>
                    <Button onClick={()=>{handleCloseDialog(); state.onCancel && state.onCancel()}} color="error" variant="contained" size="small">Cancel</Button>
                    <Button onClick={()=>{handleCloseDialog(); state.onConfirm && state.onConfirm()}} color="primary" variant="contained" size="small">Confirm</Button>
                </DialogActions>

            </Dialog>
        )
    }

    return { ConfirmDialog, confirmed }
}