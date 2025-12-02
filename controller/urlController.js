import base62 from '@sindresorhus/base62';
import crypto from "crypto"
import { save, findByID, getUrlsByUserID } from "../models/urlModel.js";
import { cacheUrl, getCachedUrl } from "../services/urlServices.js";



export async function createUrl(req, res) {
    let tries = 3
    while (tries >= 1) {
        try {
            let randomNumber = await crypto.randomInt(0, 281474976710655)
            let randomID = base62.encodeInteger(randomNumber)
            await save(randomID, req.session.userID, req.body.url)
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
    let longUrl = await getCachedUrl(req.params.urlId)
    if (longUrl == null) {
        try {
            longUrl = await findByID(req.params.urlId)
            if (longUrl == null) {
                res.status(404).json({ message: "url not found" })
                return
            }
            await cacheUrl(req.params.urlId, longUrl)
            res.redirect(longUrl)
            return
        } catch (error) {
            res.status(500).json({ message: "internal server error" })
            console.error("error getting a url: ", error)
            return
        }
    }
    res.redirect(longUrl)
    return

}


export async function getUserUrls(req, res) {
    const urls = await getUrlsByUserID(req.session.userID)
    if(urls == null) {
        res.status(201).json({
            message:"no urls found",
            count : 0,
            urls :[]
        })
        return
    }
    res.status(201).json({
        message: "urls found",
        count: urls.length,
        urls: urls
    })
} authenticated