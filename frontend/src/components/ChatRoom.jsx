import React, { useState, useRef, useEffect } from "react";
import Moment from "react-moment";
import gql from "graphql-tag";
import { useSubscription, useMutation, useQuery } from "urql";

const MessagesSubscription = gql`
  subscription {
    messages {
      id
      user
      content
      created_at
    }
  }
`;

const GET_MESSAGE_QUERY = gql`
  {
    messages {
      id
      user
      content
      created_at
    }
  }
`;

const PostMessageMutation = gql`
  mutation($user: String!, $content: String!, $created_at: String!) {
    postMessage(user: $user, content: $content, created_at: $created_at)
  }
`;

const ChatRoom = ({ user }) => {
  const [toggle, setToggle] = useState(true);

  const [content, setContent] = useState("");

  const [result] = useSubscription({
    query: MessagesSubscription,
  });
  const [postResult, executePost] = useMutation(PostMessageMutation);

  const [prevMesseges] = useQuery({
    query: GET_MESSAGE_QUERY,
  });

  useEffect(() => {
    messagePanel.current.scrollIntoView({ behavior: "smooth" });
  }, [toggle]);

  const handlePost = () => {
    const created_at = Date.now().toString();
    console.log({ user, content });
    executePost({
      user,
      content,
      created_at,
    });
    setContent("");
    setToggle(!toggle);
  };

  const { data } = result.data ? result : prevMesseges;

  const messagePanel = useRef(null);

  return (
    <div className="container py-5">
      <h1 className="text-center">Chatroom</h1>
      <div className="row">
        <div
          className="message-box col-12 p-0 my-2 border border-secondary rounded"
          style={{ height: "65vh", overflow: "scroll" }}
        >
          <div className="container">
            {data?.messages?.length > 0 ? (
              data.messages.map(
                ({ id, user: username, content, created_at }) => {
                  return (
                    <div className="row px-4" key={id}>
                      <div
                        className={
                          user === username
                            ? "alert alert-info my-1  ml-auto"
                            : "alert alert-info my-1 "
                        }
                      >
                        <span className="font-weight-bold">{username}</span> :{" "}
                        {content}
                        <p className="mb-0 ">
                          <small className="font-weight-bold">
                            @
                            <Moment format="YYYY/MM/DD HH:MM">
                              {parseInt(created_at)}
                            </Moment>
                          </small>
                        </p>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <h5 className="my-5 text-center">No Messages</h5>
            )}
            <div ref={messagePanel}></div>
          </div>
        </div>
        <div className="col-12 p-0">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={content}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.length > 0) {
                  handlePost();
                }
              }}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="input-group-prepend">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  handlePost();
                }}
              >
                SEND
              </button>
            </div>
          </div>
          <small>Press Enter to Send</small>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
