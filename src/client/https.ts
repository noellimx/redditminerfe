export const Ping = async (mkServerUrl: string) => {
    const url = mkServerUrl + "/ping";
    try {
        const response = await fetch(url, {credentials: 'include'});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const respBody = await response.json();
        return {...respBody, "server_url": mkServerUrl}; // todo: need await??
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
    }
}


export const LogoutC = async (mkServerUrl: string) => {
    const url = mkServerUrl + "/revoke_session";
    try {
        const response = await fetch(url, {method: "POST", credentials: 'include'});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return; // todo: need await??
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
    }
}


import * as z from "zod";

const OfficialLinkSchema = z.object({
    "value": z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FormSchema = z.object({
    "outlet_name": z.string(),
    "outlet_type": z.string(),
    "product_name": z.string(),
    "address": z.string(),
    "postal_code": z.string(),
    "official_links": z.array(OfficialLinkSchema),
});

export type FieldForms = z.infer<typeof FormSchema>;

export const AddOutlet = async (mkServerUrl: string, body: FieldForms) => {
    // body["product_name"] = "";
    const url = mkServerUrl + "/outlet/";
    const response = await fetch(url, {
        method: "POST", credentials: 'include', headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json(); // todo: need await??
}

export type LatLong = {
    latitude: string
    longitude: string
}
export interface Outlet {
    "name": string
    "address": string
    "postal_code": string
    "official_links": string[]
    "latlong"?: LatLong
}

export const GetOutlet = async (mkServerUrl: string) => {
    // body["product_name"] = "";
    const url = mkServerUrl + "/outlets/";
    const response = await fetch(url, {
        method: "GET", credentials: 'include', headers: {},
    });
    if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        throw new Error(`Response status: ${response.status}`);
    }

    const resp = await response.json() as {
        data: {
            outlets?: Outlet[];
        }
    };


    return resp.data.outlets;
}