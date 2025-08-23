import { config } from "dotenv"; config();
import { Request, Response } from "express";

export async function googleRedirect(req: Request, res: Response): Promise<any> {
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fforms` + // scope
    `https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fscript.deployments&` + // scope
    `access_type=offline&` +
    `include_granted_scopes=true&` +
    `response_type=code&` +
    `state=state_parameter_passthrough_value&` +
    `redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fgoogle%2Fconnect%2Fauthorize&` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}`;

    res.redirect(redirectUrl);
}