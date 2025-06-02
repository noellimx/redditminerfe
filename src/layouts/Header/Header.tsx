import React from "react";
import {Colors} from "../../colors";
import {Header as AntdHeader} from "antd/es/layout/layout";
import {Button, Flex, Typography} from "antd";
import type {Info} from "../../store";
import {useNavigate, useNavigation} from "react-router";
import {HomeOutlined} from "@ant-design/icons";

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    width: '100%',
    color: '#fff',
    background: `linear-gradient(90deg,`+Colors.RED_5+`,`+Colors.RED_6+`,`+Colors.RED_7 + `)`,
    borderBottom: `1px solid ${Colors.CHARBLACK}`,
    padding: "10px 0px",
    display: "flex",
};


interface HeaderProps {
    ref?: React.RefObject<HTMLDivElement | null>,
    initInfo?: Info | undefined
}

export const Header = ({ref, initInfo}: HeaderProps) => {
    const nav = useNavigate();
    return <AntdHeader ref={ref} style={headerStyle}>
        <Flex
        className={"flex-header-container-123"}
        style={{flexDirection: "row",position:"relative", width: "100%", justifyContent: "end", alignItems: "center"}}>
        <Flex style={{position:"absolute",height: "100%", alignItems:"center", top: 0, left: 10}}><Typography.Title >Reddit Trend Dashboard</Typography.Title></Flex>
        <HomeOutlined style={{fontSize: 30, marginRight: 10}} onClick={()=> nav("/")}></HomeOutlined>
    </Flex></AntdHeader>;
}