import type {Info} from "../../store";
import {
    Button, Card,
    Form, type FormProps,
    Input, Modal,
    Select, Space, Typography,
    Divider, Flex,
} from 'antd';
import {useState} from "react";
import Fuse from 'fuse.js';

import {CloseSquareFilled, FileTextOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {FloatButton} from "antd";
import {AddOutlet, type NewOutletFieldForm, GetOutlet, type Outlet, UpdateOutlet} from "../../client/https.ts";
import {Colors} from "../../colors";

type FormStoreProps = {
    initInfo?: Info
    children: React.ReactNode
    outletId?: number
}


export function OutletFormComponent({initInfo}: FormStoreProps) {
    const [form] = Form.useForm();
    const [similarOutlets, setSimilarOutlets] = useState<Outlet[]>([]);
    const [fusedSimilarOutlets, setFusedSimilarOutlets] = useState<Outlet[]>([]);


    const [forExistingOutlet, setAsExistingOutlet] = useState(!!form.getFieldValue("id"));

    const outletForm = initInfo?.outlet_form;
    console.log(outletForm);

    const updateFused = (outlets: Outlet[]) => {
        const os = new Fuse(outlets, {
            findAllMatches: true,
            threshold: 1,
            includeScore: true,
            keys: ["name"]
        }).search(form.getFieldValue("name") || "").map(({item}) => item)
        if (os.length == 0) {
            setFusedSimilarOutlets(outlets)
        } else {
            setFusedSimilarOutlets(os)
        }
    }


    const focusOutlet = (outletId: number) => {
        console.log(`focusOutlet: ${outletId}`);
        if (outletId && initInfo) {
            GetOutlet(initInfo?.server_url, {"id": outletId.toString()}).then((outlets) => {
                if (outlets.length > 0) {
                    const outlet = outlets[0]

                    const reviewLinks = outlet.review_links.map(l => {
                        return ({"link": l.link, "platform": l.platform, "creator": l.creator})
                    })
                    form.setFieldValue(["review_links"], reviewLinks)
                    const officialLinks = outlet.official_links.map(l => {
                        return ({"link": l})
                    })
                    form.setFieldValue(["official_links"], officialLinks)
                    try {
                        const menu = outlet.menu.map(l => {
                            return (l.name)
                        })
                        form.setFieldsValue({"menu": menu})
                    } catch (e) {
                        console.error(e)
                    }

                    form.setFieldValue(["address"], outlet.address)
                    form.setFieldValue(["postal_code"], outlet.postal_code)

                    form.setFieldValue(["id"], outlet.id)
                    form.setFieldValue(["name"], outlet.name)

                    setAsExistingOutlet(true)
                } else {

                    throw new Error("very weird, cannot find outlet")
                }
            })
        }
    }


    if (!initInfo || initInfo?.user_info == undefined) {
        return <a> Please login to use this page.</a>;
    }

    const onFinish: FormProps<NewOutletFieldForm>['onFinish'] = async (values) => {
        console.log(`forExistingOutlet ${forExistingOutlet} valueessss ${JSON.stringify(values)}`);
        console.log(form.getFieldsValue());

        try {
            if (forExistingOutlet) {
                await UpdateOutlet(initInfo.server_url, {...form.getFieldsValue()});
            } else {
                const id = await AddOutlet(initInfo.server_url, form.getFieldsValue());
                form.resetFields();
                focusOutlet(id)
            }


            Modal.info({
                title: '',
                content: (
                    <div>
                        {forExistingOutlet ? "Edit Success" : "Create Success"}
                    </div>
                ),
                onOk() {
                },
            })
        } catch (e) {
            const ea = e as Error;
            Modal.error({
                title: '',
                content: (
                    <div>
                        {forExistingOutlet ? "Edit Error" : "Create Error "}
                        {ea.message}
                    </div>
                ),
                onOk() {
                },
            })
        }
        return;
    }

    return (
        <div className="mkmakanstore" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: "start",
            width: "100%",
            height: "fit-content",
            maxHeight: "100%",
            overflowY: "auto",
            alignItems: 'center',
            scrollbarGutter: "stable",
        }}>
            <Form
                form={form}
                className="mk_store_form"
                // form={form}
                layout="vertical"
                initialValues={{size: "small"}}
                size={"small"}
                style={{width: "90%", display: "flex", justifyContent: "center", flexDirection: "column"}}
                onFinish={onFinish}
                onFieldsChange={async (fields) => {

                    // similar outlets [begin]. only for new form
                    if (!forExistingOutlet) {
                        if (fields && fields[0]?.name[0] == "postal_code") {
                            let _similarOutlets: Outlet[] = []
                            // get outlets if postal code valid
                            if (fields[0].validated && fields[0].errors?.length == 0 && fields[0].value.length == 6) {
                                try {
                                    const postalCode = fields[0]?.value;
                                    _similarOutlets = await GetOutlet(initInfo?.server_url, {"postal_code": postalCode});
                                } catch (e) {
                                    const ea = e as Error;
                                    console.error(ea.message);
                                }
                            }
                            setSimilarOutlets(_similarOutlets);
                            updateFused(_similarOutlets);
                        }

                        if (fields && fields[0]?.name[0] == "name") {
                            updateFused(similarOutlets);
                        }
                    }
                }}
            >
                {forExistingOutlet ?
                    <Divider style={{textAlign: "left"}}> Editing Outlet {`${form.getFieldValue('id')}`}</Divider> :
                    <Divider>New Outlet</Divider>}
                <Form.Item label="Outlet Name" name="name"
                           rules={[{required: true, message: "Please enter outlet name"}]}>
                    <Input/>
                </Form.Item>
                <Form.Item hidden label="Outlet Type" name="outlet_type">
                    <Select>
                        <Select.Option value="Hawker Center"> Hawker Center </Select.Option>
                        <Select.Option value="Kopitiam"> Kopitiam </Select.Option>
                        <Select.Option value="Food Court"> Food Court </Select.Option>
                        <Select.Option value="Restaurant"> Restaurant </Select.Option>
                    </Select>
                </Form.Item>

                <Divider>Location</Divider>
                <Form.Item label="Address" name="address">
                    <Input/>
                </Form.Item>
                <Form.Item label="Postal Code" name={"postal_code"}
                           rules={[{
                               validator: (_, value) => {
                                   if (value.length !== 6) {
                                       return Promise.reject(new Error(`Invalid postal code`));
                                   }
                                   return Promise.resolve();
                               }, message: "Invalid 6-digit Postal Code"
                           }]}>
                    <Input type="number"/>
                </Form.Item>

                {fusedSimilarOutlets.length > 0 &&
                    <Card style={{borderRadius: "15px", position: "relative"}}>
                        <Button icon={<CloseSquareFilled style={{color: Colors.RED_5, fontSize: "20px"}}/>}  style={{border: 0, position: "absolute", top: 0, right: 0}}></Button>
                        <Typography style={{fontWeight: "bold", textAlign: "start"}}> There are similar outlets.
                            Click to edit existing outlet: </Typography>
                        <Flex style={{gap: "10px", flexDirection: "row"}}>
                            {
                                fusedSimilarOutlets.map(o => {
                                        return <Button type={"primary"}
                                                       style={{ "width": "fit-content"}}
                                                       onClick={() => {
                                                           focusOutlet(o.id)
                                                           setSimilarOutlets([])
                                                           setFusedSimilarOutlets([])
                                                       }} key={o.id}>{o.name}</Button>
                                    }
                                )
                            }
                        </Flex></Card>
                }
                <Divider>Menu</Divider>

                <Form.Item label="Menu" name="menu" rules={[{required: false, type: 'array'}]}>
                    <Select mode={"multiple"}>
                        {outletForm && outletForm.product_names.map(item => {
                            return <Select.Option value={item}> {item} </Select.Option>
                        })}
                    </Select>
                </Form.Item>

                <Divider>Content</Divider>

                <Card style={{backgroundColor: "white"}}>
                    <Typography>Official Links</Typography>
                    <Form.List name="official_links">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name, ...restField}) => (
                                    <Space.Compact className="form_item_official_links" key={key}
                                                   style={{gap: "10px", display: 'flex'}}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'link']}
                                            rules={[{required: true, message: "please fill or remove empty link"}]}
                                            style={{flex: 1}}
                                        >
                                            <Input.TextArea style={{overflow: "visible"}}/>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)}/>
                                    </Space.Compact>
                                ))}
                                <Form.Item>
                                    <Button shape="circle" style={{width: "min-content"}} type="dashed"
                                            onClick={() => add()} block icon={<PlusOutlined/>}/>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Card>

                <Card style={{backgroundColor: "white"}}>
                    <Typography>Media / Reviews </Typography>
                    <Form.List name="review_links">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name, ...restField}) => (
                                    <Space.Compact className="form_item_media_links" key={key}
                                                   style={{gap: "10px", display: 'flex', flexDirection: "row"}}>
                                        <Form.Item
                                            {...restField}
                                            className={"form_item_review_links_textarea"}
                                            name={[name, 'link']}
                                            rules={[{required: true, message: "please fill or remove empty link"}]}
                                            style={{flex: 1}}
                                        >
                                            <Input.TextArea placeholder="Link"/>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            className={"form_item_review_links_textarea"}
                                            name={[name, 'creator']}
                                            rules={[{required: true, message: "please fill or remove empty creator"}]}
                                            style={{flex: 1}}
                                        >
                                            <Select placeholder={"Plaform"}>
                                                {outletForm && outletForm?.platforms?.map(item => {
                                                    return <Select.Option value={item}> {item} </Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            className={"form_item_review_links_textarea"}
                                            name={[name, 'platform']}
                                            rules={[{required: true, message: "please fill or remove empty platform"}]}
                                            style={{flex: 1}}
                                        >
                                            <Select placeholder={"Creator"}>
                                                {outletForm && outletForm?.creators?.map(item => {
                                                    return <Select.Option value={item}> {item} </Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>

                                        {/*<Form.Item*/}
                                        {/*    {...restField}*/}
                                        {/*    className={"form_item_review_links_textarea"}*/}
                                        {/*    name={[name, 'source']}*/}
                                        {/*    rules={[{required: true, message: "please include source for link"}]}*/}
                                        {/*    style={{flex: 1}}*/}
                                        {/*>*/}
                                        {/*    <Select>*/}
                                        {/*        {outletForm && outletForm.sources && outletForm.sources.map(item => {*/}
                                        {/*            return <Select.Option value={item}> {item} </Select.Option>*/}
                                        {/*        })}*/}
                                        {/*    </Select>*/}
                                        {/*</Form.Item>*/}
                                        <MinusCircleOutlined onClick={() => {
                                            // console.log(`removing ${name}`)
                                            remove(name)
                                        }}/>
                                    </Space.Compact>
                                ))}
                                <Form.Item>
                                    <Button shape="circle" style={{width: "min-content"}} type="dashed"
                                            onClick={() => add()} block icon={<PlusOutlined/>}>
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Card>
                <Form.Item>
                    <FloatButton
                        icon={<FileTextOutlined/>}
                        description="Submit" type="primary" htmlType="submit"
                        shape="square"
                        style={{
                            insetInlineEnd: "20px",
                            bottom: "100px",
                            width: "60px",
                            height: "60px",
                            border: "1px solid red"
                        }}
                    >
                        Submit
                    </FloatButton>
                </Form.Item>

                <Form.Item hidden={true} name={"id"}/>
            </Form>
        </div>
    );

}