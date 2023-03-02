import React, { useState, useEffect, useRef } from "react";

import "./index.css";
import speechToTextUtils from "../../utils/utility_transcribe";
import { AudioWave } from "../../components/AudioWave/audioWave";
import { saveAs } from "file-saver";
import { objBlob } from "../../utils/utility_transcribe";
import { Button, Typography, message } from "antd";
import { UploadForm } from "./components/UploadForm";
import uploadApi from "../../services/apis/upload";
import meetingApi from "../../services/apis/meeting";
import moment from "moment";

const RecorderPage = () => {
  const [transcribedData, setTranscribedData] = useState([]);
  const [audio, setAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [uploadData, setUploadData] = useState({
    name: "",
    preside: "",
    meeting_participants: [],
    started_at: "",
    end_at: ""
  });

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcribedData]);

  useEffect(() => {
    const d = new Date();
    setUploadData({
      ...uploadData,
      name: `cuộc họp ${d.getDate()}_${
        d.getMonth() + 1
      }_${d.getFullYear()}_${d.getTime()}`,
    });
  }, []);

  const handleChangeUploadData = (data) => {
    setUploadData({ ...uploadData, ...data });
  };

  function handleDataReceived(data, isFinal) {
    const d = new Date();
    const text = `[${d.toLocaleTimeString()}]: ${data}`;
    if (isFinal) {
      setTranscribedData((oldData) => [...oldData, text]);
    } else {
      setTranscribedData((oldData) => [...oldData, text]);
    }
  }

  function getTranscriptionConfig() {
    return {
      audio: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
      },
      interimResults: true,
    };
  }

  function onStart() {
    setTranscribedData([]);
    setIsRecording(true);
    setUploadData({...uploadData, started_at: moment().valueOf()})

    speechToTextUtils.initRecording(
      getTranscriptionConfig(),
      handleDataReceived,
      (error) => {
        console.error("Error when transcribing", error);
        setIsRecording(false);
        // No further action needed, as stream already closes itself on error
      }
    );
  }

  function onStop() {
    setIsRecording(false);
    setUploadData({...uploadData, end_at: moment().valueOf()})
    speechToTextUtils.stopRecording();

    const url = window.URL.createObjectURL(objBlob.blob);
    setAudio(url);
  }

  const handleDownloadFile = () => {
    const breakLine = [...transcribedData].map((item) => item + "\n");
    let blob = new Blob([...breakLine], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${uploadData.name}.txt`);
  };

  const handleSaveMeeting = async (data) => {
    try {
      setIsSaving(true);
      const breakLine = [...transcribedData].map((item) => item + "\n");
      const blob = new Blob([...breakLine], {
        type: "text/plain;charset=utf-8",
      });
      const fdText = new FormData();
      fdText.append("file", blob, `${uploadData.name}.txt`);
      const resText = await uploadApi.upload(fdText);
      const urlText = resText.data.url;

      const fdAudio = new FormData();
      fdAudio.append("file", objBlob.blob, `${uploadData.name}.wav`);
      uploadApi
        .upload(fdAudio)
        .then((res) => {
          const urlAudio = res.data.url;
          const newDataUpload = {
            ...data,
            url_audio: urlAudio,
            url_txt: urlText,
          };
          meetingApi
            .addMeeting(newDataUpload)
            .then((res) => {
              setIsSaving(false);
              resetState();
              message.success("Lưu cuộc họp mới thành công!");
            })
            .catch((err) => {
              setIsSaving(false);
              message.error("Lưu thông tin cuộc họp không thành công!");
            });
        })
        .catch((err) => {
          setIsSaving(false);
          message.error("Lưu thông tin cuộc họp không thành công!");
        });
    } catch (ex) {
      setIsSaving(false);
      message.error("Lưu thông tin cuộc họp không thành công!");
    }
  };

  const resetState = () => {
    setUploadData({
      name: "",
      preside: "",
      meeting_participants: [],
      started_at: "",
      end_at: ""
    });
  };

  return (
    <div className="App">
      <Typography.Title level={1}>Hỗ trợ thư ký cuộc họp</Typography.Title>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "flex-start",
          margin: "2rem 5rem",
          height: "100%",
        }}
      >
        <div
          style={{
            flex: 1,
            textAlign: "left",
          }}
        >
          <div
            style={{
              border: "1px solid #dddddd",
              borderRadius: "6px",
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
            }}
          >
            <Button
              type="primary"
              onClick={onStart}
              disabled={isRecording}
            >
              {isRecording ? "Đang ghi" : "Bắt đầu ghi"}
            </Button>
            {isRecording && <AudioWave />}
            <Button
              type="primary"
              danger
              onClick={onStop}
              disabled={!isRecording}
            >
              Dừng
            </Button>
          </div>
          <Typography.Title level={4}>Nội dung:</Typography.Title>
          <div
            style={{
              border: "1px solid #dddddd",
              borderRadius: "6px",
              padding: "0 1rem",
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            {transcribedData.map((item, index) => {
              return (
                <p key={index} style={{ marginBottom: "1rem" }}>
                  {item}
                </p>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>
        <div
          style={{
            flex: 1,
          }}
        >
          <UploadForm
            onUpload={handleSaveMeeting}
            uploadData={uploadData}
            onChangeUploadData={handleChangeUploadData}
            isSaving={isSaving}
            isRecording={isRecording}
          />
          <Typography.Title level={4}>Download file</Typography.Title>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              {audio && <audio src={audio} controls />}
            </div>
            <div style={{ flex: 1 }}>
              <span className="download-text" onClick={handleDownloadFile}>
                {(uploadData.name && transcribedData.length > 0) && `${uploadData.name}.txt`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecorderPage;
