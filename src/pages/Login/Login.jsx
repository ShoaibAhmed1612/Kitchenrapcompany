import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation check (this can be expanded)
    if (email === 'abdulrhoqeebb@gmail.com' && password === 'Ayodele12@') {
      // Redirect to the homepage
      navigate("/Dashboard");
    } else {
      alert("Incorrect email or password");
    }
  };

  return (
    <div className="bg-white mx-auto py-[2vw] ">
      <div className="flex flex-row justify-center items-center">
        <div>
          <h1 className="text-center text-[#E9278E] text-[2vw] font-roboto font-bold">
            Kitchen Wrap Company
          </h1>
        </div>
      </div>
      <div className="flex flex-row justify-center gap-36 pt-10">
        <div>
          <img
            src="/Logo/Kitchen.png"
            className="w-[35vw] flex flex-col justify-center"
            alt="kitchen"
          />
        </div>
        <div className="flex flex-col justify-center bg-gray-200 rounded-md px-[2vw] py-[2vw]">
          <div>
            <img
              src="/Logo/Kitchen-white.jpg"
              className="w-[20vw] mx-auto p-[1vw]"
              alt="kitchen white"
            />
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-3">
                <label htmlFor="email">E-mail:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="border border-gray-400 rounded-sm w-96 px-2 h-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col mb-3">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="border border-gray-400 rounded-sm w-96 px-2 h-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-center mx-auto my-3">
                <button
                  type="submit"
                  className="bg-[#E9278E] px-4 py-1 text-white rounded-sm font-semibold"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
