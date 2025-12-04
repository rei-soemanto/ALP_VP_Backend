// src/middlewares/file-middleware.ts
import multer from "multer"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"

const uploadDir = "images/posts"
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4()
        const ext = path.extname(file.originalname)
        cb(null, `${uniqueSuffix}${ext}`)
    },
})

export const fileUploadMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true)
        } else {
            cb(new Error("Only images are allowed"))
        }
    },
})