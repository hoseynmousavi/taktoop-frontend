const app = require("express")()
const fs = require("fs")
const path = require("path")

app.route("/static/:folder/:file").get((req, res) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*")
    if (fs.existsSync(path.join(__dirname, `/static/${req.params.folder}/${req.params.file}.gz`)))
    {
        if (req.params.file.includes(".js")) res.setHeader("Content-Type", "application/javascript")
        else if (req.params.file.includes(".css")) res.setHeader("Content-Type", "text/css")
        res.setHeader("Content-Encoding", "gzip")
        res.setHeader("Vary", "Accept-Encoding")
        res.setHeader("Cache-Control", "max-age=31536000")
        res.sendFile(path.join(__dirname, `/static/${req.params.folder}/${req.params.file}.gz`))
    }
    else if (fs.existsSync(path.join(__dirname, `/static/${req.params.folder}/${req.params.file}`)))
    {
        if (req.params.file.includes(".js")) res.setHeader("Content-Type", "application/javascript")
        else if (req.params.file.includes(".css")) res.setHeader("Content-Type", "text/css")
        res.setHeader("Cache-Control", "max-age=31536000")
        res.sendFile(path.join(__dirname, `/static/${req.params.folder}/${req.params.file}`))
    }
    else res.sendStatus(404)
})

app.route("/.well-known/assetlinks.json").get((req, res) => res.sendFile(path.join(__dirname, "assetlinks.json")))

app.route("/:file").get((req, res) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*")
    if (fs.existsSync(path.join(__dirname, `/${req.params.file}`)))
    {
        res.setHeader("Cache-Control", "max-age=604800")
        res.sendFile(path.join(__dirname, `/${req.params.file}`))
    }
    else
    {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate") // HTTP 1.1.
        res.setHeader("Pragma", "no-cache") // HTTP 1.0.
        res.setHeader("Expires", "0") // Proxies.
        res.sendFile(path.join(__dirname, "index.html"))
    }
})

app.route("*").get((req, res) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate") // HTTP 1.1.
    res.setHeader("Pragma", "no-cache") // HTTP 1.0.
    res.setHeader("Expires", "0") // Proxies.
    res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(5000, () => console.log(`Server is running ... `))