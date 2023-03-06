import React from "react";
import { Heading, VStack } from "@chakra-ui/react";
import { Board } from "./Board";

export const Main = () => {
    return (
        <VStack height="100vh" spacing="1rem">
            <Heading style={{ marginTop: 10, marginBottom: -10 }}>
                Connect 4
            </Heading>
            <Board />
        </VStack>
    );
};
