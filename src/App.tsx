import './App.css'
import '@ant-design/v5-patch-for-react-19';
import "leaflet/dist/leaflet.css";


import { Layout,} from 'antd';
import{useEffect, useRef, useState,} from "react";
import {Outlet, Route, Routes, useLocation, } from "react-router";
import {Header} from "./layouts/Header/Header.tsx";
import {contentStyle,} from "./styles/styles.ts";
import type {Info} from "./store";
import { Ping} from "./client/https.ts";
import {Landing} from "./pages/Landing/Landing.tsx";

const { Content} = Layout;


const layoutStyle = {
    width: '100%',
    overflow: 'hidden',
    height: '100vh',
};


interface MKContentProps {
    initInfo?: Info
    height: number
}


const MKContent = ({height}: MKContentProps) => {
    return <Content style={contentStyle(height)}>
        <Outlet/>
    </Content>
}



const mkServerUrl = import.meta.env.VITE_SERVER_URL


function App() {
    const [initInfo, setInitInfo] = useState<Info | undefined>();
    const location = useLocation();


    const footerRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        const calculateContentHeight = () => {
            const footerHeight = footerRef.current?.offsetHeight || 0;
            const totalHeight = window.innerHeight;
            setContentHeight(totalHeight - footerHeight);
        };

        calculateContentHeight();

        // Recalculate on window resize
        window.addEventListener('resize', calculateContentHeight);
        return () => window.removeEventListener('resize', calculateContentHeight);
    }, []);


    useEffect(() => {
        (async () => {
            setTimeout(async () => {
                setInitInfo(await Ping(mkServerUrl))
            }, 1000)
        })();
    }, [location.pathname])

    if (!import.meta.env.VITE_SERVER_URL) {
        return <>{'Error Code S-0001. Please contact admin.'}</>
    }



    console.log(`VITE_SERVER_URL=${import.meta.env.VITE_SERVER_URL}`);
    return (
        <Layout style={layoutStyle}>
            <Header initInfo={initInfo} ref={footerRef}/>
            <Routes>
                <Route path="*" element={<MKContent height={contentHeight} initInfo={initInfo}></MKContent>}>
                    <Route index element={<Landing initInfo={initInfo} />}/>
                </Route>
            </Routes>
        </Layout>
    )
}

export default App








