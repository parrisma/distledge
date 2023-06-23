import { createTheme } from "@material-ui/core/styles";
import { lightGreen, blue, purple, pink } from "@material-ui/core/colors";

export const defaultTheme = createTheme({
    palette: {
        primary: blue,
        secondary: pink
    }
});
  
export const customTheme = createTheme({
    palette: {
        primary: lightGreen,
        secondary: purple
    }
});