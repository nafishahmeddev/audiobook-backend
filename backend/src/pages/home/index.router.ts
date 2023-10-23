import { Album } from "../../db/default";
import { Router } from "express";

const router = Router({mergeParams: true});

router.get("/", (req: any, res: any)=>{
    return res.status(200).json({
        "resultCode": 200, 
        "message": "cool",
        result: {
            "Ok" : "OK"
        }
    });
})

export default router;