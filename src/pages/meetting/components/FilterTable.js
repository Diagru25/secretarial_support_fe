import React, { useState } from "react";
import { Input, DatePicker, Space, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export const FilterTable = ({ onFilter }) => {
  const [filterData, setFilterData] = useState({
    text: "",
    start_time: dayjs().subtract(7, "days").valueOf(),
    end_time: dayjs().valueOf(),
  });

  const handleRangeChange = (values, stringValue) => {
    if (values) {
      const newState = {
        ...filterData,
        start_time: dayjs(values[0]).valueOf(),
        end_time: dayjs(values[1]).valueOf(),
      };
      onFilter(newState);
    }
  };

  return (
    <div
      style={{
        marginTop: "1.5rem",
        marginBottom: "1rem",
        textAlign: "left",
      }}
    >
      <Space>
        <Input
          allowClear
          placeholder="Tìm kiếm"
          prefix={<SearchOutlined />}
          value={filterData.text}
          onChange={(e) =>
            setFilterData({ ...filterData, text: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onFilter(filterData);
            }
          }}
        />
        <RangePicker
          placeholder={["Từ ngày", "Đến ngày"]}
          format={"DD-MM-YYYY"}
          //value={[dayjs(filterData.start_time), dayjs(filterData.end_time)]}
          onChange={handleRangeChange}
        />
        <Button onClick={() => onFilter(filterData)} type="primary">
          Lọc
        </Button>
      </Space>
    </div>
  );
};
