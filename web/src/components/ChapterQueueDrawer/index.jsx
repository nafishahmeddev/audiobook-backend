import { Button, Drawer, Box, List, IconButton } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import ChapterQueueItem from "./ChapterQueueItem";
import { ChapterQueuesActions } from "../../store/slices/chapters-queue";
import { IconBook } from "@tabler/icons";
import UploaderService from "@app/services/admin/UploaderService";

export default function ChapterQueueDrawer() {
    const [open, setOpen] = useState(false);
    const reference = useRef();
    const queues = useSelector(state => state.chapterQueue);
    const dispatch = useDispatch();
    const [controller, setController] = useState(new AbortController());
    const [isUploading, setIsUploading] = useState(null);


    const handleAdd = () => {
        const file = reference.current.files[0];
        if (!file) return alert("Please select file...")
        const key = Math.round(Math.random() * 9999);
        UploaderService.saveCacheFile(key, file)
            .then(res => {
                dispatch(ChapterQueuesActions.add({
                    key,
                    title: `This is title ${key}`,
                    bookName: "Ahilaki",
                    chapterName: "Chapter 1",
                    file: {
                        name: file.name,
                        size: file.size,
                        type: file.type
                    }
                }));
            })
            .catch(err => {
                console.log(err);
            });
    }

    const handleAbort = (queue) => {
        controller.abort();
        setController(null);
        dispatch(ChapterQueuesActions.update({
            ...queue,
            isFailed: true,
            retried: 3,
            progress: 0
        }));
    }

    const handleDelete = async (queue) => {
        dispatch(ChapterQueuesActions.remove(queue));
        await UploaderService.deleteCacheFile(queue.key).catch(console.error)
    }
    const processQueue = useCallback(async () => {
        if (Object.values(queues).filter(queue => !queue.isFailed).length == 0 || isUploading) return false
        const queue = Object.values(queues).filter(queue => !queue.isFailed)[0];
        setIsUploading(queue.key);
        try {

            const blob = await UploaderService.getCacheFile(queue.key);
            console.log(blob);
            const file = new File([blob], queue.file.name, {
                type: queue.file.type
            })
            const fd = new FormData();
            fd.append("file", file);
            const _controller = new AbortController();
            setController(_controller);
            await UploaderService.upload(fd, _controller, ({ progress }) => {
                dispatch(ChapterQueuesActions.update({
                    ...queue,
                    progress: progress
                }));
            });
            await fetch(`/persist/delete?id=${queue.key}`);
            dispatch(ChapterQueuesActions.remove(queue));
            setIsUploading(null);
        } catch (err) {
            const retried = (queue.retried ?? 0) + 1;
            dispatch(ChapterQueuesActions.update({
                ...queue,
                retried: retried,
                isFailed: retried >= 3,
            }));
            setIsUploading(null);
        }
    }, [queues, isUploading]);


    useEffect(() => {
        processQueue();
    }, [queues, isUploading])
    return (
        <>
            <Drawer open={open} onClose={e => setOpen(false)} anchor="right">
                <Box height="100%" display="flex" flexDirection="column" bgcolor="#e5e5e5" width={300}>
                    <Box flex={1} overflow="auto" gap={1} p={2}>
                        {Object.values(queues).map(queue => (
                            <ChapterQueueItem key={queue.key}
                                queue={{ ...queue, isUploading: isUploading == queue.key }}
                                onAbort={handleAbort}
                                onDelete={handleDelete} />
                        ))}
                    </Box>
                    <Box>
                        <input type="file" ref={reference} />
                        <Button onClick={handleAdd}>Add</Button>
                    </Box>
                </Box>

            </Drawer>
            <Box position="fixed" top={100} right={0} bgcolor="red" borderRadius="10px 0 0 10px">
                <IconButton onClick={e => setOpen(!open)} color="primary">
                    <IconBook />
                </IconButton>
            </Box>
        </>
    )
}