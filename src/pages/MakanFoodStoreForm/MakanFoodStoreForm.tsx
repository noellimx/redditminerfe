import type {Info} from "../../store";
import {
    Button, Card,
    Divider,
    Form, type FormProps,
    Input,
    Select, Space, Typography,
} from 'antd';
import {useEffect} from "react";
import {FileTextOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {FloatButton} from "antd";


type FormStoreProps = {
    initInfo?: Info
    children: React.ReactNode
}
type FieldForms = {
    foo?: string;
    bar?: string;
    asfd?: string;
};


export function StallFormComponent({initInfo}: FormStoreProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        // form.setFieldValue("address","rdda")
    }, [form])


    if (!initInfo || initInfo?.user_info == undefined) {
        return <a> Please login to use this page.</a>;
    }


    const onFinish: FormProps<FieldForms>['onFinish'] = (values) => {
        console.log(`valueessss ${JSON.stringify(values)}`);
        console.log(form.getFieldsValue());
    }

    return (
        <div className="mkmakanstore" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: "center",
            width: "100%",
            height: "fit-content",
            minHeight: "100%",
            alignItems: 'center'
        }}>
            <Form
                form={form}
                className="mk_store_form"
                // form={form}
                layout="vertical"
                initialValues={{size: "small"}}
                size={"small"}
                style={{width: "80%", display: "flex", justifyContent: "center", flexDirection: "column"}}
                onFinish={onFinish}
            >
                <Divider>Stall</Divider>
                <Form.Item label="Stall Name" name="outlet_name"
                           rules={[{required: true, message: "Please enter outlet name"}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="Stall Type" name="outlet_type">
                    <Select>
                        <Select.Option value="Hawker Center"> Hawker Center </Select.Option>
                        <Select.Option value="Kopitiam"> Kopitiam </Select.Option>
                        <Select.Option value="Food Court"> Food Court </Select.Option>
                        <Select.Option value="Restaurant"> Restaurant </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Product" name="product_name">
                    <Select>
                        <Select.Option value="Hokkien Mee"> Hokkien Mee </Select.Option>
                    </Select>
                </Form.Item>
                <Divider>Location</Divider>
                <Form.Item label="Address" name="address" rules={[{max: 6}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="Postal Code" name={"postal_code"} rules={[{
                    validator: (_, value) => {
                        if (value.length !== 6) {
                            return Promise.reject(new Error(`Invalid postal code`));
                        }
                        return Promise.resolve();
                    }, message: "Invalid 6-digit Postal Code"
                }]}>
                    <Input type="number"/>
                </Form.Item>


                <Divider>Links</Divider>

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
                                            name={[name, 'value']}
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
                    <Form.List name="media_links">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name, ...restField}) => (
                                    <Space.Compact className="form_item_media_links" key={key}
                                                   style={{gap: "10px", display: 'flex'}}>
                                        <Form.Item
                                            {...restField}

                                            className={"form_item_media_links_textarea"}
                                            name={[name, 'value']}
                                            rules={[{required: true, message: "please fill or remove empty link"}]}
                                            style={{flex: 1}}
                                        >
                                            <Input.TextArea placeholder=""/>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => {
                                            console.log(`removing ${name}`)
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
                        Submit aa
                    </FloatButton>
                </Form.Item>
            </Form>
        </div>
    );

}