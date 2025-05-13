import React from "react";
import {Colors} from "../../colors";
import {Footer as AntdFooter} from "antd/es/layout/layout";
import {Flex} from "antd";
import {GlobalOutlined, LineOutlined, PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";


const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    width: '100%',
    color: '#fff',
    backgroundColor: Colors.RED_5,
    padding: "10px 50px"
};


export const Footer = () => {
    const navigate = useNavigate()
    return <AntdFooter style={footerStyle}><Flex style={{flexDirection: "row", justifyContent: "space-between"}}>
        <GlobalOutlined onClick={() => navigate("/map")}
                        style={{backgroundColor: Colors.RED_8, borderRadius: "15px", padding: "10px"}}/>
        <PlusOutlined style={{backgroundColor: Colors.RED_8, borderRadius: "15px", padding: "10px"}}/>
        <LineOutlined/>
        <LineOutlined/>
    </Flex></AntdFooter>;
}