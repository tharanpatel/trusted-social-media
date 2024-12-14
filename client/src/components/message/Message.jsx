import "./message.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from "../../axios";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://127.0.0.1:8000";

function isUserEvent(message) {
  const parsedMessage = JSON.parse(message.data);
  return parsedMessage.type === "userevent";
}

function isDocumentEvent(message) {
  const parsedMessage = JSON.parse(message.data);
  return parsedMessage.type === "contentchange";
}

const Message = () => {
  const [userMessage, setUserMessage] = useState("");
  const [username, setUsername] = useState("");
  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  


  return (
    <div className="bgContainer">
        <div className="mainChat">
        <div className="divider"></div>
            <div className="inputBox">
              <input
                type="text"
                placeholder={"write a message..."}
                onChange={e => setUserMessage(e.target.value)}
                value={userMessage}
              />
            </div>
        </div>
    </div>
  );
};

export default Message;