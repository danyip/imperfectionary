import React, { useState } from "react";
import { emailRegex} from "../lib/regex";
import "../stylesheets/forms.css";
import { login } from "../lib/api";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";



function Login() {
  const [email, setEmail] = useState("");
  const [emailFormatValidation, setEmailFormatValidation] = useState(true);
  const [password, setPassword] = useState("");

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const checkEmailFormat = () => {
    setEmailFormatValidation(emailRegex.test(email));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    console.log(email, password);

    try {
      const res = await login(email, password)
      console.log(res.data.token);
      
      const socket = io.connect("http://localhost:9090", {
          auth: {
            token: res.data.token,
          },
        })
      
      dispatch({type: 'currentUser/login', payload: [res.data, socket]}) //TODO: FIX THIS! too many re-renders error
      
      navigate('/lobby')


    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Login Component</h1>
      <div className="error-message"></div>
      <form className="form-container" onSubmit={handleLogin}>
        <label>
          Email:
          <input
            className={`form-input ${!emailFormatValidation && "error-field"}`}
            id="email-input"
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={checkEmailFormat}
          />
        </label>
        <label>
          Password:
          <input
            id="password-input"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
