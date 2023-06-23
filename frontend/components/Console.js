import { useRef, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Console(params) {
  const outputRef = useRef(null);

  useEffect(() => {
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [params.outputContent]);

  return (
    <Box
      height='250px'
      ref={outputRef}
      sx={{
        mb: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        overflowY: "scroll",
        bgcolor: 'background.paper',
        border: 1,
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingTop: "10px",
        paddingBottom: "10px"
      }}
    >
      <pre>{convConsoleLog(params.outputContent)}</pre>
    </Box>
  );
}


function convConsoleLog(logs) {
  return logs.join('\n')
}
