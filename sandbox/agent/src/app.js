import express from "express"
import morgan from "morgan"
import fs from "fs"
import path from "path"
const app = express()
app.use(morgan("dev"))

const WORKING_DIR = "/workspace"

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello from sandbox agent!",
        status: "success"
    })
})

app.get("/list-files", async (req, res) => {
    const listFiles = async (dir, baseDir) => {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true })
        const files = []
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            const relativePath = path.relative(baseDir, fullPath)
            if (entry.isDirectory() && ['node_modules', '.git', 'dist'].includes(entry.name)) continue

            if (entry.isDirectory()) {
                files.push(...await listFiles(fullPath, baseDir))
            } else {
                files.push(relativePath)
            }
        }
        return files
    }
    try {
        const files = await listFiles(WORKING_DIR, WORKING_DIR)
        return res.status(200).json({
            message: "Files listed successfully",
            files
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error listing files" + err.message,
            status: "error"
        });
    }
})

/**
 * @route GET/read-files
 * @description Read the contents requested in query params 'files' and returns thier contant as JSON object.
 * -eg /read-files?files=file1.txt,/src/file2.txt
 */
app.get("/read-files", async (req, res) => {
    const files = req.query.files

    if (!files) {
        return res.status(400).json({
            message: "Query parameter 'files' is required",
            status: "error"
        })
    }

    const fileList = files.split(',')

    const result = await Promise.all(fileList.map(async (filename) => {
        const filePath = `${WORKING_DIR}/${filename}`
        try {
            const content = await fs.promises.readFile(filePath, "utf-8")
            return {
                [filePath]: content
            }
        } catch (err) {
            return {
                [filePath]: `Error reading file: ${err.message}`
            }
        }
    }))

    return res.status(200).json({
        message: "File contents retrieved successfully",
        result
    })
})

/**
 * @route PATCH /update-file
 * @description updates the content of files specified in the request body. The request body should contains property 'updates'with a JSON array of object, each object should have a 'file' property specifying the file path (relative to the working directory) and a 'content' property specifying the new content for the file.
 */
app.patch("/update-files", async (req, res) => {
    const updates = req.body.updates

    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({
            message: "Request body should contain an 'updates' property with a JSON array of objects",
            status: "error"
        })
    }

    const results = await Promise.all(updates.map(async (update) => {
        const { file, content } = update
        const filePath = path.join(WORKING_DIR, file)
        try {
            await fs.promises.writeFile(filePath, content, "utf-8")
            return {
                [filePath]: "File updated successfully"
            }
        } catch (err) {
            return {
                [filePath]: `Error updating file: ${err.message}`
            }
        }
    }))

    return res.status(200).json({
        message: "Files updated successfully",
        results
    })
})

/**
 *@route POST /create—fi les
* @description Creates new files with the content specified in the request body. The request body should contain a property 'files' with a JSON Array of objects, each object should have 'file'property specifying the file path (relative to the working directory) and a 'content' property specifying the content for the new file.
 */
app.post("/create-files", async (req, res) => {
    const files = req.body.files

    if (!files || !Array.isArray(files)) {
        return res.status(400).json({
            message: "Request body should contain a 'files' property with a JSON array of objects",
            status: "error"
        })
    }

    const results = await Promise.all(files.map(async (fileObj) => {
        const { file, content } = fileObj
        const filePath = path.join(WORKING_DIR, filename)
        try {
            await fs.promises.writeFile(filePath, content, "utf-8")
            return {
                [filePath]: "File created successfully"
            }
        } catch (err) {
            return {
                [filePath]: `Error creating file: ${err.message}`
            }
        }
    }))

    return res.status(201).json({
        message: "Files created successfully",
        results
    })
})

export default app