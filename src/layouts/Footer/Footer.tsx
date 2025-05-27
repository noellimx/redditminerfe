import React from "react";
import {Colors} from "../../colors";
import {Footer as AntdFooter} from "antd/es/layout/layout";
import {Flex} from "antd";
import {GlobalOutlined, PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import type {Info} from "../../store";

import { Skeleton } from "antd";
const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    width: '100%',
    color: '#fff',
    backgroundColor: Colors.RED_5,
    padding: "10px 50px"
};


interface FooterProps {
    ref?: React.RefObject<HTMLDivElement | null>,
    initInfo?: Info | undefined
}

export const Footer = ({ref, initInfo}: FooterProps) => {
    const navigate = useNavigate()
    const to = (path: string) => () => navigate(path)

    return <AntdFooter ref={ref} style={footerStyle}><Flex
        style={{flexDirection: "row", justifyContent: "space-around"}}>
        {initInfo ?<>
            <GlobalOutlined onClick={to("/map")}
                            style={{backgroundColor: Colors.RED_8, borderRadius: "15px", padding: "10px"}}/>
            <PlusOutlined onClick={to("/edit/store_form")}
                          style={{backgroundColor: Colors.RED_8, borderRadius: "15px", padding: "10px"}}/>
        </>: <>
            <Skeleton.Button active={true} shape={"circle"}></Skeleton.Button>
            <Skeleton.Button active={true} shape={"circle"}></Skeleton.Button>
        </>}
    </Flex></AntdFooter>;
}