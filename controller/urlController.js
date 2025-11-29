import urlModel from "../models/urlModel.js";

export async function createUrl(req, res) {
    try {
        let id = await urlModel.save(req.body.url)
        res.status(201).json({
            id: id,
            long_url: req.body.url,
            message:"url created"
        })
        return
    } catch (error) {
        res.status(500).json({message:"internal server error"})
        console.error("error creating url: ", error)
    }
}


export async function getUrl(req, res) {
    try {
        let longUrl = await urlModel.getUrlByID(req.params.urlId)
        if (longUrl == null) {
            res.status(404).json({message:"url not found"})
            return
        }
        res.redirect(longUrl)
        return
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
        console.error("error getting a url: ", error)
    }
}
