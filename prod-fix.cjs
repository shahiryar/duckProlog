const fs = require("fs/promises")

const main = async() => {
    try {
        const content = await fs.readFile("./dist/manifest.json", "utf-8")
        const data = JSON.parse(content)
        data?.web_accessible_resources?.forEach(resource => delete resource.use_dynamic_url)
        await fs.writeFile("./dist/manifest.json", JSON.stringify(data), "utf-8")
    } catch (error) {
        console.error(error)
    }
}

main()
