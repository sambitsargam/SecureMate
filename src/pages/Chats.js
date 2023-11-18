import React, { useState, useEffect, useContext } from "react";
import { Button, ClipboardIcon } from "@windmill/react-ui";
import { AuthContext } from "../utils/AuthProvider";
import CopyToClipboard from "react-copy-to-clipboard";

function Chat() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const { address, signer, connect } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    fetch("https://feedback-2087f-default-rtdb.firebaseio.com/chat.json")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        const usersArray = Object.values(data).map((entry) => ({
          id: entry.sender,
          receiver: entry.receiver,
          sender: entry.sender,
        }));
        setUsers(usersArray);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, []);

  const handleChatStart = () => {
    const chatLink = `https://securemate-chat.vercel.app/`;
    window.open(chatLink, "_blank");
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const userNotFoundMessageDisplayed = users.every(
    (user) => user.sender !== address
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-8xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col">
          <main className="p-6 sm:p-12 md:w-1/2 mx-auto">
            <h1 className="text-4xl font-semibold text-center mb-6">
              Chat Users
            </h1>
            {loading ? (
              <p className="text-center">Loading..........</p>
            ) : error ? (
              <p className="text-center">Error: {error.message}</p>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="bg-blue-100 p-4 my-4 rounded-lg">
                  {user.sender === address ? (
                    <>
                      <p className="text-center">
                        User Address: {address}
                        <CopyToClipboard text={address} onCopy={handleCopy}>
                          <Button
                            iconRight={ClipboardIcon}
                            className="ml-2"
                          >
                            {copied ? "Copied!" : "Copy Address"}
                          </Button>
                        </CopyToClipboard>
                      </p>
                      <Button
                        onClick={() => handleChatStart()}
                        block
                        className="mt-4"
                      >
                        Let's Start 🥰
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-center">
                        No User Found... First go to Dashboard, click on Chat
                        for a particular user.
                      </p>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center">
                {userNotFoundMessageDisplayed
                  ? "No User Found... First go to Dashboard, click on Chat for a particular user."
                  : ""}
              </p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Chat;
