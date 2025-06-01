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

export type NewOutletFieldForm = z.infer<typeof FormSchema>;
export type ExistingOutletFieldForm = z.infer<typeof FormSchema> & { id: number };


export const UpdateOutlet = async (mkServerUrl: string, body: ExistingOutletFieldForm) => {
    // body["product_name"] = "";
    const url = mkServerUrl + "/outlet/";
    const response = await fetch(url, {
        method: "PUT", credentials: 'include', headers: {
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

export const AddOutlet = async (mkServerUrl: string, body: NewOutletFieldForm) => {
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
    const resp: { data: { id: number } } = await response.json()
    return resp.data.id; // todo: need await??
}

export type LatLong = {
    latitude: string
    longitude: string
}

interface MenuItem {
    id: number;
    name: string;
}

export interface Outlet {
    menu: MenuItem[];
    "id": number
    "name": string
    "address": string
    "postal_code": string
    "official_links": string[]
    "review_links": {
        "link": string
        "platform": string
        "creator": string
    }[]
    "latlong"?: LatLong
}

interface GetOutletQuery {
    [key: string]: string
}

export const GetOutlet = async (mkServerUrl: string, params: GetOutletQuery) => {
    // body["product_name"] = "";
    const url = mkServerUrl + "/outlets";
    const Url = new URL(url);
    if (params) Object.keys(params).forEach(key => Url.searchParams.append(key, params[key]));
    // console.log(Url.toString());
    const response = await fetch(Url, {
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

    return resp.data.outlets?.map((outlet: Outlet) => {
        return {
            id: outlet.id,
            name: outlet.name,
            address: outlet.address,
            postal_code: outlet.postal_code,
            official_links: outlet.official_links || [],
            review_links: outlet.review_links || [],
            latlong: outlet.latlong,

            menu: outlet.menu,
        };
    }) || [];
}

export const GetTasks = async (mkServerUrl: string) => {
    // body["product_name"] = "";
    const url = mkServerUrl + "/tasks";
    const Url = new URL(url);
    const response = await fetch(Url, {
        method: "GET", credentials: 'include', headers: {...AuthHeader(),},
    });
    if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        throw new Error(`Response status: ${response.status}`);
    }

    const resp = await response.json() as GetTasksResponse;

    if (resp.error) {
        console.error(`Response  data error: ${resp.error}`);
        throw new Error(`Response Data error: ${resp.error}`);
    }
    return resp.data.tasks || [];
}


export interface GetTasksResponse {
    data: GetTaskList;
    error: string | null;
}

export interface GetTaskList {
    tasks: TaskGet[];
}

export interface TaskGet {
    id: number;
    subreddit_name: string;
    min_item_count: number;
    interval: string;
    order_by: string;
    posts_created_within_past: string;
}


class NewTaskFieldForm {
    interval?: "hour";
    order_by?: "top" | "best" | "hot" | "new";
    posts_created_within_past?: "hour" | "day" | "month" | "year";
    subreddit_name?: string;
    min_item_count?: number;
}


export const AddTask = async (mkServerUrl: string, body: NewTaskFieldForm) => {
    // body["product_name"] = "";
    const url = mkServerUrl + "/task";
    const response = await fetch(url, {
        method: "POST", credentials: 'include', headers: {
            'Content-Type': 'application/json',
            // ...AuthHeader(),
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const data = await response.json() as { error: string };
        throw new Error(`Response status: ${response.status}. Error: ${data.error}`);
    }
    const resp: { data: { _: null } } = await response.json()
    return resp.data; // todo: need await??
}


export const DeleteTask = async (mkServerUrl: string, body: { id: number }) => {
    // body["product_name"] = "";
    const url = mkServerUrl + "/task";
    const response = await fetch(url, {
        method: "DELETE", credentials: 'include', headers: {
            'Content-Type': 'application/json',
            // ...AuthHeader(),
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const data = await response.json() as { error: string };
        throw new Error(`Response status: ${response.status}. Error: ${data.error}`);
    }
    const resp: { data: { _: null } } = await response.json()
    return resp.data; // todo: need await??
}

export interface GetStatisticsResponseBody {
    data: GetStatistics;
    error: null | string;
}

export interface GetStatistics {
    posts: GetStatistic[];
}


type DateString = string; // "2025-05-31T22:00:00+08:00"
export interface GetStatistic {
    title: string;
    perma_link_path: string;
    data_ks_id: string;
    subreddit_id: string;
    subreddit_name: string;
    polled_time: Date;
    polled_time_rounded_min: Date;

    author_id: string;
    author_name: string;

    comment_count: number | null;
    score: number | null;
    rank: number | null;

    rank_order_type: "top" | "best" | "hot" | "new";
    rank_order_created_within_past: "hour" | "day" | "month" | "year";

    is_synthetic: boolean;
}


interface GetStatisticsQueryParams {
    [key: string]: string | Granularity,
}


export enum Granularity {
    Minute = 1,
    QuarterHour = 2,
    Hour = 3,
    Daily = 4,
}

// Granularity: 1=Minute,2=QuarterHour,3=Hour,4=Daily,5=Mins
export const GetStatistics = async (mkServerUrl: string, params: GetStatisticsQueryParams, contentType :string) => {
    // body["product_name"] = "";
    const url = mkServerUrl + "/statistics";
    const Url = new URL(url);
    if (params) Object.keys(params).forEach(key => Url.searchParams.append(key, params[key]));
    // console.log(Url.toString());
    const response = await fetch(Url, {
        method: "GET", credentials: 'include', headers: {
            'Content-Type': contentType,
        },
    });
    if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        throw new Error(`Response status: ${response.status}`);
    }

    if (contentType === "application/json") {
        const resp = await response.json() as GetStatisticsResponseBody;
        return resp.data.posts || [];
    }

    return await response.text() as string;
}

export const currentDayWindow = () => {
    const now = new Date();
    const toTime = now.toISOString();
    const fromTime = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    return {toTime, fromTime};
}
