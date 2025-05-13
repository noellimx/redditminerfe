import React from "react";
import {Colors} from "../../colors";
import {Footer as AntdFooter} from "antd/es/layout/layout";


const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    width: '100%',
    color: '#fff',
    backgroundColor: Colors.RED_5,
};


export const Footer = () => {
    return <AntdFooter style={footerStyle}>Footer</AntdFooter>;
}