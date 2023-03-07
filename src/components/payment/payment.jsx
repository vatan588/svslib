
import React, { useState, useEffect, useReducer } from "react";
import { useParams } from 'react-router';
import { useHistory } from "react-router-dom";
import { axiosInstance as axios } from "../../utils/utils";
import cookie from 'react-cookies';
import Logo from "../../assets/img/logo_small.png";
import loader from "../../assets/img/loader.gif";
import { AiTwotoneDelete } from 'react-icons/ai';
import { GrFormView, GrAdd } from 'react-icons/gr';
import DatePicker from "react-datepicker";
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";

export const Payments = () => {
  const histroy = useHistory();
  const [payments, setPayments] = useState(null)
  const [isLoader, setIsLoader] = useState(false)
  
  useEffect(() => {
    let token = cookie.load('auth_token');
    if (!token) {
      histroy.push('/login')
    } else {
      getPayments();
    }
  }, [])

  const logout = () => {
    cookie.remove("auth_token");
    window.location.reload();
  }

  const getPayments = () => {
    setIsLoader(true);
    axios.get('/user/allPayments').then((response) => {
      setPayments(response.data.data);
      setIsLoader(false);
    }).catch((err) => {
      debugger;
    })
  }
  const paymentPage = () => {
    histroy.push('/payments');
  }
  const seatsPage = () => {
    histroy.push('/bookedseats');
  }

  return (
    <div className="main_wrapper">
      <div className="main_inner">
        <div className="header_main">
          <span className="logo"><img src={Logo} alt="Logo" /></span>
          <span className="lg" onClick={() => logout()}>LogOut</span>
        </div>

        <div className="userData">
          <div className="header_table not_tabs">
            <span className="add" onClick={() => seatsPage()}>Booked Seats</span>
            <span className="add" onClick={() => paymentPage()}>Payment History</span>
            <span className="add" onClick={() => histroy.push('/')}>User List</span>
          </div>

          <div className="main_table_box"> <table className="userTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile No.</th>
                <th>Payment Month</th>
                <th>Payment Year</th>
                <th>Fees</th>
                <th>Payment Type</th>

              </tr>
            </thead>
            <tbody>
              {payments && payments.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.mobile}</td>
                  <td>{item.payment_month}</td>
                  <td>{item.payment_year}</td>
                  <td>{item.fees}</td>
                  <td>{item.payment_type}</td>

                </tr>
              ))}
            </tbody>
          </table>
          {payments && payments.length == 0 && <p className="no_found">No Payment Found</p>}
          </div>

          {isLoader && <div className="loader">
            <img src={loader} />
          </div>}
        </div>
      </div>
    </div>
  )
};
