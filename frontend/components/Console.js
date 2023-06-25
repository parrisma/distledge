import * as React from 'react';
import { useRef, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { createTheme } from "@material-ui/core/styles";

export default function Console(params) {
  const outputRef = useRef(null);

  useEffect(() => {
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [params.outputContent]);

  const theme = createTheme({
    //v5.0.0
    typography: {
      console: {
        fontSize: [14, "Console"]
      }
    }
  });

  let errRegEx = new RegExp("(error|fail|invalid)", 'ig');
  let eventRegEx = new RegExp("(event|emit)", 'ig');

  function itemColor(itemText) {
    let colorName = "primary.light";
    if (errRegEx.test(itemText)) {
      colorName = "#c62828"; // red
    }
    if (eventRegEx.test(itemText)) {
      colorName = "#2e7d32"; // green
    }
    return colorName;
  }

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
      <Grid container spacing={0} columns={1}>
        {params.outputContent.map((item) => (
          <Grid item xs={1}>
            <Typography variant="console" color={itemColor(item)}>{item}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

