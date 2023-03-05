import { Flex } from "@chakra-ui/layout";

export const Row = ({ row, play }) => {
    return (
        <tr>
            {row.map((cell, i) => (
                <Cell key={i} value={cell} columnIndex={i} play={play} />
            ))}
        </tr>
    );
};

const Cell = ({ value, columnIndex, play }) => {
    let color = "whiteCircle";

    if (value === 1) {
        color = "redCircle";
    } else if (value === 2) {
        color = "yellowCircle";
    }

    return (
        <td>
            <Flex
                justify="center"
                align="center"
                className={"cell gameCell cursorPointer col" + columnIndex}
                onClick={() => {
                    play(columnIndex);
                }}
            >
                <div
                    className={
                        "colCircle" + columnIndex + " " + color
                    }
                ></div>
            </Flex>
        </td>
    );
};
