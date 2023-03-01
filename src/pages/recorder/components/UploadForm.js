import React, { useState, useEffect } from "react";
import { Button, Input, Select, Form } from "antd";
import meetingApi from "../../../services/apis/meeting";

export const UploadForm = ({ onUpload, uploadData, onChangeUploadData, isSaving }) => {
  const [selectOption, setSelectOption] = useState([]);

  useEffect(() => {
    const getSelectOptions = async () => {
      try {
        const res = await meetingApi.getParticipants();
        const convertedOption = res.data.result?.map((item) => ({
          label: item.name,
          value: item._id,
        }));
        setSelectOption([...convertedOption]);
      } catch (ex) {
        setSelectOption([]);
        return;
      }
    };

    getSelectOptions();
  }, []);

  const handleSubmit = () => {
    const convertedArr = uploadData.meeting_participants?.map((item) => ({
      user_id: item,
    }));
    onUpload({ ...uploadData, meeting_participants: convertedArr });
  };

  return (
    <div
      style={{
        border: "1px solid #dddddd",
        padding: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <Form autoComplete="off">
        <Form.Item label="Tên file">
          <Input
            placeholder="Tên file"
            value={uploadData.name}
            onChange={(e) => onChangeUploadData({ name: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Chủ trì">
          <Input
            placeholder="Người chủ trì"
            value={uploadData.preside}
            onChange={(e) => onChangeUploadData({ preside: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Thành phần">
          <Select
            placeholder="Thành phần"
            mode="multiple"
            allowClear
            showSearch
            options={selectOption}
            onChange={(value) =>
              onChangeUploadData({
                meeting_participants: [...value],
              })
            }
          />
        </Form.Item>
      </Form>
      <div style={{ textAlign: "right" }}>
        <Button type="primary" onClick={handleSubmit} disabled={isSaving}>
          Lưu cuộc họp
        </Button>
      </div>
    </div>
  );
};
