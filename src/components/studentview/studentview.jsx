
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

export const StudentView = (props) => {
  const histroy = useHistory();
  const [selectedUser, setSelectedUser] = useState(null)
  const [paymentHistory, setPaymentHitory] = useState(null)
  const [isLoader, setIsLoader] = useState(false)
  
  
  useEffect(() => {
    let token = cookie.load('auth_token');
    if (!token) {
      histroy.push('/login')
    } else {
      let student_id = props.match.params.id;
      if(student_id){
          getStudentData(student_id);
      }      
    }
  }, [])

  const logout = () => {
    cookie.remove("auth_token");
    window.location.reload();
  }

  const getStudentData = (id) => {
    setIsLoader(true);
    axios.get(`/user/getStudent/${id}`).then((response) => {
      setSelectedUser(response?.data?.student);
      setPaymentHitory(response?.data?.paymenHistory);
      setIsLoader(false);
    }).catch((err) => {
      setIsLoader(false);
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
            <span className="add" onClick={() => histroy.push('/')}>User List</span>
          </div>

          <div className="main_table_box student"> 
          <div className="user_info_form student_details">
            <div className="user_form">
              <h4 className="heading">User Information</h4>
              <div className="common_input">
                <label>Name</label>
                <input type="text" placeholder="Enter Name" value={selectedUser?.name} name="name" readOnly />
              </div>
              <div className="common_input">
              <label>Father Name</label>
                <input type="text" placeholder="Enter Father Name" name="father_name" value={selectedUser?.father_name} readOnly/>
              </div>
              <div className="common_input">
              <label>Email</label>
                <input type="email" placeholder="Enter email" name="email" value={selectedUser?.email} readOnly />
              </div>
              <div className="common_input">
              <label>Mobile No.</label>
                <input type="number" placeholder="Enter mobile" name="mobile"  value={selectedUser?.mobile} readOnly/>
              </div>

              <div className="common_input">
              <label>Study</label>
                <input type="text" placeholder="Enter mobile" name="mobile"  value={selectedUser?.study} readOnly/>
              </div>
              <div className="common_input">
              <label>Classes For</label>
                <input type="text" placeholder="Classes For" name="classes_for" value={selectedUser?.classes_for} readOnly />
              </div>
     
              <div className="common_input">
              <label>Seat No.</label>
                <input type="text" placeholder="Classes For" name="classes_for" value={selectedUser?.seat_no} readOnly />
              </div>
              <div className="common_input">
              <label>Slot</label>
                <input type="text" placeholder="Classes For" name="classes_for" value={`${selectedUser?.slot_start} to ${selectedUser?.slot_end}`} readOnly />
              </div>

              <h4 className="heading">User Address</h4>
              <div className="common_input">
              <label>Current</label>
                <textarea placeholder="Current Address" name="current_address" value={selectedUser?.current_address} readOnly></textarea>
              </div>
              <div className="common_input">
              <label>Permanent</label>
                <textarea placeholder="Permanent Address" name="permanent_address" value={selectedUser?.permanent_address} readOnly></textarea>
              </div>
            </div>
            
          </div>

          <h4 className="heading padding">Payment History</h4>
          <table className="userTable">
            <thead>
              <tr>
                <th>Payment Month</th>
                <th>Payment Year</th>
                <th>Fees</th>
                <th>Payment Type</th>

              </tr>
            </thead>
            <tbody>
              {paymentHistory && paymentHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.payment_month}</td>
                  <td>{item.payment_year}</td>
                  <td>{item.fees}</td>
                  <td>{item.payment_type}</td>

                </tr>
              ))}
            </tbody>
          </table>
          {paymentHistory && paymentHistory.length == 0 && <p className="no_found">No Payment History Found</p>}
          </div>

          {isLoader && <div className="loader">
            <img src={loader} />
          </div>}
        </div>
      </div>
    </div>
  )
};
