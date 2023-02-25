import { Link } from "react-router-dom";
import "./register.scss";
import { useState } from 'react'
import axios from 'axios'

const Register = () => {
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
    name: ''
  })
  const [errInfo, setErrInfo] = useState("")
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value })
  }

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8088/api/auth/register', inputs)
      console.log(res)
    } catch (err) {
      setErrInfo(err.response.data.error)
      setInputs({})
    }

  }


  return (
    <div className="register" >
      <div className="card">
        <div className="left">
          <h1>Lama Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <div style={{
            color: 'red',
            fontWeight: 800
          }}>{errInfo}</div>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange} />
            <input type="email" placeholder="Email" name="email" onChange={handleChange} />
            <input type="password" placeholder="Password" name="password" onChange={handleChange} />
            <input type="text" placeholder="Name" name="name" onChange={handleChange} />
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div >
  );
};

export default Register;
