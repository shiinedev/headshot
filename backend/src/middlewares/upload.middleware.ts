
import { config } from "@/config";
import type { Request } from "express";
import multer from "multer"


const storage = multer.memoryStorage();


const fileFilter = (req:Request,file:Express.Multer.File,cb:multer.FileFilterCallback) => {

    if(config.upload.allowedMimeTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error("Invalid file type. Only JPEG, PNG, JPG and WEBP are allowed."));
    }

}

export const upload = multer({
    storage,
    limits:{
        fileSize: config.upload.maxFileSizeInBytes,
        files: config.upload.maxFilesCount
    },
    fileFilter,
});