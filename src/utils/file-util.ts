import fs from "fs"
import path from "path"

export const removeFile = (filePath: string) => {
    const relativePath = filePath.startsWith("/") ? filePath.substring(1) : filePath
    
    const absolutePath = path.resolve(relativePath)

    if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath)
    }
}