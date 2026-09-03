import axios from 'axios'
import { tool } from "langchain"
import * as z from 'zod'

export const listFiles = tool(
    async ({ }) => {
        console.log("================================");
        console.log("using list files tool");
        console.log("================================");

        const response = await axios.get("http://01a067f5-40ce-75c1-82e1-cf12bf9404b1.agent.localhost/list-files")

        console.log("================================");
        console.log("response from the list files tool", response.data);
        console.log("================================");


        return JSON.stringify(response.data.files)
    },
    {
        name: "listFiles",
        description: "List all the files in the project directory. This is useful for understanding what files are available to work with.",
        schema: z.object({})
    }
)

export const readFiles = tool(
    async ({ files }) => {
        console.log("================================");
        console.log("using read files tool", files);
        console.log("================================");

        const response = await axios.get("http://01a067f5-40ce-75c1-82e1-cf12bf9404b1.agent.localhost/read-files?files=" + files.join(","))

        console.log("================================");
        console.log("using read files tool", response.data);
        console.log("================================");


        return JSON.stringify(response.data)
    },
    {
        name: "readFiles",
        description: "Read the contents of specified files.This is useful for understanding the content of files that are relevant to the task at hand.",
        schema: z.object({
            files: z.array(z.string()).describe("This list of files absolute paths to read. These should be files that were listed using the list_files tool or created later.")
        })
    }
)

export const updateFiles = tool(
    async ({ files }) => {
        console.log("================================");
        console.log("using update files tool", files);
        console.log("================================");

        const response = await axios.patch("http://01a067f5-40ce-75c1-82e1-cf12bf9404b1.agent.localhost/update-files", { updates: files })

        console.log("================================");
        console.log("using update files tool", response.data);
        console.log("================================");

        return JSON.stringify(response.data.results)
    },
    {
        name: "updateFiles",
        description: "Update the contents of specified files. This is useful for making changes to the files based on the requirements of the task at hand.This tool can also use to create new files by providing a new file name in the file field and the content to the added in the content field.",
        schema: z.object({
            files: z.array(z.object({
                file: z.string().describe("The absolute path of the file to update"),
                content: z.string().describe("The new content for the file, the content should support json format.") 
            })).describe("This list of files absolute paths to update. These should be files that were listed using the list_files tool or created later.")
        })
    }
)