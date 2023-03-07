
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

export const BookedSeats = () => {
  const histroy = useHistory();
  // const [isPop, setIsPop] = useState(false);
  const [allSeats, setAllSeats] = useState(null)
  const [isLoader, setIsLoader] = useState(false)

  useEffect(() => {
    let token = cookie.load('auth_token');
    if (!token) {
      histroy.push('/login')
    } else {
      getAllBookedSeats();
    }
  }, [])

  const logout = () => {
    cookie.remove("auth_token");
    window.location.reload();
  }

  const getAllBookedSeats = () => {
    setIsLoader(true);
    axios.get('/user/getAllSeats').then((res) => {
      setAllSeats(res.data.data);
      setIsLoader(false)
      console.log(res.data.data, "efe")
    }).catch((err) => {

    })
  }

  const paymentPage = () => {
    histroy.push('/payments');
  }
  const seatsPage = () => {
    histroy.push('/bookedseats');
  }

  const totalHours = (item) => {
    let hourCount = 0;
    for (let slot of item.booked_slots) {
      hourCount += slot.slot_hours
    }
    return hourCount;
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
                <th>Seat No.</th>
                <th>Booked Slots</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {allSeats && allSeats.map((item, index) => {
                if (item.booked_slots.length > 0) {
                  return (
                    <tr key={index}>
                      <td>{item.seat_no}</td>
                      <td>{item.booked_slots.length > 0 && item.booked_slots.map((slot, count) => (
                        <span className="slots_booked">{slot.start} to {slot.end}</span>
                      ))}</td>
                      <td>{totalHours(item)}</td>
                    </tr>

                  )
                }
              })
              }
            </tbody>
          </table>

            {allSeats && allSeats.length == 0 && <p className="no_found">0 Seats Booked</p>}

          </div>

          {isLoader && <div className="loader">
            <img src={loader} />
          </div>}



        </div>
      </div>
    </div>
  )
};
