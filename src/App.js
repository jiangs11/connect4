import { ChakraProvider } from "@chakra-ui/react";
import { Main } from "./components/Main";
import customTheme from "./theme";

function App() {
    return (
        <ChakraProvider theme={customTheme}>
            <Main />
        </ChakraProvider>
    );
}

export default App;
