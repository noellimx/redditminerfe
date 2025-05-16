

export const Ping = async (mkServerUrl :string) => {
    const url = mkServerUrl + "/ping";
    try {
        const response = await fetch(url, {credentials: 'include'});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const respBody = await response.json();
        return {...respBody, "server_url" : mkServerUrl}; // todo: need await??
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
    }
}


export const GetStall = async (mkServerUrl :string) => {
    const url = mkServerUrl + "/stall";
    try {
        const response = await fetch(url, {credentials: 'include'});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const respBody = await response.json();
        return {...respBody, "server_url" : mkServerUrl}; // todo: need await??
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
    }
}


export const LogoutC = async (mkServerUrl :string) => {
    const url = mkServerUrl + "/revoke_session";
    try {
        const response = await fetch(url, {method: "POST", credentials: 'include'});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json(); // todo: need await??
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
    }
}



import * as z from "zod";

const OfficialLinkSchema = z.object({
    "value": z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WelcomeSchema = z.object({
    "outlet_name": z.string(),
    "outlet_type": z.string(),
    "product_name": z.string(),
    "address": z.string(),
    "postal_code": z.string(),
    "official_links": z.array(OfficialLinkSchema),
});

export type FieldForms = z.infer<typeof WelcomeSchema>;

export const AddStall = async (mkServerUrl :string, body: FieldForms) => {
    const url = mkServerUrl + "/stall";
    try {
        const response = await fetch(url, {method: "POST", credentials: 'include',   headers: {
                'User-Agent': 'undici-stream-example',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json(); // todo: need await??
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
    }
}