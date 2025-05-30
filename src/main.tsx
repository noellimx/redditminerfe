import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import {ConfigProvider} from "antd";
import {Colors} from "./colors";
// import {ConfigProvider} from "antd";
// import {Colors} from "./colors";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <ConfigProvider
                theme={{
                    token: {
                        // Seed Token
                        colorPrimary: Colors.RED_7,
                        colorTextDescription: Colors.RED_3,
                        borderRadius: 2,
                        colorText: Colors.CHARBLACK,
            //
                        // Alias Token
                        colorBgContainer: '#ffccc7',
                        colorTextPlaceholder: Colors.GREY
                    },
                }}
            >
                <App/>
            </ConfigProvider>
        </BrowserRouter>
    </StrictMode>,
)
