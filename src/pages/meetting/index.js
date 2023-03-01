import { useHookstate } from "@hookstate/core";
import { Button, Table, Typography } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { FilterTable } from "./components/FilterTable";
import meetingStore, { getAllMeeting } from "./store";
import { saveAs } from "file-saver";
import moment from "moment";

export const MeetingPage = () => {
  const meetingState = useHookstate(meetingStore);

  useEffect(() => {
    getAllMeeting();
  }, []);

  const handlePageChange = (page) => {
    getAllMeeting({pageIndex: page})
  }

  const handleDownload = (url) => {
    const arrSplit = url.split("/");
    const fileName = arrSplit[arrSplit.length - 1];
    saveAs(url, fileName);
  };

  const columns = [
    {
      title: "Cuộc họp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Chủ trì",
      dataIndex: "preside",
      key: "age",
    },
    {
      title: "Thành phần",
      dataIndex: "list_user",
      key: "list_user",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => <span>{moment(text).format("DD/MM/yyyy HH:mm")}</span>,
    },
    {
      title: "Audio",
      dataIndex: "url_audio",
      key: "url_audio",
      align: "center",
      render: (text) => {
        return (
          <Button
            type="link"
            icon={<VerticalAlignBottomOutlined />}
            onClick={() => handleDownload(text)}
          >
            Tải xuống
          </Button>
        );
      },
    },
    {
      title: "Văn bản",
      dataIndex: "url_txt",
      key: "url_txt",
      align: "center",
      render: (text) => {
        return (
          <Button
            type="link"
            icon={<VerticalAlignBottomOutlined />}
            onClick={() => handleDownload(text)}
          >
            Tải xuống
          </Button>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Button type="link" danger>
            Xóa
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <Typography.Title level={2}>Danh sách cuộc họp</Typography.Title>
      <div>
        <FilterTable onFilter={() => {}} />
        <Table
          size="small"
          dataSource={meetingState.items.get()}
          columns={columns}
          pagination={{
            pageSize: meetingState.pageSize.get(),
            current: meetingState.pageIndex.get(),
            total: meetingState.total.get(),
            onChange: handlePageChange
          }}
        />
      </div>
    </div>
  );
};
