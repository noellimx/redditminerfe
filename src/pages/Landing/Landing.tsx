import type { Info } from "../../store";
import { type NewOutletFieldForm } from "../../client/https.ts";
import {
  FileTextOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Divider,
  Flex,
  FloatButton,
  Form,
  type FormProps,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import { useNavigate } from "react-router";

interface LandingProps {
  initInfo?: Info | undefined;
}

export function ConnectingToServer() {
  return (
    <Flex
      style={{
        height: "100%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography style={{ fontSize: "30px" }}>📞 ㆍㆍㆍ 🖥</Typography>
      <Spin tip={"Connecting to Server..."} size="large"></Spin>
    </Flex>
  );
}

export function Landing({ initInfo }: LandingProps) {
  const nav = useNavigate();
  let Content = <></>;

  if (initInfo) {
    Content = (
      <Flex
        style={{
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Flex
          style={{
            height: "fit-content",
            width: "75%",
            justifyContent: "space-evenly",
          }}
        >
          <Card title="Tasks" style={{ width: 320, height: "fit-content" }}>
            <Flex vertical gap="small">
              <Typography style={{ textAlign: "start" }}>
                💾 Tasks periodically mine reddit statistics.
              </Typography>
              <Typography style={{ textAlign: "start" }}>
                📈 Visualize time-series data sets here.
              </Typography>
              <Typography style={{ textAlign: "start" }}>
                🗂️ Generate and download reports.
              </Typography>
              <Button
                type={"primary"}
                onClick={() => {
                  nav("/tasks");
                }}
              >
                Explore Tasks
              </Button>
            </Flex>
          </Card>
          <Card
            title="Quick Search"
            style={{ width: 320, height: "fit-content" }}
          >
            <Typography> Try it out~ Mine a sample point. </Typography>
          </Card>
        </Flex>
      </Flex>
    );
  } else {
    Content = <ConnectingToServer />;
  }

  return (
    <Flex
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {Content}
    </Flex>
  );
}

export function TaskForm() {
  const [form] = Form.useForm();
  const onFinish: FormProps<NewOutletFieldForm>["onFinish"] = async () => {
    try {
      Modal.info({
        title: "",
        content: (
          <div>{/*{isExistingTask ? "Edit Success" : "Create Success"}*/}</div>
        ),
        onOk() {},
      });
    } catch (e) {
      const ea = e as Error;
      Modal.error({
        title: "",
        content: (
          <div>
            {/*{isExistingTask ? "Edit Error" : "Create Error "}*/}
            {ea.message}
          </div>
        ),
        onOk() {},
      });
    }
    return;
  };

  return (
    <div
      className="mkmakanstore"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        width: "100%",
        height: "fit-content",
        maxHeight: "100%",
        overflowY: "auto",
        alignItems: "center",
        scrollbarGutter: "stable",
      }}
    >
      <Form
        form={form}
        className="mk_store_form"
        // form={form}
        layout="vertical"
        initialValues={{ size: "small" }}
        size={"small"}
        style={{
          width: "90%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
        onFinish={onFinish}
        onFieldsChange={async () => {}}
      >
        {
          <Divider style={{ textAlign: "left" }}>
            {" "}
            Editing Outlet {`${form.getFieldValue("id")}`}
          </Divider>
        }
        <Form.Item
          label="Outlet Name"
          name="name"
          rules={[{ required: true, message: "Please enter outlet name" }]}
        >
          <Input />
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
          <Input />
        </Form.Item>
        <Form.Item
          label="Postal Code"
          name={"postal_code"}
          rules={[
            {
              validator: (_, value) => {
                if (value.length !== 6) {
                  return Promise.reject(new Error(`Invalid postal code`));
                }
                return Promise.resolve();
              },
              message: "Invalid 6-digit Postal Code",
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>

        <Divider>Menu</Divider>

        <Form.Item
          label="Menu"
          name="menu"
          rules={[{ required: false, type: "array" }]}
        >
          <Select mode={"multiple"}>
            {/*{outletForm && outletForm.product_names.map(item => {*/}
            {/*    return <Select.Option value={item}> {item} </Select.Option>*/}
            {/*})}*/}
          </Select>
        </Form.Item>

        <Divider>Content</Divider>

        <Card style={{ backgroundColor: "white" }}>
          <Typography>Official Links</Typography>
          <Form.List name="official_links">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space.Compact
                    className="form_item_official_links"
                    key={key}
                    style={{ gap: "10px", display: "flex" }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "link"]}
                      rules={[
                        {
                          required: true,
                          message: "please fill or remove empty link",
                        },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <Input.TextArea style={{ overflow: "visible" }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space.Compact>
                ))}
                <Form.Item>
                  <Button
                    shape="circle"
                    style={{ width: "min-content" }}
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Card style={{ backgroundColor: "white" }}>
          <Typography>Media / Reviews </Typography>
          <Form.List name="review_links">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space.Compact
                    className="form_item_media_links"
                    key={key}
                    style={{
                      gap: "10px",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Form.Item
                      {...restField}
                      className={"form_item_review_links_textarea"}
                      name={[name, "link"]}
                      rules={[
                        {
                          required: true,
                          message: "please fill or remove empty link",
                        },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <Input.TextArea placeholder="Link" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      className={"form_item_review_links_textarea"}
                      name={[name, "creator"]}
                      rules={[
                        {
                          required: true,
                          message: "please fill or remove empty creator",
                        },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <Select placeholder={"Plaform"}>{/*2*!/*/}</Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      className={"form_item_review_links_textarea"}
                      name={[name, "platform"]}
                      rules={[
                        {
                          required: true,
                          message: "please fill or remove empty platform",
                        },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <Select placeholder={"Creator"}>
                        {/*{outletForm && outletForm?.creators?.map(item => {*/}
                        {/*    return <Select.Option value={item}> {item} </Select.Option>*/}
                        {/*})}*/}
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
                    <MinusCircleOutlined
                      onClick={() => {
                        // console.log(`removing ${name}`)
                        remove(name);
                      }}
                    />
                  </Space.Compact>
                ))}
                <Form.Item>
                  <Button
                    shape="circle"
                    style={{ width: "min-content" }}
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  ></Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>
        <Form.Item>
          <FloatButton
            icon={<FileTextOutlined />}
            description="Submit"
            type="primary"
            htmlType="submit"
            shape="square"
            style={{
              insetInlineEnd: "20px",
              bottom: "100px",
              width: "60px",
              height: "60px",
              border: "1px solid red",
            }}
          >
            Submit
          </FloatButton>
        </Form.Item>

        <Form.Item hidden={true} name={"id"} />
      </Form>
    </div>
  );
}
