import React from "react";
import AudioPlayer from "./AudioPlayer";
import StreamedAudioPlayer from "./StreamedAudioPlayer";
import PresignedUrlFetcher from "./PresignFetcher";


const App = () => {
  console.log("File ID:", process.env.REACT_APP_FILE_ID);
  return (
    <div>
      <h1>Audio Player Example</h1>
      <h2>Using Pre-Signed URL</h2>
      <AudioPlayer fileId={process.env.REACT_APP_FILE_ID} />

      <h2>Using Streamed Audio</h2>
      <StreamedAudioPlayer fileId={process.env.REACT_APP_FILE_ID}  />
    </div>
  );
};

export default App;