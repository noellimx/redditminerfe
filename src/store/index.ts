interface StallFormInfo {
    platforms: string[];
    creators: string[];
    "product_names" : string[]
}

// const sampleInfo: Info = {"login_urls": {"google": "/auth/google/login"}, "user_info": {"Id": 0}};
export type Info = {
    "login_urls": { [provider: string]: /*url*/string }
    "user_info": { Id: number, Gmails?: string[] } | null
    "server_url" : string

    "outlet_form" : StallFormInfo
}
