import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
    styles: {
        global: {
            body: {
                // backgroundColor: "#8fc2e5",
                backgroundColor: "#96c2ff",
                // backgroundColor: 'black'
            },
        },
    },
    components: {
        Heading: {
            baseStyle: {
                fontFamily: '"Abel", sans-serif',
                color: 'white'
            }
        },
        Text: {
            baseStyle: {
                fontFamily: '"Abel", sans-serif',
                fontSize: '25px'
            }
        },
    },
});

export default customTheme;
