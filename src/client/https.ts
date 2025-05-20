import * as z from "zod";

const AuthHeader = () => {
    return {
        "Authorization": `Bearer ${localStorage.getItem("session_id")}`
    }
}

export const Ping = async (mkServerUrl: string) => {
    const url = mkServerUrl + "/ping";
    try {
        const response = await fetch(url, {credentials: 'include', headers: {...AuthHeader()}});
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
        const response = await fetch(url, {method: "POST", credentials: 'include', ...AuthHeader()});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return; // todo: need await??
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
    }
}

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
            'Content-Type': 'application/json', ...AuthHeader(),
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const data = await response.json() as { error: string };

        throw new Error(`Response status: ${response.status}. Error: ${data.error}`);
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
    "review_links": string[]
    "latlong"?: LatLong
    "id": number
}

export const GetOutlet = async (mkServerUrl: string) => {
    // body["product_name"] = "";
    const url = mkServerUrl + "/outlets/";
    const response = await fetch(url, {
        method: "GET", credentials: 'include', headers: {...AuthHeader(),},
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