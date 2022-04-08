import { Express, Request, Response } from "express";
import DB from "./db";
export const validateUsername = (username: string, res: Response, error_code: string) => {
    let response = {}
    if (username.length == 0) {
        response["error"] = true
        response["error_code"] = error_code
        response["massage"] = "Empty Username"
        response["data"] = { "room_created": false }
    }

    if (response["error"]) {
        res.send(JSON.stringify(response))
    }
}
