import { useCallback, useEffect, useState } from "react";
import {
  AddTask,
  currentDayWindow,
  DeleteTask,
  GetTasks,
  type TaskGet,
} from "../../client/https.ts";
import {
  Alert,
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  type TableColumnsType,
  Typography,
} from "antd";
import { useNavigate } from "react-router";

interface TaskPageProps {
  serverUrl: string;
}

class CreateFormFieldParams {
  interval?: "hour";
  order_by?: "top" | "best" | "hot" | "new";
  posts_created_within_past?: "hour" | "day" | "month" | "year";
  subreddit_name?: string;
}

export function TaskPage({ serverUrl }: TaskPageProps) {
  const [tasks, setTasks] = useState<TaskGet[]>([]);

  const [searchForm] = Form.useForm();
  const [createForm] = Form.useForm<CreateFormFieldParams>();

  const [isCreateFormModalOpen, setisCreateFormModalOpen] = useState(false);

  const [createFormSubmitMessage, setCreateFormSubmitMessage] = useState<{
    error?: string;
  }>();

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
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Subreddit Name",
      dataIndex: "subreddit_name",
      key: "subreddit_name",
    },
    { title: "Order By", dataIndex: "order_by", key: "order_by" },
    {
      title: "Posts Age (t)",
      dataIndex: "posts_created_within_past",
      key: "posts_created_within_past",
    },
    { title: "Resolution", dataIndex: "interval", key: "interval" },
    {
      title: "Actions",
      dataIndex: "",
      key: "x",
      render: (a: TaskGet) => {
        console.log("x", a);
        const { toTime, fromTime } = currentDayWindow();
        return (
          <Space style={{ gap: 10 }}>
            <Button
              type="primary"
              onClick={() => {
                nav(
                  `/statistics?backfill=true&subreddit_name=${a.subreddit_name}&order_by=${a.order_by}&posts_created_within_past=${a.posts_created_within_past}&from_time=${fromTime}&to_time=${toTime}`,
                );
              }}
            >
              View Graph / Generate Reports
            </Button>
            <Button
              onClick={async () => {
                await DeleteTask(serverUrl, { id: a.id });
                refreshTasks();
              }}
              type="primary"
            >
              Remove
            </Button>
          </Space>
        );
      },
    },
  ];

  const refreshTasks = useCallback(async () => {
    const tasks = await GetTasks(serverUrl);
    console.log(tasks);
    setTasks(tasks);
  }, [serverUrl]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const timeOptions = ["hour", "day", "week", "month", "year"];
  return (
    <Flex
      className={"task-page-container"}
      style={{
        marginTop: 40,
        gap: 20,
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Flex style={{ width: "90%" }}>
        <Typography.Title style={{ textAlign: "start" }}>
          Tasks
        </Typography.Title>
      </Flex>
      <Flex
        className={"task-page-search-pane"}
        style={{
          height: "fit-content",
          justifyContent: "center",
          flexDirection: "row",
          width: "90%",
          padding: "10px 0",
        }}
      >
        <Form
          layout={"inline"}
          form={searchForm}
          onValuesChange={() => {}}
          style={{ maxWidth: "none", rowGap: "10px" }}
        >
          <Form.Item label="Subreddit Name" name="subreddit_name">
            <Input placeholder={""}></Input>
          </Form.Item>
          <Form.Item label="Order By" name="order_by">
            <Select placeholder="         " style={{ width: "100px" }}>
              {["top", "hot", "best", "new"].map((v) => {
                return <Select.Option value={v}>{v}</Select.Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Posts Age (t)" name="posts_created_within_past">
            <Select placeholder="         " style={{ width: "100px" }}>
              {timeOptions.map((v) => {
                return <Select.Option value={v}>{v}</Select.Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Resolution" name="interval">
            <Select placeholder="         " style={{ width: "100px" }}>
              {["hour"].map((v) => {
                return <Select.Option value={v}>{v}</Select.Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>

          <Button type="primary" onClick={showCreateFormModal}>
            Create Task
          </Button>
          <Modal
            title="Create Task"
            closable={{ "aria-label": "Custom Close Button" }}
            open={isCreateFormModalOpen}
            onCancel={handleCancel}
            footer={(_, { CancelBtn }) => {
              return (
                <>
                  <Button
                    onClick={async () => {
                      console.log("form ", createForm.getFieldsValue());
                      const form = createForm.getFieldsValue();
                      const {
                        interval,
                        order_by,
                        posts_created_within_past,
                        subreddit_name,
                      } = form;

                      if (
                        !interval ||
                        !order_by ||
                        !posts_created_within_past ||
                        !subreddit_name
                      ) {
                        const alertMsg = {
                          error:
                            "Request aborted. Some required fields are empty.",
                        };
                        setCreateFormSubmitMessage(alertMsg);
                        return;
                      }
                      setCreateFormSubmitMessage({});

                      try {
                        await AddTask(serverUrl, {
                          ...form,
                          min_item_count: 20,
                        });
                        closeCreateForm();
                        await refreshTasks();

                        const instance = createSuccessModal.success({
                          content: `Task Created!`,
                        });

                        setTimeout(() => {
                          instance.destroy();
                        }, 2000);
                      } catch (e) {
                        const err = e as Error;
                        const alertMsg = { error: err.message };
                        setCreateFormSubmitMessage(alertMsg);
                        return;
                      }
                    }}
                  >
                    Create
                  </Button>
                  <CancelBtn />
                </>
              );
            }}
          >
            <Form
              className={"modal-create-form"}
              layout={"horizontal"}
              form={createForm}
              style={{ maxWidth: "none" }}
              labelWrap={false}
            >
              <Form.Item
                labelCol={{ style: { width: 140 } }}
                label="Subreddit Name"
                name="subreddit_name"
                required={true}
              >
                <Input placeholder={""}></Input>
              </Form.Item>
              <Form.Item
                labelCol={{ style: { width: 140 } }}
                label="Order By"
                name="order_by"
                required={true}
              >
                <Select placeholder="         " style={{ width: "100px" }}>
                  {["top", "hot", "best", "new"].map((v) => {
                    return <Select.Option value={v}>{v}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                labelCol={{ style: { width: 140 } }}
                label="Posts Age (t)"
                name="posts_created_within_past"
                required={true}
              >
                <Select placeholder="         " style={{ width: "100px" }}>
                  {timeOptions.map((v) => {
                    return <Select.Option value={v}>{v}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                labelCol={{ style: { width: 140 } }}
                label="Resolution"
                name="interval"
                initialValue={"hour"}
                required={true}
              >
                <Select
                  disabled={true}
                  placeholder="         "
                  style={{ width: "100px" }}
                >
                  {["hour"].map((v) => {
                    return <Select.Option value={v}>{v}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
            </Form>
            {createFormSubmitMessage?.error && (
              <Alert message={createFormSubmitMessage?.error} type="error" />
            )}
          </Modal>
        </Form>
      </Flex>
      <Table<TaskGet>
        style={{ width: "90%" }}
        dataSource={tasks}
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
      />
      {createSuccessContextHolder}
    </Flex>
  );
}
