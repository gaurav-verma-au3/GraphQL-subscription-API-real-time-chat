import React, { useState } from "react";

const Login = ({ setUser }) => {
  const [userName, setUserName] = useState("");
  return (
    <div className="container " style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-12 d-flex justify-content-center align-items-center">
          <form className=" p-5 rounded shadow shadow-lg form-inline bg-secondary">
            <h3 className="text-center text-light mx-3 mb-0">Join Chat</h3>
            <input
              type="text"
              class="form-control"
              placeholder="Enter Username ..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button
              className="btn btn-primary mx-3 "
              onClick={(e) => setUser(userName)}
            >
              Join
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
