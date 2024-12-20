import React, { useState, useEffect, useRef } from "react";

const StreamedAudioPlayer = ({ fileId }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    // Fetch the audio stream from the backend
    const fetchAudioStream = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/audio/stream?fileId=${fileId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add your auth token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch audio stream");
        }

        // Create a blob URL for the streamed audio
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);

        // Set the audio source
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }
      } catch (error) {
        console.error("Error fetching audio stream:", error);
      }
    };

    fetchAudioStream();
  }, [fileId]);

  return (
    <div>
      <audio ref={audioRef} controls>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default StreamedAudioPlayer;