// Author: Michael Lopez
// Last Updated Date: 2025-12-27
// Purpose: This component provides a custom message input field for the Stream Chat application. 
// It enhances the default input by adding a "Send Message" button, allowing users to send messages 
// with a single click. The component integrates with the Stream Chat SDK to handle message submission.

import React from "react";
import { MessageInputFlat, useMessageInputContext } from 'stream-chat-react';

function CustomInput() {
    // Access the message input context to handle message submission
    const {handleSubmit} = useMessageInputContext();

    return (
        <div className="str-chat__input-flat str-chat__input-flat--send-button-action">
            {/* Wrapper for the custom input field */}
            <div className="str-chat__input-flat-wrapper">
                <div className="str-chat__input-flat--textarea-wrapper">
                    {/* Render the default message input field provided by Stream Chat */}
                    <MessageInputFlat />
                </div>
                {/* Add a "Send Message" button to trigger message submission */}
                <button onClick={handleSubmit}> Send Message</button>
            </div> 
        </div>
    );
}

export default CustomInput;