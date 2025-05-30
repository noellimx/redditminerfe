import {RedditRankChart} from "../../components/Chart/Chart.tsx";


import {Drawer, Flex, Spin, Typography} from "antd";
import type {Info} from "../../store";
import {Colors} from "../../colors";


interface LandingProps {
    initInfo?: Info | undefined
}

export function Landing({initInfo}: LandingProps) {
    let Content = <></>


    if (initInfo) {
        Content = <Flex style={{width:'100%', height:'100%', flexDirection:'column'}}>
            <Flex className={"dummyblock"}  style={{height : "100px", width: "100%", backgroundColor: Colors.RED_4}}>a</Flex>
            <Flex className={"reddit-rank-chart"}  style={{ width: "100%", flexGrow: 1}}><RedditRankChart/></Flex>

        </Flex>;
    } else {
        Content = <Flex style={{
            height: "100%",
            width: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Typography style={{fontSize: "30px"}}>
                📞 ㆍㆍㆍ 🖥
            </Typography>
            <Spin tip={"Connecting to Server..."} size="large"></Spin>
        </Flex>;
    }


    return <Flex style={{
        width: '100%',
        height: '100%',
    }}><Drawer></Drawer>
        {Content}
    </Flex>;
}