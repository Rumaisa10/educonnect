"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

export const LessonVideo = ({ courseId, lesson, module }) => {
  const [hasWindow, setHasWindow] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return (
    <>
      {hasWindow && (
        <ReactPlayer
          url={lesson.video_url}
          width="100%"
          height="470px"
          controls={true}
          onStart={handleOnStart}
          onDuration={handleOnDuration}
          onProgress={handleOnProgress}
          onEnded={handleOnEnded}
        />
      )}
    </>
  );
};
