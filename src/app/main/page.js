"use client";

import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Select, Space } from "antd";
import { InputNumber } from "antd";
import { DatePicker } from "antd";
import { ConfigProvider } from "antd";
import { v4 as uuidv4 } from "uuid";
import {
  DownloadOutlined,
  DeleteOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Table } from "antd";
import * as XLSX from "xlsx";
import locale from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function Main() {
  const [excelList, setExcelList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [form] = Form.useForm();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const tableColumns = [
    {
      title: "项目医院",
      dataIndex: "location",
      key: "location",
      width: 150,
    },
    {
      title: "项目类型",
      dataIndex: "projectType",
      key: "projectType",
      width: 150,
    },
    {
      title: "费用类型",
      dataIndex: "billType",
      key: "billType",
      width: 150,
    },
    {
      title: "事由类型",
      dataIndex: "eventType",
      key: "eventType",
      width: 150,
    },
    {
      title: "具体事由",
      dataIndex: "eventDetail",
      key: "eventDetail",
      width: 150,
    },
    {
      title: "行程明细",
      dataIndex: "tripDetail",
      key: "tripDetail",
      width: 150,
    },
    {
      title: "出差人",
      dataIndex: "tripPerson",
      key: "tripPerson",
      width: 150,
    },

    {
      title: "金额",
      dataIndex: "money",
      key: "money",
      width: 150,
    },

    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      width: 150,
    },

    {
      title: "结束时间",
      dataIndex: "endTime",
      key: "endTime",
      width: 150,
    },

    {
      title: "出差",
      dataIndex: "todo1",
      key: "todo1",
      width: 150,
    },

    {
      title: "发票详情",
      dataIndex: "todo2",
      key: "todo2",
      width: 150,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: 200,
      align: "center",
      render: (text, record) => {
        return (
          <Button
            type="primary"
            danger
            onClick={() => handleTableDelete(record)}
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    const columns = [
      "ID",
      "项目医院",
      "项目类型",
      "费用类型",
      "事由类型",
      "具体事由",
      "行程明细",
      "出差人",
      "金额",
      "起始时间",
      "终止时间",
      "出差",
      "发票详情",
    ];
    setExcelList([[...columns]]);
    //追加元素
    if (tableList.length > 0) {
      const valuesArray = tableList.map(item => Object.values(item));
      setExcelList(item => [...item, ...valuesArray]);
    }
  }, [tableList]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //表单删除方法
  const handleTableDelete = (record) => {
    const newTableList = tableList.filter((item) => item.key != record.key);
    setTableList(newTableList);
  };

  //下载为excel
  const download = () => {
    let today = new Date();
    // 将数据转换为工作表（Workbook）
    const worksheet = XLSX.utils.aoa_to_sheet(excelList);
    // 创建一个新的工作簿（Workbook）
    const workbook = XLSX.utils.book_new();
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // 导出为Excel文件
    XLSX.writeFile(workbook, `报销报表-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}.xlsx`);
  };

  //表单验证成功回调
  const onFinish = (values) => {
    const [startTime, endTime] = values.tripDate;
    const tableDataItem = {
      key: tableList.length + 1,
      location: values.location,
      projectType: values.projectType,
      billType: values.billType,
      eventType: values.eventType,
      eventDetail: values.eventDetail,
      tripDetail: values.tripDetail,
      tripPerson: values.tripPerson,
      money: values.money,
      startTime: dayjs(startTime).format("YYYY-MM-DD"),
      endTime: dayjs(endTime).format("YYYY-MM-DD"),
      todo1: values.todo1,
      todo2: values.todo2,
    };
    setTableList((item) => [...item, tableDataItem]);
    //清空表单
    form.resetFields();
  };

  //表单验证失败回调
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <>
      <div className="container flex">
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="项目医院"
            name="location"
            rules={[
              {
                required: true,
                message: "请输入项目医院（名称）",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="项目类型"
            name="projectType"
            rules={[
              {
                required: true,
                message: "请选择项目类型",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              onChange={handleChange}
              options={[
                {
                  value: "出差",
                  label: "出差",
                },
                {
                  value: "同城",
                  label: "同城",
                },
                {
                  value: "办公费用",
                  label: "办公费用",
                },
                {
                  value: "其他",
                  label: "其他",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="费用类型"
            name="billType"
            rules={[
              {
                required: true,
                message: "请选择费用类型",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              onChange={handleChange}
              options={[
                {
                  value: "高铁",
                  label: "高铁",
                },
                {
                  value: "打车",
                  label: "打车",
                },
                {
                  value: "住宿",
                  label: "住宿",
                },
                {
                  value: "物资购买",
                  label: "物资购买",
                },
                {
                  value: "设备购买",
                  label: "设备购买",
                },
                {
                  value: "货物运送",
                  label: "货物运送",
                },
                {
                  value: "聚会",
                  label: "聚会",
                },
                {
                  value: "快递",
                  label: "快递",
                },
                {
                  value: "出差补助",
                  label: "出差补助",
                },

                {
                  value: "其他",
                  label: "其他",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="事由类型"
            name="eventType"
            rules={[
              {
                required: true,
                message: "请选择事由类型",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              onChange={handleChange}
              options={[
                {
                  value: "新项目调研",
                  label: "新项目调研",
                },
                {
                  value: "项目上线",
                  label: "项目上线",
                },
                {
                  value: "日常运维",
                  label: "日常运维",
                },
                {
                  value: "其他",
                  label: "其他",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="具体事由"
            name="eventDetail"
            rules={[
              {
                required: true,
                message: "请输入具体事由",
              },
            ]}
          >
            <TextArea rows={2} placeholder="请输入具体事由" />
          </Form.Item>

          <Form.Item
            label="行程明细"
            name="tripDetail"
            rules={[
              {
                required: true,
                message: "请输入行程明细",
              },
            ]}
          >
            <TextArea rows={2} placeholder="请输入行程明细" />
          </Form.Item>

          <Form.Item
            label="出差人"
            name="tripPerson"
            rules={[
              {
                required: true,
                message: "请选择出差人",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              onChange={handleChange}
              options={[
                {
                  value: "廖宇轩",
                  label: "廖宇轩",
                },
                {
                  value: "王文",
                  label: "王文",
                },
                {
                  value: "陈旺君",
                  label: "陈旺君",
                },
                {
                  value: "刘涛",
                  label: "刘涛",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="金额"
            name="money"
            rules={[
              {
                required: true,
                message: "请输入金额",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              changeOnWheel
              prefix="￥"
            />
          </Form.Item>

          <ConfigProvider locale={locale}>
            <Form.Item
              label="出差时间"
              name="tripDate"
              rules={[
                {
                  required: true,
                  message: "请输入出差时间",
                },
              ]}
            >
              <RangePicker format="YYYY-MM-DD" />
            </Form.Item>
          </ConfigProvider>

          <Form.Item label="出差" name="todo1">
            <Input />
          </Form.Item>

          <Form.Item label="发票详情" name="todo2">
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" icon={<RightOutlined />} htmlType="submit">
                提交
              </Button>
              <Button type="default" icon={<DeleteOutlined />} htmlType="reset">
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <div className="flex relative left-10">
          <Table
            rowSelection={rowSelection}
            columns={tableColumns}
            dataSource={tableList}
          ></Table>
          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              className="right-20"
              onClick={download}
            >
              下载
            </Button>
          </Space>
        </div>
      </div>
    </>
  );
}
