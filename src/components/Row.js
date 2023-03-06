import { Flex } from "@chakra-ui/layout";

export const Row = ({ row, rowIndex, play, handleHoverEvent }) => {
    return (
        <tr>
            {row.map((cell, i) => (
                <Cell
                    key={i}
                    value={cell}
                    rowIndex={rowIndex}
                    columnIndex={i}
                    play={play}
                    handleHoverEvent={handleHoverEvent}
                />
            ))}
        </tr>
    );
};

const Cell = ({ value, rowIndex, columnIndex, play, handleHoverEvent }) => {
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
                onMouseOver={(e) => handleHoverEvent(e.target.className, true)}
                // onMouseLeave={(e) => handleHoverEvent(e.target.className, false)}
            >
                <div
                    id={"cellNumber" + rowIndex + columnIndex}
                    className={
                        "col" +
                        columnIndex +
                        " colCircle" +
                        columnIndex +
                        " " +
                        color
                    }
                    onMouseOver={(e) =>
                        handleHoverEvent(e.target.className, true)
                    }
                ></div>
            </Flex>
        </td>
    );
};
