import * as React from 'react';
import Box from '@mui/material/Box';

/**
 * Control to contain the target of a Tab option
 * @param {*} props - Properties
 * @returns A Tab Panel.
 */
export default function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dl-tabpanel-${index}`}
            aria-labelledby={`dl-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box height="100%" width="100%" sx={{
                    border: 0,
                    bgcolor: 'background.paper'
                }}>
                    {children}
                </Box>
            )}
        </div>
    );
}