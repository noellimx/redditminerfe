import './App.css'
import '@ant-design/v5-patch-for-react-19';

import {Button, Flex, Layout, Typography} from 'antd';
import {useEffect, useState,} from "react";
import {UserOutlined} from "@ant-design/icons";

const {Header, Content} = Layout;

import React from 'react';
import type {MenuProps} from 'antd';
import {Dropdown} from 'antd';
import {Outlet, Route, Routes, useNavigate} from "react-router";
import {Colors} from "./colors";
import {Footer} from "./layouts/Footer/Footer.tsx";

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: "0",
    color: '#fff',
    height: 64,
    lineHeight: '64px',
    backgroundColor: Colors.RED_5,
    width: '100%',
    display: 'flex',
};

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    width: '100%',
    color: '#fff',
    backgroundColor: Colors.RED_1,
};

const layoutStyle = {
    width: '100%',
    overflow: 'hidden',
    height: '100vh',
};


// const sampleInfo: Info = {"login_urls": {"google": "/auth/google/login"}, "user_info": {"Id": 0}};
type Info = {
    "login_urls": { [provider: string]: /*url*/string }
    "user_info": { Id: number } | null
}

interface MKContentProps {
    initInfo?: Info
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MKContent = (_: MKContentProps) => {
    return <Content style={contentStyle}>
        <Outlet />
    </Content>
}

interface MKContent_UserProps {
    initInfo?: Info
}

const MKContent_User:React.FC<MKContent_UserProps> = () => {
    return <Content style={contentStyle}>
        <Outlet />
    </Content>
}


interface MKHeaderProps {
    initInfo?: Info
    logout: () => void
}


const mkServerUrl = "http://localhost:8080"

const items: MenuProps['items'] = [
    // {
    //     key: '/',
    //     label: 'My Account',
    //     disabled: true,
    // },
    // {
    //     type: 'divider',
    // },
    {
        key: '/user',
        label: 'Profile',
    },
    {
        key: '/user/settings',
        label: 'Settings',
    },    {
        key: '/logout',
        label: 'Logout',
    },
];


const MKHeader = ({initInfo}: MKHeaderProps) => {
    const user_info = initInfo?.user_info;

    const isSessionActive = !(user_info == undefined || initInfo == null);

    console.log(`user_info${user_info} isSessionActive${isSessionActive}`)

    const navigate = useNavigate()
    return <Header style={headerStyle}>
        <Flex style={{justifyContent: 'end', width: '100%', alignItems: 'center', paddingRight: "10px", gap: "10px"}}>
            {isSessionActive ?
                <>

                    <Dropdown menu={{
                        items, onClick: // dont remove
                            (e) => {
                                const key = e.key
                                navigate(key)
                            }
                    }}>
                        <Flex justify="end" style={{
                            gap: "5px",
                            border: "1px solid white",
                            padding: "2px 10px 2px 10px",
                            borderRadius: "5px"
                        }}>
                            <UserOutlined style={{maxHeight: "100%", fontSize: "20px"}}/>
                            <Typography style={{color: '#fff', fontSize: '16px', alignItems: 'center'}}>
                                {JSON.stringify(initInfo?.user_info?.Id, null, 2)}
                            </Typography>
                        </Flex>
                    </Dropdown>
                </> :
                <Button style={{color:"white"}} type="primary" href={mkServerUrl + "/auth/google/login"}>Google Login</Button>}
        </Flex>
    </Header>
}

const Ping = async () => {
    const url = mkServerUrl + "/ping";
    try {
        const response = await fetch(url, {credentials: 'include'});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
    }
}


const LogoutC = async () => {
    const url = mkServerUrl + "/revoke_session";
    try {
        const response = await fetch(url, {method: "POST", credentials: 'include'});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
    }
}

function Logout(props: { logout: () => Promise<void> }) {
    useEffect(() => {
        props.logout();
    }, [props])
    return null;
}





function App() {
    const [initInfo, setInitInfo] = useState<Info | undefined>()
    useEffect(() => {
        (async () => {
            setInitInfo(await Ping())
        })();
    }, [])

    const logout = async () => {
        LogoutC()
        setInitInfo(await Ping())
    }

    return (
        <Layout style={layoutStyle}>
            <MKHeader initInfo={initInfo} logout={logout}></MKHeader>

            <Routes>
                <Route path="*" element={<MKContent initInfo={initInfo}></MKContent>}>
                    <Route index element={<Typography>INDEX</Typography>}/>
                    <Route path="settings" element={<Typography>SETTINGS</Typography>}/>

                    <Route path="user" element={<MKContent_User initInfo={initInfo}></MKContent_User>}>
                        <Route index element={<Typography>USERPROFILE (INDEX)</Typography>}/>
                        <Route path="profile" element={<Typography>USERPROFILE</Typography>}/>
                        <Route path="settings" element={<Typography>USERSETTINGS</Typography>}/>
                    </Route>
                    <Route path="logout" element={<Logout logout={logout} />}/>
                </Route>
            </Routes>
            <Footer />
        </Layout>
    )
}

export default App








