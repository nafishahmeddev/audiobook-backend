import axios from "axios";
import Request from "../../lib/request";
const request = new Request("/")
export default class UploaderService {
    static saveCacheFile = (key, file) => {
        return fetch(`/persist/save?id=${key}`, {
            method: "post",
            body: file,
            headers: {
                "content-type": file.type
            }
        })
    }
    static getCacheFile(key) {
        return fetch(`/persist/get?id=${key}`).then(res => {
            if (res.status != 200) throw new Error("Error");
            return res.blob()
        });
    }

    static deleteCacheFile(key) {
        return fetch(`/persist/delete?id=${key}`).then(res => {
            if (res.status != 200) throw new Error("Error");
            return res;
        });
    }


    static upload(fd, controller, onProgress = () => { }) {
        return request.http.post("/upload", fd, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (evt => {
                onProgress({
                    loaded: evt.loaded,
                    progress: evt.progress
                })
            }),
            signal: controller.signal
        });
    }
}