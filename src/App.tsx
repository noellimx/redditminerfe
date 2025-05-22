import './App.css'
import '@ant-design/v5-patch-for-react-19';
import "leaflet/dist/leaflet.css";


import type {MenuProps} from 'antd';
import {Button, Dropdown, Flex, Layout, Typography} from 'antd';
import React, {useEffect, useState,} from "react";
import {UserOutlined} from "@ant-design/icons";
import {Outlet, Route, Routes, useLocation, useNavigate} from "react-router";
import {Footer} from "./layouts/Footer/Footer.tsx";
import {contentStyle, headerStyle} from "./styles/styles.ts";
import {MakanMap} from "./pages/MakanMap/MakanMap.tsx";
import type {Info} from "./store";
import {OutletFormComponent} from "./pages/MakanFoodStoreForm/MakanFoodStoreForm.tsx";
import {LogoutC, Ping} from "./client/https.ts";

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


// const mkServerUrl = "http://localhost:8080"
const mkServerUrl = import.meta.env.VITE_SERVER_URL

// console.log(`mkServerUrl ${mkServerUrl}`)


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

    const [loggingIn, setLoggingIn] = useState<boolean>(false)

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
                                {(initInfo?.user_info?.Gmails && initInfo?.user_info?.Gmails.length > 0) ? initInfo?.user_info?.Gmails[0] : JSON.stringify(initInfo?.user_info?.Id, null, 2)}
                            </Typography>
                        </Flex>
                    </Dropdown>
                </> :
                <Button onClick={() => {
                    setLoggingIn(true);
                }} style={{color: "white"}} type="primary"
                        href={mkServerUrl + "/auth/google/login"}>{loggingIn ? "Logging In..." : "Google Login"}</Button>}
        </Flex>
    </Header>
}


function Logout(props: { logout: () => Promise<void> }) {
    const {logout} = props;
    useEffect(() => {
        logout();
    }, [logout])
    return null;
}


function AuthCallbackComponent() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');

        if (sessionId) {
            // Store it (usually in localStorage or sessionStorage)
            localStorage.setItem('session_id', sessionId);

            // Redirect to your main app
            navigate('/');
        } else {
            // Handle error: no session ID found
            navigate('/');
        }
    }, [location, navigate]);

    return <></>;
}

function App() {

    const [initInfo, setInitInfo] = useState<Info | undefined>();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        (async () => {
            // setInitInfo(await Ping(mkServerUrl))
            // console.log("setting info")
            setInitInfo(await Ping(mkServerUrl))
        })();
    }, [location.pathname])

    if (!import.meta.env.VITE_SERVER_URL) {
        return <>{'Error Code S-0001. Please contact admin.'}</>
    }

    const logout = async () => {
        // console.log("logout")
        try {
            await LogoutC(mkServerUrl)
            localStorage.removeItem('session_id');
            // console.log(`logged out ${localStorage.getItem('session_id')}`)
            navigate("/")
        } catch (error) {
            const e = error as Error;
            console.error(e);
        }
    }

    console.log(`VITE_SERVER_URL=${import.meta.env.VITE_SERVER_URL}`);
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
                    <Route path="map" element={<MakanMap initInfo={initInfo}></MakanMap>}/>
                    <Route path="edit" element={<Outlet/>}>
                        <Route path="menu" element={<><a>EDIT MENU </a></>}/>
                        <Route path="store_form"
                               element={<OutletFormComponent initInfo={initInfo}>NEW FOOD STORE</OutletFormComponent>}/>
                    </Route>
                    <Route path="auth_callback" element={<AuthCallbackComponent/>}/>
                </Route>
            </Routes>
            <Footer/>
        </Layout>
    )
}

export default App








