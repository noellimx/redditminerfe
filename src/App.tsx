import "./App.css";
import "@ant-design/v5-patch-for-react-19";
import "leaflet/dist/leaflet.css";

import { Header } from "./layouts/Header/Header.tsx";
import { Landing } from "./pages/Landing/Landing.tsx";
import { TaskPage } from "./pages/Task/Task.tsx";
import { StatisticsPage } from "./pages/Statistics/Statistics.tsx";
import { contentStyle } from "./styles/styles.ts";

import type { Info } from "./store";
import { Ping } from "./client/https.ts";

import { useEffect, useRef, useState } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router";
import { Layout } from "antd";

const { Content } = Layout;

const layoutStyle = {
  width: "100%",
  overflow: "hidden",
  height: "100vh",
};

interface ContentProps {
  initInfo?: Info;
  height: number;
}

const RMContent = ({ height }: ContentProps) => {
  return (
    <Content style={contentStyle(height)}>
      <Outlet />
    </Content>
  );
};

const serverUrl = import.meta.env.VITE_SERVER_URL;

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
    window.addEventListener("resize", calculateContentHeight);
    return () => window.removeEventListener("resize", calculateContentHeight);
  }, []);

  useEffect(() => {
    (async () => {
      setTimeout(async () => {
        setInitInfo(await Ping(serverUrl));
      }, 1000);
    })();
  }, [location.pathname]);

  if (!import.meta.env.VITE_SERVER_URL) {
    return <>{"Error Code S-0001. Please contact admin."}</>;
  }

  return (
    <Layout style={layoutStyle}>
      <Header initInfo={initInfo} ref={footerRef} />
      <Routes>
        <Route
          path="/"
          element={
            <RMContent height={contentHeight} initInfo={initInfo}></RMContent>
          }
        >
          <Route index element={<Landing initInfo={initInfo} />} />
          <Route
            path={"tasks"}
            element={<TaskPage serverUrl={serverUrl}></TaskPage>}
          />
          <Route
            path={"statistics"}
            element={<StatisticsPage serverUrl={serverUrl}></StatisticsPage>}
          />
        </Route>
        <Route path={"*"} element={<div>notfound</div>}></Route>
      </Routes>
    </Layout>
  );
}

export default App;
