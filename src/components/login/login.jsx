
import React, { useState, useEffect, useReducer } from "react";
import { useParams } from 'react-router';
import { axiosInstance as axios } from "../../utils/utils";
import { useHistory } from "react-router-dom";
import Logo from "../../assets/img/logo_small.png";
import IsLoading from "../common/loader";
import cookie from 'react-cookies'
import loader from "../../assets/img/loader.gif";
import toastr, { success } from "toastr";
toastr.options.preventDuplicates = true;
export const Login = () => {
  const histroy = useHistory();
  const [isLoader, setIsLoader] = useState(false)
  const [loginDetail, setLoginDetail] = useState({
    email: null,
    password: null
  });
  useEffect(() => {
    let token = cookie.load('auth_token');
    if (token) {
      histroy.push('/')
    }
  }, [])
  const handleForm = (e) => {
    const { name, value } = e.target;
    setLoginDetail((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }
  const loginUser = () => {
    let { email, password } = loginDetail
    if (email == '') {
      toastr.error("Please Enter Email!!")
    } else if (password == "") {
      toastr.error("Please Enter Password!!")
    } else {
      let reqBody = {
        email, password
      }
      setIsLoader(true);
      axios.post('/user/login', reqBody).then((res) => {
        cookie.save("auth_token", res.data.token);
        toastr.success('Login Successfully')
        localStorage.setItem("email", res.data.data);
        histroy.push("/")
      }).catch((err) => {
        setIsLoader(false)
        toastr.error('Please Enter Valid Login Details!!')
      })
    }

  }
  return (
    <>
      <div className="login_wrapper">
        <div className="login_inner">
          <div className="logo">
            <img src={Logo} alt="SVS" />
          </div>
          <div className="login_form">
            <div className="common_field">
              <input type="text" placeholder="User Name" name="email" onChange={(e) => handleForm(e)}></input>
            </div>
            <div className="common_field">
              <input type="password" placeholder="Password" name="password" onChange={(e) => handleForm(e)}></input>
            </div>
            <div className="common_field button">
              <button onClick={() => loginUser()}>Login</button>
            </div>
          </div>
        </div>
      </div>
      {isLoader && <div className="loader">
        <img src={loader} />
      </div>}
    </>
  )
};
