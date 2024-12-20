import React, { useState, useEffect } from "react";
import axios from "axios";
import { decryptUrl } from "./decryptUtil"; // Import the decryption utility

const AudioPlayer = ({ fileId }) => {
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/audio/presigned-url?fileId=${fileId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add your auth token
          },
        });

        
         // Log the response to verify the data
       
        // Set the decrypted URL
        if (response.data) {
          setAudioUrl(response.data);
        } else {
          console.error("Failed to decrypt the URL.");
        }
      } catch (error) {
        console.error("Error fetching audio URL:", error);
      }
    };

    fetchAudioUrl();
  }, [fileId]);

  return (
    <div>
      {audioUrl ? (
        <audio controls>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>Loading audio...</p>
      )}
    </div>
  );
};

export default AudioPlayer;