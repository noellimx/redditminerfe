import './App.css'
import '@ant-design/v5-patch-for-react-19';
import "leaflet/dist/leaflet.css";


import {
    Alert,
    Button,
    Flex,
    Form,
    Input,
    Layout,
    Modal,
    Radio,
    Select, Space,
    Table,
    type TableColumnsType,
    Typography,
} from 'antd';
import {ReactNode, useCallback, useEffect, useRef, useState,} from "react";
import {Outlet, Route, Routes, useLocation, useNavigate, useSearchParams,} from "react-router";
import {Header} from "./layouts/Header/Header.tsx";
import {contentStyle,} from "./styles/styles.ts";
import type {Info} from "./store";
import {AddTask, currentDayWindow, DeleteTask, GetTasks, Ping, type TaskGet} from "./client/https.ts";
import {Landing} from "./pages/Landing/Landing.tsx";
import {Colors} from "./colors";
import {StatisticsPage} from "./pages/Statistics/statistics.tsx";

const {Content} = Layout;


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


interface TaskPageProps {
    mkServerUrl: string;
}


class CreateFormFieldParams {
    interval?: "hour";
    order_by?: "top" | "best" | "hot" | "new";
    posts_created_within_past?: "hour" | "day" | "month" | "year";
    subreddit_name?: string
}

