// Author: Michael Lopez
// Last Updated Date: 2025-12-27
// Purpose: Square component representing a single square in the game board.

import React from "react";

function Square({ chooseSquare, val }) {
    return (
        <div 
            className="square" 
            onClick={chooseSquare} // Trigger chooseSquare function when clicked
        >
            {val} {/* Display the value of the square */}
        </div>
    );
}
export default Square;