import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { PropTypes } from "prop-types";
import palette from './palette';
import typography from './typography';

Provider.propTypes = {
    children: PropTypes.node
}

export default function Provider({ children }) {
    const themeOptions = {
        palette,
        shape: { borderRadius: 8 },
        typography,
    };
    const theme = createTheme(themeOptions);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}