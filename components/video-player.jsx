"use client";

export const VideoPlayer = ({ url }) => {
  return (
    <div className="relative aspect-video">
      <iframe
        className="w-full h-full"
        src={url}
        title="YouTube video player"
        frameBorder="0" // <- use camel-case
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin" // camel-case too
        allowFullScreen // camel-case (React automatically sets boolean)
      ></iframe>
    </div>
  );
};
