import React from "react";
import {Colors} from "../../colors";
import {Header as AntdHeader} from "antd/es/layout/layout";
import {Flex} from "antd";
import type {Info} from "../../store";

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

    return <AntdHeader ref={ref} style={headerStyle}><Flex
        className={"flex-header-container-123"}
        style={{flexDirection: "row", width: "100%", justifyContent: "space-around"}}>
        {initInfo ?<>
            {/*<GlobalOutlined onClick={to("/map")}*/}
            {/*                style={{backgroundColor: Colors.RED_8, borderRadius: "15px", padding: "10px"}}/>*/}
            {/*<PlusOutlined onClick={to("/edit/store_form")}*/}
            {/*              style={{backgroundColor: Colors.RED_8, borderRadius: "15px", padding: "10px"}}/>*/}
        </>: <>
            {/*<Skeleton.Button active={true} shape={"circle"}></Skeleton.Button>*/}
            {/*<Skeleton.Button active={true} shape={"circle"}></Skeleton.Button>*/}
        </>}
    </Flex></AntdHeader>;
}