import { useRef, useEffect } from "react";

export default function OutputWindow(params) {
  const outputRef = useRef(null);

  useEffect(() => {
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [params.outputContent]);
  return (
    <div className="ml-auto py-2 px-4">
      <div
        className="bg-black text-white p-10 rounded-5"
        style={{ maxHeight: "200px", overflowY: "scroll" }}
        ref={outputRef}
      >
        <pre>{params.outputContent}</pre>
      </div>
    </div>
  );
}
