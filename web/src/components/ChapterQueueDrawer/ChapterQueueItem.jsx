import { IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { useDispatch } from "react-redux";
import { ChapterQueuesActions } from "../../store/slices/chapters-queue";

export default function ChapterQueueItem({ queue, uploader, onAbort, onDelete }) {
    const dispatch = useDispatch();
    const getText = () => {
        if (queue.isUploading) return "Uploading...";
        if (queue.isFailed) return "Failed";
        return "Pending";
    }
    const getColor = () => {
        if (queue.isUploading) return "#056608";
        if (queue.isFailed) return "#ff3333";
        return "#ffcc00";
    }

    const handleRetry = () => {
        dispatch(ChapterQueuesActions.update({
            ...queue,
            isFailed: false,
            retried: 2
        }))
    }


    return (
        <Box sx={{ mb: 1, position: "relative" }} bgcolor="white" borderRadius={3} overflow="hidden">
            <Box sx={{ p: 1.5, position: "relative" }} display="flex">
                <Box flex={1}>
                    <Typography>{queue?.chapterName ?? ""} {queue?.bookName ?? ""}</Typography>
                    <Typography fontSize={11}>{(queue.file.size / (1024 * 1024)).toFixed(2)}MB</Typography>
                </Box>
                {
                    queue.isUploading && (
                        <IconButton size="small" onClick={e => onAbort(queue)}><CloseIcon /></IconButton>
                    )
                }

                {
                    queue.isFailed && (
                        <IconButton size="small" onClick={e => handleRetry(queue)}><UploadIcon /></IconButton>
                    )
                }

                {
                    !queue.isUploading && (
                        <IconButton size="small" onClick={e => onDelete(queue)}><DeleteIcon /></IconButton>
                    )
                }

                <Box position="absolute" top={0} right={0} px={1} py={0} bgcolor={getColor()} borderRadius="0 0 0 5px">
                    <Typography fontSize={10} color="white">{getText()}{queue.isUploading && <> ({((queue.file.size * queue.progress) / (1024 * 1024)).toFixed(2)}MB)</>}</Typography>
                </Box>
            </Box>

            {
                queue.isUploading && (
                    <Box width={`${queue.progress * 100}%`} bgcolor="#00ff0030" position="absolute" top="0" left="0" height="100%" sx={{ pointerEvents: "none", transition: "width 0.15s linear" }} />)
            }
        </Box>
    )
}