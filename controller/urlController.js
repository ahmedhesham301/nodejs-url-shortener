import base62 from '@sindresorhus/base62';
import urlModel from "../models/urlModel.js";
import crypto from "crypto"



export async function createUrl(req, res) {
    let tries = 3
    while (tries >= 1) {
        try {
            let randomNumber = await crypto.randomInt(0, 281474976710655)
            let randomID = base62.encodeInteger(randomNumber)
            await urlModel.save(randomID, req.body.url)
            res.status(201).json({
                id: randomID,
                long_url: req.body.url,
                message: "url created"
            })
            return
        } catch (error) {
            if (error.code === '23505') {
                if (tries == 1) {
                    res.status(500).json({ message: "internal server error" })
                    console.error(`error creating url after many tries: `, error)
                    return
                }
                tries -= 1
            }
            else {
                res.status(500).json({ message: "internal server error" })
                console.error("error creating url: ", error)
                return
            }

        }
    }
}


export async function getUrl(req, res) {
    try {
        let longUrl = await urlModel.getUrlByID(req.params.urlId)
        if (longUrl == null) {
            res.status(404).json({ message: "url not found" })
            return
        }
        res.redirect(longUrl)
        return
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
        console.error("error getting a url: ", error)
    }
}
