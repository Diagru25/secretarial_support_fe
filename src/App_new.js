import React, { useState, useEffect, useRef } from "react";

import "./App.css";
import speechToTextUtils from "./utility_transcribe";
import { AudioWave } from './audioWave';
import { saveAs } from 'file-saver';
import { bufferData, objBlob } from "./utility_transcribe";


const AppNew = () => {
    const [transcribedData, setTranscribedData] = useState([]);
    const [audio, setAudio] = useState(null);
    //const [interimTranscribedData, setInterimTranscribedData] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [name, setName] = useState('Thư ký');

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcribedData]);

    useEffect(() => {
        const d = new Date();
        setName(`cuoc_hop_${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}`)
    }, [])

    // function flushInterimData() {
    //     if (interimTranscribedData !== '') {
    //         setInterimTranscribedData('')
    //         setTranscribedData(oldData => [...oldData, interimTranscribedData])
    //     }
    // }

    function handleDataReceived(data, isFinal) {
        const d = new Date();
        const text = `[${d.toLocaleTimeString()}]: ${data}`
        if (isFinal) {
            //setInterimTranscribedData('')
            setTranscribedData(oldData => [...oldData, text])
        } else {
            //setInterimTranscribedData(data)
            setTranscribedData(oldData => [...oldData, text])
        }
    }

    function getTranscriptionConfig() {
        return {
            audio: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
            },
            interimResults: true
        }
    }

    function onStart() {
        setTranscribedData([])
        setIsRecording(true)

        speechToTextUtils.initRecording(
            getTranscriptionConfig(),
            handleDataReceived,
            (error) => {
                console.error('Error when transcribing', error);
                setIsRecording(false)
                // No further action needed, as stream already closes itself on error
            });
    }

    function onStop() {
      // console.log(bufferData);

      // let blob = new Blob([...bufferData], { type: "audio/wav" });
      // saveAs(blob, "audio.wav");
      // const url = window.URL.createObjectURL(blob);
      // setAudio(url);
      // console.log(url);
      setIsRecording(false);
      //flushInterimData() // A safety net if Google's Speech API doesn't work as expected, i.e. always sends the final result
      speechToTextUtils.stopRecording();
      console.log(objBlob.blob);
      const url = window.URL.createObjectURL(objBlob.blob);
      setAudio(url);
    }

    const handleDownloadFile = () => {
        const breakLine = [...transcribedData].map(item => item + "\n");
        let blob = new Blob([...breakLine], { type: "text/plain;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        console.log(url);
        //saveAs(blob, `${name}.txt`);
    }

    return (
        <div className="App">
            {/* <button onClick={() => { setTranscribedData(oldData => [...oldData, "ABC"]) }}>TEST</button> */}
            <h1>Hỗ trợ thư ký cuộc họp</h1>
            <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-start',
                margin: '5rem 10rem',
                height: '100%'
            }}>
                <div style={{
                    flex: 4,
                    textAlign: 'left'
                }}>
                    <div style={{
                        border: '1px solid #dddddd',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        // alignItems: 'center'
                    }}>
                        <button className={`btn btn-start ${isRecording && 'btn-disable'}`} onClick={onStart} disabled={isRecording}>{isRecording ? 'Đang ghi' : 'Bắt đầu'}</button>
                        {isRecording && <AudioWave />}
                        {/* {error && <span className='error'>{error}</span>} */}
                        <button className={`btn btn-stop ${!isRecording && 'btn-disable'}`} onClick={onStop} disabled={!isRecording}>Dừng</button></div>
                    <h3>Nội dung:</h3>
                    <div style={{
                        border: '1px solid #dddddd',
                        padding: '0 1rem',
                        maxHeight: '500px',
                        overflowY: 'auto'
                    }}
                    >
                        {transcribedData.map((item, index) => {
                            return <p key={index} style={{ marginBottom: '1rem' }}>{item}</p>
                        })}
                        <div ref={bottomRef} />
                    </div>

                </div>
                <div style={{
                    flex: 3
                }}>
                    <div style={{
                        border: '1px solid #dddddd',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    >
                        {/* <input value={timeChunk} onChange={(e) => setTimeChunk(Number(e.target.value))} disabled/> */}
                        <span style={{ fontSize: '14px' }}>Tên file: </span>
                        <input style={{minWidth: '250px'}} value={name} placeholder="Nhập tên người nói" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <h3>Download file</h3>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    {/* <th>Audio</th> */}
                                    <th>File txt</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{audio && <audio src={audio} controls />}</td>
                                    <td>{<span className='download-text' onClick={handleDownloadFile}>{name && `${name}.txt`}</span>}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppNew;
