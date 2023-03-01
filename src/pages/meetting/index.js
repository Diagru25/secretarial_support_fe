import { Table, Typography } from "antd";
import React from "react";
import {FilterTable} from "./components/FilterTable";

export const MeetingPage = () => {
    const dataSource = [
      {
        key: "1",
        name: "Mike",
        age: 32,
        address: "10 Downing Street",
      },
      {
        key: "2",
        name: "John",
        age: 42,
        address: "10 Downing Street",
      },
    ];

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
      },
    ];

    return (
      <div style={{ textAlign: "center" }}>
        <Typography.Title>Danh sách cuộc họp</Typography.Title>
        <div>
            <FilterTable onFilter={() => {}}/>
          <Table dataSource={dataSource} columns={columns} />
        </div>
      </div>
    );
}