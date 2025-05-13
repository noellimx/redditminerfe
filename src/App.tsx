import './App.css'
import '@ant-design/v5-patch-for-react-19';

import {Button, Layout, Space} from 'antd';
import {useEffect, useState, } from "react";

const {Header, Footer, Content} = Layout;


const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
    width: '100%',
    display: 'flex',
};

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    width: '100%',
    color: '#fff',
    backgroundColor: '#0958d9',
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    width: '100%',
    color: '#fff',
    backgroundColor: '#4096ff',
};

const layoutStyle = {
    width: '100%',
    overflow: 'hidden',
    height: '100vh',
};


const sampleInfo: Info = {"login_urls": {"google": "/auth/google/login"}, "user_info": {"Id": 0}};
type Info = {
    "login_urls": { [provider: string]: /*url*/string }
    "user_info": { Id: number } | null
}

interface MKContentProps {
    initInfo?: Info
}


const MKContent = ({initInfo}: MKContentProps) => {
    return <Content style={contentStyle}>
        <div>
            {initInfo && JSON.stringify(initInfo, null, 2)}
        </div>
    </Content>
}


interface MKHeaderProps {
    initInfo?: Info
    logout: () => void
}


const mkServerUrl = "http://localhost:8080"
const MKHeader = ({initInfo, logout}: MKHeaderProps) => {
    const user_info = initInfo?.user_info;

    const isSessionActive = !(user_info == undefined || initInfo == null);

    console.log(`user_info${user_info} isSessionActive${isSessionActive}`)
    return <Header style={headerStyle}>
        <Space>

            {isSessionActive ?<> {JSON.stringify(initInfo, null, 2)}<Button type="primary" onClick={logout}>Logout</Button> </> :
                <Button type="link" href={mkServerUrl + "/auth/google/login"}>Google Login</Button>}
        </Space>
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

const PingMustFailSession = () => {
    return {...sampleInfo, "user_info": null}
};

const Logout = async () => {
    const url = mkServerUrl + "/revoke_session";
    try {
        const response = await fetch(url, {method:"POST", credentials: 'include'});
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

function App() {
    const [initInfo, setInitInfo] = useState<Info | undefined>()
    useEffect(() => {
        (async () => {
            setInitInfo(await Ping())
        })();
    }, [])

    const logout = () => {
        Logout()
        setInitInfo(PingMustFailSession())
    }

    return (
        <Layout style={layoutStyle}>
            <MKHeader initInfo={initInfo} logout={logout}></MKHeader>
            <MKContent initInfo={initInfo}></MKContent>
            <Footer style={footerStyle}>Footer</Footer>
        </Layout>
    )
}

export default App
