import './App.css'
import '@ant-design/v5-patch-for-react-19';
import "leaflet/dist/leaflet.css";


import type {MenuProps} from 'antd';
import {Button, Dropdown, Flex, Layout, Typography} from 'antd';
import React, {useEffect, useState,} from "react";
import {UserOutlined} from "@ant-design/icons";
import {Outlet, Route, Routes, useNavigate} from "react-router";
import {Footer} from "./layouts/Footer/Footer.tsx";
import {contentStyle, headerStyle} from "./styles/styles.ts";
import {MakanMap} from "./pages/MakanMap/MakanMap.tsx";
import type {Info} from "./store";
import {StallFormComponent} from "./pages/MakanFoodStoreForm/MakanFoodStoreForm.tsx";

const {Header, Content} = Layout;


const layoutStyle = {
    width: '100%',
    overflow: 'hidden',
    height: '100vh',
};



interface MKContentProps {
    initInfo?: Info
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MKContent = (_: MKContentProps) => {
    return <Content style={contentStyle}>
        <Outlet/>
    </Content>
}

interface MKContent_UserProps {
    initInfo?: Info
}

const MKContent_User: React.FC<MKContent_UserProps> = () => {
    return <Content style={contentStyle}>
        <Outlet/>
    </Content>
}


interface MKHeaderProps {
    initInfo?: Info
    logout: () => void
}


const mkServerUrl = "http://localhost:8080"

const items: MenuProps['items'] = [
    {
        key: '/user',
        label: 'Profile',
    },
    {
        key: '/user/settings',
        label: 'Settings',
    }, {
        key: '/logout',
        label: 'Logout',
    },
];


const MKHeader = ({initInfo}: MKHeaderProps) => {
    const user_info = initInfo?.user_info;

    const isSessionActive = !(user_info == undefined || initInfo == null);

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
                <Button style={{color: "white"}} type="primary" href={mkServerUrl + "/auth/google/login"}>Google
                    Login</Button>}
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

        return await response.json(); // todo: need await??
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

        return await response.json(); // todo: need await??
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
                    <Route path="logout" element={<Logout logout={logout}/>}/>
                    <Route path="map" element={<MakanMap></MakanMap>}/>
                    <Route path="edit" element={<Outlet/>}>
                        <Route path="menu" element={<><a>EDIT MENU </a></>}/>
                        <Route path="store_form" element={<StallFormComponent initInfo={initInfo}>NEW FOOD STORE</StallFormComponent>}/>
                    </Route>
                </Route>
            </Routes>
            <Footer/>
        </Layout>
    )
}

export default App