function TaskPage({mkServerUrl}: TaskPageProps) {
    const [tasks, setTasks] = useState<TaskGet[]>([]);

    const [searchForm] = Form.useForm();
    const [createForm] = Form.useForm<CreateFormFieldParams>();

    const [isCreateFormModalOpen, setisCreateFormModalOpen] = useState(false);

    const [createFormSubmitMessage, setCreateFormSubmitMessage] = useState<{ error?: string }>();

    const [createSuccessModal, createSuccessContextHolder] = Modal.useModal();

    const nav = useNavigate();

    const showCreateFormModal = () => {
        setisCreateFormModalOpen(true);
    };

    const closeCreateForm = () => {
        setisCreateFormModalOpen(false);
    };


    const handleCancel = () => {
        setisCreateFormModalOpen(false);
    };

    const columns: TableColumnsType<TaskGet> = [
        {title: 'ID', dataIndex: 'id', key: 'id'},
        {title: 'Subreddit Name', dataIndex: 'subreddit_name', key: 'subreddit_name'},
        {title: 'Order By', dataIndex: 'order_by', key: 'order_by'},
        {title: 'Posts Age (t)', dataIndex: 'posts_created_within_past', key: 'posts_created_within_past'},
        {title: 'Resolution', dataIndex: 'interval', key: 'interval'},
        {
            title: 'Actions',
            dataIndex: '',
            key: 'x',
            render: (a: TaskGet) => {
                console.log('x', a);
                const {toTime, fromTime} = currentDayWindow()
                return <Space style={{gap: 10}}>
                    <Button type="primary" onClick={() => {
                        nav(`/statistics?backfill=true&subreddit_name=${a.subreddit_name}&order_by=${a.order_by}&posts_created_within_past=${a.posts_created_within_past}&from_time=${fromTime}&to_time=${toTime}`);
                    }}>View Graph / Generate Reports</Button>
                    <Button onClick={async () => {
                        await DeleteTask(mkServerUrl, {id :a.id})
                        refreshTasks()
                    }} type="primary">Remove</Button>
                </Space>
            },
        },
    ];

    const refreshTasks = useCallback(async () => {
        const tasks = await GetTasks(mkServerUrl);
        console.log(tasks);
        setTasks(tasks);
    }, [mkServerUrl]);


    useEffect(() => {
        refreshTasks();
    }, [refreshTasks])


    return <Flex className={"task-page-container"}
                 style={{
                     marginTop: 40,
                     gap: 20,
                     height: "100%",
                     flexDirection: "column",
                     alignItems: "center",
                     width: "100%"
                 }}>
        <Flex style={{width: '90%'}}>
            <Typography.Title style={{textAlign: "start"}}>Tasks</Typography.Title>
        </Flex>
        <Flex className={"task-page-search-pane"}
              style={{
                  height: "fit-content",
                  justifyContent: "center",
                  flexDirection: "row",
                  width: "90%",
                  padding: "10px 0",
              }}>
            <Form
                layout={'inline'}
                form={searchForm}
                onValuesChange={() => {
                }}
                style={{maxWidth: 'none', rowGap: "10px"}}
            >
                <Form.Item label="Subreddit Name" name="subreddit_name">
                    <Input placeholder={""}></Input>
                </Form.Item>
                <Form.Item label="Order By" name="order_by">
                    <Select placeholder="         " style={{width: "100px"}}>
                        {["top", "hot", "best", "new"].map((v) => {
                            return <Select.Option value={v}>{v}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="Posts Age (t)" name="posts_created_within_past">
                    <Select placeholder="         " style={{width: "100px"}}>
                        {["day", "hour", "month", "year"].map((v) => {
                            return <Select.Option value={v}>{v}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="Resolution" name="interval">
                    <Select placeholder="         " style={{width: "100px"}}>
                        {["hour"].map((v) => {
                            return <Select.Option value={v}>{v}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">Search</Button>
                </Form.Item>


                <Button type="primary" onClick={showCreateFormModal}>
                    Create Task
                </Button>
                <Modal
                    title="Create Task"
                    closable={{'aria-label': 'Custom Close Button'}}
                    open={isCreateFormModalOpen}
                    onCancel={handleCancel}
                    footer={(_, {CancelBtn}) => {
                        return <>
                            <Button onClick={async () => {
                                console.log("form ", createForm.getFieldsValue())
                                const form = createForm.getFieldsValue();
                                const {
                                    interval,
                                    order_by,
                                    posts_created_within_past,
                                    subreddit_name
                                } = form

                                if (!interval || !order_by || !posts_created_within_past || !subreddit_name) {
                                    const alertMsg = {error: "Request aborted. Some required fields are empty."}
                                    setCreateFormSubmitMessage(alertMsg)
                                    return
                                }
                                setCreateFormSubmitMessage({})

                                try {
                                    await AddTask(mkServerUrl, {...form, min_item_count: 20})
                                    closeCreateForm()
                                    refreshTasks()

                                    const instance = createSuccessModal.success({
                                        content: `Task Created!`,
                                    });

                                    setTimeout(() => {
                                        instance.destroy();

                                    }, 2000);
                                } catch (e) {
                                    const err = e as Error;
                                    const alertMsg = {error: err.message}
                                    setCreateFormSubmitMessage(alertMsg)
                                    return
                                }


                            }}>Create</Button>
                            <CancelBtn/></>
                    }}
                >

                    <Form
                        className={"modal-create-form"}
                        layout={'horizontal'}
                        form={createForm}
                        style={{maxWidth: 'none'}}
                        labelWrap={false}
                    >
                        <Form.Item labelCol={{style: {width: 140}}} label="Subreddit Name" name="subreddit_name"
                                   required={true}>
                            <Input placeholder={""}></Input>
                        </Form.Item>
                        <Form.Item labelCol={{style: {width: 140}}} label="Order By" name="order_by" required={true}>
                            <Select placeholder="         " style={{width: "100px"}}>
                                {["top", "hot", "best", "new"].map((v) => {
                                    return <Select.Option value={v}>{v}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item labelCol={{style: {width: 140}}} label="Posts Age (t)"
                                   name="posts_created_within_past"
                                   required={true}>
                            <Select placeholder="         " style={{width: "100px"}}>
                                {["hour", "day", "month", "year"].map((v) => {
                                    return <Select.Option value={v}>{v}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item labelCol={{style: {width: 140}}} label="Resolution" name="interval"
                                   initialValue={"hour"}
                                   required={true}>
                            <Select disabled={true} placeholder="         " style={{width: "100px"}}>
                                {["hour"].map((v) => {
                                    return <Select.Option value={v}>{v}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>


                    </Form>
                    {createFormSubmitMessage?.error && <Alert message={createFormSubmitMessage?.error} type="error"/>}
                </Modal>
            </Form>

        </Flex>
        <Table<TaskGet>
            style={{width: "90%"}}
            dataSource={tasks}
            columns={columns}
            pagination={{hideOnSinglePage: true}}
        />
        {createSuccessContextHolder}
    </Flex>;
}



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
                <Route path="/" element={<MKContent height={contentHeight} initInfo={initInfo}></MKContent>}>
                    <Route index element={<Landing initInfo={initInfo}/>}/>
                    <Route path={"tasks"} element={<TaskPage mkServerUrl={mkServerUrl}></TaskPage>}/>
                    <Route path={"statistics"} element={<StatisticsPage mkServerUrl={mkServerUrl}></StatisticsPage>}/>
                </Route>
                <Route path={"*"} element={<div>notfound</div>  }></Route>
            </Routes>
        </Layout>
    )
}

export default App








