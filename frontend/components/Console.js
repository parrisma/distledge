import { useRef, useEffect } from "react";

export default function Console(params) {
  const outputRef = useRef(null);

  useEffect(() => {
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [params.outputContent]);
  return (
    <div className="console">
      <div ref={outputRef}      >
        <pre>{params.outputContent}</pre>
      </div>
    </div>
  );
}
