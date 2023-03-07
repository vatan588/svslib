
import React, { useState, useEffect, useReducer } from "react";
import { useParams } from 'react-router';
import { useHistory } from "react-router-dom";
import { axiosInstance as axios } from "../../utils/utils";
import cookie from 'react-cookies';
import Logo from "../../assets/img/logo_small.png";
import loader from "../../assets/img/loader.gif";
import { AiTwotoneDelete } from 'react-icons/ai';
import { GrView } from 'react-icons/gr';
import { ImCross } from 'react-icons/im';
import DatePicker from "react-datepicker";
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "react-datepicker/dist/react-datepicker.css";
import toastr, { success } from "toastr";
toastr.options.preventDuplicates = true;


export const Home = () => {
  const histroy = useHistory();
  // const [isPop, setIsPop] = useState(false);
  const [users, setUsers] = useState(null)
  const [payments, setPayments] = useState(null)
  const [specialLogin, setSpecialLogin] = useState(false)
  const [inactiveUserForPayNow, setInactiveUserForPayNow] = useState(false)
  const [isUsersForm, setIsUsersForm] = useState(false);
  const [isPayNowForm, setIsPayNowForm] = useState(false);
  const [checkSeats, setCheckSeats] = useState(false);
  const [isLoader, setIsLoader] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const [fees, setfees] = useState(500);
  const [paymentType, setPaymentType] = useState('Cash');
  const [totalSeat, setTotalSeat] = useState(85);
  const [avialableSeats, setAvialableSeats] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [expireDate, setExpireDate] = useState(new Date());
  const [paymentDate, setPaymentDate] = useState(new Date());

  const [slotsTiming, setSlotsTiming] = useState([6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]);

  const [cslot, setCSlot] = useState({
    c_start_slot: null,
    c_end_slot: null,
  });
  const [userDetail, setUserDetail] = useState({
    name: "",
    father_name: "",
    email: "",
    mobile: "",
    study: "",
    classes_for: "",
    current_address: "",
    permanent_address: "",
    profile_img: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    slot_end: 0,
    slot_start: 0,
    is_active: true,
    fees_expire: new Date(),
    fees_start: new Date(),
    is_custom_slot: false,
    user_type: 'new',
    fees_status: "pending",
    payment_type: "",
    seat_no: ""
  });
  useEffect(() => {
    let token = cookie.load('auth_token');
    if (!token) {
      histroy.push('/login')
    } else {
      let email = localStorage.getItem('email');
      if (email == 'vatans@gmail.com') {
        setSpecialLogin(true)
      }
      getUsers();
    }
  }, [])

  const changeSeat = () => {
    setCheckSeats(true)
  }

  const checkAllSeats = () => {
    getAvailableSeats();
  }

  const getAvailableSeats = async () => {
    await axios.get('/user/getAllSeats').then((res) => {
      let allSeats = res.data.data;
      let seats = [];

      let slotInHours = userDetail.slot_end - userDetail.slot_start;
      let finalCheck = []
      for (let i = 0; i < totalSeat; i++) {
        let foundSeats = allSeats.find((item) => item.seat_no == i);
        // console.log("aa", foundSeats);
        if (foundSeats && foundSeats.booked_slots.length > 0) {
          for (let j = 0; j < foundSeats.booked_slots.length; j++) {
            if (userDetail.slot_start <= foundSeats.booked_slots[j].start) {

              let add = foundSeats.booked_slots[j].start - slotInHours;
              // console.log("bbb", add, foundSeats.booked_slots[j].start);
              if (userDetail.slot_start <= add) {
                finalCheck.push(foundSeats.seat_no);
              } else {
                finalCheck.push("0");
              }
              // console.log("sss", foundSeats.seat_no,finalCheck )
              let isSeat = finalCheck.find((ele) => ele == '0')
              // console.log("nan", isSeat)
              if (isSeat !== '0' && isSeat !== undefined) {
                // console.log("nan0", foundSeats.seat_no)
                if (seats && seats.indexOf(foundSeats.seat_no) == -1) {
                  seats.push(foundSeats.seat_no);
                  finalCheck = [];
                }

              }
            } else if (userDetail.slot_start > foundSeats.booked_slots[j].start) {
              let add = foundSeats.booked_slots[j].start + slotInHours;
              if (userDetail.slot_start >= add) {
                finalCheck.push("1");
              } else {
                finalCheck.push("0");
              }
              let isSeat = finalCheck.find((ele) => ele == '0')
              // console.log("nan", isSeat)
              if (isSeat !== '0' && isSeat !== undefined) {
                // console.log("nan0", foundSeats.seat_no)
                if (seats && seats.indexOf(foundSeats.seat_no) == -1) {
                  seats.push(foundSeats.seat_no);
                  finalCheck = [];
                }
              }
            }
          }
        } else {
          seats.push(i);
        }
      }

      setAvialableSeats(seats);
      setCheckSeats(true)
    }).catch((err) => {

    })

  }
  const logout = () => {
    cookie.remove("auth_token");
    window.location.reload();
  }

  const userDataForm = () => {
    setIsUsersForm(true)
  }
  const getUsers = () => {
    setIsLoader(true);
    axios.get('/user/getAllUsers').then((res) => {
      setUsers(res.data.data);
      let inActiveStudents = [];
      let unPaidUsers = [];
      if (res?.data?.data.length > 0) {
        for (const [i, student] of res.data.data.entries()) {
          let expiriyDate = res.data.data[i].fees_expire;
          let leftHours = moment(expiriyDate).diff(moment(new Date()), "hours");
          if (leftHours < 0 && !(leftHours > 0) && student.account_type == "active" && student.fees_status == 'pending') {
            inActiveStudents.push(student)
          }
          if (leftHours < 48 && !(leftHours < 0) && student.account_type == "active" && student.fees_status == 'Paid') {
            unPaidUsers.push(student);
          }
        }
      }
      if (inActiveStudents.length > 0) {
        setIsLoader(true);
        for (let student of inActiveStudents) {
          student.fees_status = 'pending';
          student.payment_type = null;
          student.account_type = 'inactive';
          student.seat_no = null;
          student.slot_start = null;
          student.slot_end = null;
          const promises = [];
          promises.push(axios.post(`/user/userUpdate/${student._id}`, student));
          Promise.all(promises).then((responses) => {
            let students = responses.map((response) => response.data.data);
            setIsLoader(false);
          })
        }
      }
      if (unPaidUsers.length > 0) {
        setIsLoader(true);
        for (let student of unPaidUsers) {
          student.fees_status = 'pending';
          student.payment_type = null;
          const promises = [];
          promises.push(axios.post(`/user/userUpdate`, student));
          Promise.all(promises).then((responses) => {
            let students = responses.map((response) => response.data.data);
            setIsLoader(false);
          })
        }
      }
      setIsLoader(false)
    }).catch((err) => {

    })
  }
  const handleFormData = (e) => {
    let { name, value } = e.target;
    if (name == 'mobile' && value.toString().length > 10) {
      return toastr.error("Max 10 digits are allowed!!")
    }
    setUserDetail((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const closePopUp = () => {
    setIsUsersForm(false);
    setIsPayNowForm(false);
    setSelectedSeat(null);
    setSelectedUser(null)
    setfees(500);
    setInactiveUserForPayNow(false)
  }

  const saveData = async () => {
    userDetail.seat_no = selectedSeat;
    userDetail.fees_start = startDate;
    userDetail.fees_expire = expireDate;
    userDetail.slot_start = Number(userDetail.slot_start);
    userDetail.slot_end = Number(userDetail.slot_end);
    let difference = moment(startDate).diff(moment(expireDate), "days");

    if (userDetail.study == "" || userDetail.name == "" || userDetail.father_name == "" || userDetail.mobile == "" || userDetail.classes_for == "" || userDetail.current_address == "" || userDetail.permanent_address == "") {
      return toastr.error("Please Enter Mandatory Fields!!")
    }
    if (difference >= 0) {
      return toastr.error("Please Select Correct Dates!!")
    }
    if (!userDetail.seat_no) {
      return toastr.error("Please Select Seat First!!")
    }
    if (userDetail.mobile.toString().length > 10) {
      return toastr.error("Please Enter Valid Mobile No.!!")
    }
    if (userDetail.slot_end < userDetail.slot_start) {
      return toastr.error("Please Enter Valid Slots.!!")
    }
    setIsLoader(true);
    await axios.post("/user/addUser", userDetail).then((res) => {
      getUsers();
      setSelectedSeat(null);
      setIsUsersForm(false);
      setIsLoader(false);

    })
  }

  const deleteUser = async (e, student) => {
    student.fees_status = 'pending';
    student.payment_type = null;
    student.account_type = 'suspended';
    student.seat_no = null;
    student.slot_start = null;
    student.slot_end = null;
    setIsLoader(true);
    await axios.post(`/user/userUpdate/${student._id}`, student).then((res) => {
      getUsers();
      setIsLoader(false);
    }).catch((err) => {
      setIsLoader(false);
    })
  }

  const payNow = (e, user) => {
    let hours = user.slot_end - user.slot_start;
    let difference = moment(user.fees_expire).diff(moment(user.fees_start), "days");

    if (hours > 4) {
      let extraHours = hours - 4;
      let extraAmount = fees + extraHours * 100;
      let perDayfees = extraAmount / 30;
      let finalFees = perDayfees * difference
      setfees(Math.floor(finalFees));
    } else if (hours > 9) {
      let extraAmount = fees + 600;
      let perDayfees = extraAmount / 30;
      let finalFees = perDayfees * difference;
      setfees(Math.floor(finalFees));
    } else {
      let perDayfees = fees / 30;
      let finalFees = perDayfees * difference
      setfees(Math.floor(finalFees));
    }

    setSelectedUser(user);
    setIsPayNowForm(true);
  }

  const payInactiveStudent = (e, user) => {
    setSelectedUser(user);
    setInactiveUserForPayNow(true)
    setIsPayNowForm(true);
  }

  const handlePaymentType = (e) => {
    let { name, value } = e.target;
    setPaymentType(value);
  }

  const checkLeftDays = (data) => {
    // var now = new Date();
    // let days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    // let currDay = new Date().getDate();
    // let remaningDays = days - currDay;
    let remaningDays = moment(data.fees_expire).diff(moment(new Date()), "days");
    return `In ${remaningDays} Days`
  }

  const inActiveTOActive = async () => {
    selectedUser.seat_no = selectedSeat;
    selectedUser.fees_start = startDate;
    selectedUser.fees_expire = expireDate;
    selectedUser.slot_start = Number(userDetail.slot_start);
    selectedUser.slot_end = Number(userDetail.slot_end);
    selectedUser.account_type = 'active';
    let difference = moment(startDate).diff(moment(expireDate), "days");

    if (difference >= 0) {
      return toastr.error("Please Select Correct Dates!!")
    }
    if (!selectedSeat) {
      return toastr.error("Please Select Seat First!!")
    }

    if (userDetail.slot_end < userDetail.slot_start) {
      return toastr.error("Please Enter Valid Slots.!!")
    }
    setIsLoader(true);
    await axios.post("/user/userUpdate", selectedUser).then((res) => {
      getUsers();
      setSelectedSeat(null);
      setIsPayNowForm(false);
      setIsLoader(false);
      window.location.reload();
    })
  }
  const paymentUpdate = async () => {
    let body = {
      name: selectedUser.name,
      mobile: selectedUser.mobile,
      fees: fees,
      student_id: selectedUser._id,
      payment_type: paymentType,
      payment_month: moment(paymentDate).format('MMM'),
      payment_year: moment(paymentDate).format('YYYY')
    }
    setIsLoader(true);
    await axios.post('/user/paymentUpdate', body).then((res) => {
      selectedUser.payment_type = paymentType;
      selectedUser.fees_status = 'Paid';
      axios.post('user/userUpdate', selectedUser).then((res) => {
        let seatInfo = {
          seat_no: selectedUser.seat_no,
          booked_slots: [{
            start: selectedUser.slot_start,
            end: selectedUser.slot_end,
            student_id: selectedUser._id,
            slot_hours: selectedUser.slot_end - selectedUser.slot_start,
          }]
        }
        axios.post('/user/seatBooking', seatInfo).then((res) => {
          setIsUsersForm(false);
          setIsPayNowForm(false);
          setSelectedUser(null)
          setfees(500);
          getUsers();
          setIsLoader(false);
        })


      }).catch((err) => {

      })
    }).catch((err) => {

    })
  }

  const setSpecialAmount = (e) => {
    let { value } = e.target;
    setfees(value)
  }

  const selectSeat = (e, seat) => {

    setSelectedSeat(seat);
    setCheckSeats(false)
  }
  const paymentPage = () => {
    histroy.push('/payments');
  }
  const seatsPage = () => {
    histroy.push('/bookedseats');
  }
  const viewUserDetails = (e, student) => {
    histroy.push(`/student/${student._id}`);
  }

  return (
    <div className="main_wrapper">
      <div className="main_inner">
        <div className="header_main">
          <span className="logo"><img src={Logo} alt="Logo" /></span>
          <span className="lg" onClick={() => logout()}>LogOut</span>
        </div>

        <div className="userData">
          <div className="header_table">
            <span className="add seats" onClick={() => seatsPage()}>Booked Seats</span>
            <span className="add payment" onClick={() => paymentPage()}>Payment History</span>
            <span className="add student" onClick={() => userDataForm()}>Add Student</span>
          </div>

          <Tabs>
            <TabList>
              <Tab>Active Students</Tab>
              <Tab>InActive Students</Tab>
              <Tab>Suspended Students</Tab>
            </TabList>

            <TabPanel>
              <div className="main_table_box">
                <table className="userTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Mobile No.</th>
                      <th>Email</th>
                      <th>Slot</th>
                      <th>Seat No.</th>
                      <th>Fee Status</th>
                      <th>Next Due</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.map((item, index) => {
                      if (item.account_type == 'active')
                        return (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.mobile}</td>
                            <td>{item.email}</td>
                            <td>{item.slot_start} to {item.slot_end}</td>
                            <td>{item.seat_no}</td>
                            <td>
                              {item.fees_status == 'pending' && <span>Pending <span className="paynow" onClick={(e) => payNow(e, item)}>PayNow</span></span>}
                              {item.fees_status == 'Paid' && <span className="paid">Paid ({item?.payment_type})</span>}
                            </td>
                            <td>{checkLeftDays(item)}</td>
                            <td>
                              <span className="view_icon" onClick={(e) => viewUserDetails(e, item)}><GrView /></span>
                              <span className="del_icon" onClick={(e) => deleteUser(e, item)}><AiTwotoneDelete /></span>
                            </td>
                          </tr>
                        )
                    })}
                  </tbody>
                </table>

                {users && users.length == 0 && <p className="no_found">No User Found</p>}

              </div>
            </TabPanel>
            <TabPanel>
              <div className="main_table_box">
                <table className="userTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Mobile No.</th>
                      <th>Email</th>
                      <th>Slot</th>
                      <th>Seat No.</th>
                      <th>Fee Status</th>
                      <th>Next Due</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.map((item, index) => {
                      if (item.account_type == 'inactive')
                        return (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.mobile}</td>
                            <td>{item.email}</td>
                            <td>{item.slot_start ? item.slot_start : 'N/A'} {item.slot_start ? 'to' : ''} {item.slot_end}</td>
                            <td>{item.seat_no ? item.seat_no : 'N/A'}</td>
                            <td>
                              {item.fees_status == 'pending' && <span>Pending <span className="paynow" onClick={(e) => payInactiveStudent(e, item)}>PayNow</span></span>}
                              {item.fees_status == 'Paid' && <span className="paid">Paid ({item?.payment_type})</span>}
                            </td>
                            <td>{checkLeftDays(item)}</td>
                            <td>
                              {/* <span className="view_icon"><GrFormView /></span> */}
                              <span className="del_icon" onClick={(e) => deleteUser(e, item)}><AiTwotoneDelete /></span>
                            </td>
                          </tr>
                        )
                    })}
                  </tbody>
                </table>

                {users && users.length == 0 && <p className="no_found">No User Found</p>}

              </div>
            </TabPanel>
            <TabPanel>
              <div className="main_table_box">
                <table className="userTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Mobile No.</th>
                      <th>Email</th>
                      <th>Slot</th>
                      <th>Seat No.</th>
                      <th>Fee Status</th>
                      <th>Next Due</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.map((item, index) => {
                      if (item.account_type == 'suspended')
                        return (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.mobile}</td>
                            <td>{item.email}</td>
                            <td>{item.slot_start ? item.slot_start : 'N/A'} {item.slot_start ? 'to' : ''} {item.slot_end}</td>
                            <td>{item.seat_no ? item.seat_no : 'N/A'}</td>
                            <td>
                              {item.fees_status == 'pending' && <span>Pending <span className="paynow" onClick={(e) => payInactiveStudent(e, item)}>PayNow</span></span>}
                              {item.fees_status == 'Paid' && <span className="paid">Paid ({item?.payment_type})</span>}
                            </td>
                            <td>{checkLeftDays(item)}</td>
                            <td>
                              {/* <span className="view_icon"><GrFormView /></span> */}
                              <span className="del_icon" onClick={(e) => deleteUser(e, item)}><AiTwotoneDelete /></span>
                            </td>
                          </tr>
                        )
                    })}
                  </tbody>
                </table>

                {users && users.length == 0 && <p className="no_found">No User Found</p>}

              </div>
            </TabPanel>
          </Tabs>



          {isUsersForm && <div className="user_info_form">
            <div className="user_form">
              <h4 className="heading">User Information</h4>
              <div className="common_input">
                <input type="text" placeholder="Enter Name" name="name" onChange={(e) => handleFormData(e)} />
              </div>
              <div className="common_input">
                <input type="text" placeholder="Enter Father Name" name="father_name" onChange={(e) => handleFormData(e)} />
              </div>
              <div className="common_input">
                <input type="email" placeholder="Enter email" name="email" onChange={(e) => handleFormData(e)} />
              </div>
              <div className="common_input">
                <input type="number" placeholder="Enter mobile" name="mobile" onChange={(e) => handleFormData(e)} />
              </div>

              <div className="common_input">
                <select name="study" onChange={(e) => handleFormData(e)}>
                  <option selected disabled>Study</option>
                  <option>10th</option>
                  <option>12th</option>
                  <option>Diploma/E.T.T</option>
                  <option>Graduation</option>
                  <option>Post Graduation</option>
                </select>
              </div>
              <div className="common_input">
                <input type="text" placeholder="Classes For" name="classes_for" onChange={(e) => handleFormData(e)} />
              </div>
              <div className="common_input">
                <label className="common_label small">Start</label>
                <DatePicker dateFormat={'dd/MM/yyyy'} selected={startDate} onChange={(date) => setStartDate(date)} />
              </div>
              <div className="common_input">
                <label className="common_label small">End</label>
                <DatePicker dateFormat={'dd/MM/yyyy'} selected={expireDate} onChange={(date) => setExpireDate(date)} />
              </div>

              <div className="common_input">
                <label className="common_label">Slot (Use 24hr. Format)</label>

                <select name="slot_start" onChange={(e) => handleFormData(e)}>
                  <option selected disabled>Start</option>
                  {slotsTiming.map((slot, index) => (<option>{slot}</option>))}

                </select> to
                <select name="slot_end" onChange={(e) => handleFormData(e)}>
                  <option selected disabled>End</option>
                  {slotsTiming.map((slot, index) => (<option key={index}>{slot}</option>))}

                </select>
              </div>
              <div className="common_input">


                {selectedSeat ? <><div className="ss"><span>Seat No. {selectedSeat}</span></div><span className="link_change" onClick={() => setCheckSeats(true)}>Change</span></>

                  : <>{userDetail.slot_start && userDetail.slot_end && <span className="link_change" onClick={() => checkAllSeats()}>Click here to select seat</span>}</>
                }


                {checkSeats && <div className="seat_pop">
                  <div className="inner_seat">
                    <span className="cross_icon" onClick={() => setCheckSeats(false)}><ImCross /></span>
                    <h4 className="heading">Available Seats</h4>
                    {avialableSeats && avialableSeats.map((item, index) => {
                      if (index > 0) {
                        return <span key={index} className={selectedSeat == item ? "seats_box sle" : "seats_box"} onClick={(e) => selectSeat(e, item)}>{item}</span>
                      }
                    })
                    }
                  </div>
                </div>
                }


              </div>

              <h4 className="heading">User Address</h4>
              <div className="common_input">
                <textarea placeholder="Current Address" name="current_address" onChange={(e) => handleFormData(e)}></textarea>
              </div>
              <div className="common_input">
                <textarea placeholder="Permanent Address" name="permanent_address" onChange={(e) => handleFormData(e)}></textarea>
              </div>
              <div className="common_input buttons">
                <span className="can" onClick={() => closePopUp()}>Cancel</span>
                <span className="sub" onClick={() => saveData()}>Submit</span>
              </div>
            </div>
          </div>}


          {isPayNowForm && <div className="user_info_form payform">
            <div className="user_form">
              <h4 className="heading">User Information</h4>
              <div className="common_input">
                <label className="common_label">Name</label>
                <input type="text" value={selectedUser?.name} name="name" readOnly />
              </div>
              <div className="common_input">
                <label className="common_label">Mobile No.</label>
                <input type="text" value={selectedUser?.mobile} name="email" readOnly />
              </div>
              {inactiveUserForPayNow ?
                <div className="common_input">
                  <label className="common_label">Slot (Use 24hr. Format)</label>

                  <select name="slot_start" onChange={(e) => handleFormData(e)}>
                    <option selected disabled>Start</option>
                    {slotsTiming.map((slot, index) => (<option>{slot}</option>))}

                  </select> to
                  <select name="slot_end" onChange={(e) => handleFormData(e)}>
                    <option selected disabled>End</option>
                    {slotsTiming.map((slot, index) => (<option key={index}>{slot}</option>))}

                  </select>
                </div> :
                <div className="common_input">
                  <label className="common_label">Slot</label>
                  <input type="text" value={`${selectedUser?.slot_start} to ${selectedUser?.slot_end}`} name="slot" readOnly />
                </div>
              }
              <div className="common_input">
                <label className="common_label">Classic For</label>
                <input type="text" value={selectedUser?.classes_for} name="classes_for" readOnly />
              </div>
              {!inactiveUserForPayNow ? <>  <div className="common_input">
                <label className="common_label">From Date</label>
                <DatePicker dateFormat={'dd/MM/yyyy'} selected={new Date(selectedUser.fees_start)} />
              </div>
                <div className="common_input">
                  <label className="common_label">Till Date</label>
                  <DatePicker dateFormat={'dd/MM/yyyy'} selected={new Date(selectedUser.fees_expire)} />
                </div></> : <>
                <div className="common_input">
                  <label className="common_label">From Date</label>
                  <DatePicker dateFormat={'dd/MM/yyyy'} selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
                <div className="common_input">
                  <label className="common_label">Till Date</label>
                  <DatePicker dateFormat={'dd/MM/yyyy'} selected={expireDate} onChange={(date) => setExpireDate(date)} />
                </div>
              </>}

              {!inactiveUserForPayNow && <>
                <div className="common_input">
                  <label className="common_label">Seat No.</label>
                  <input type="text" value={selectedUser.seat_no} name="classes_for" readOnly />
                </div>
                <div className="common_input">
                  <label className="common_label">Amount</label>
                  <input type="text" value={fees} name="classes_for" readOnly />
                </div>
                <div className="common_input">
                  <label className="common_label">Payment Type</label>
                  <select name="pType" onChange={(e) => handlePaymentType(e)}>
                    <option defaultValue>Cash</option>
                    <option>GooglePay</option>
                  </select>
                </div>
              </>
              }
              {inactiveUserForPayNow &&
                <div className="common_input">
                  {selectedSeat ? <><div className="ss"><span>Seat No. {selectedSeat}</span></div><span className="link_change" onClick={() => setCheckSeats(true)}>Change</span></>
                    : <>{userDetail.slot_start && userDetail.slot_end && <span className="link_change" onClick={() => checkAllSeats()}>Click here to select seat</span>}</>
                  }

                  {checkSeats && <div className="seat_pop">
                    <div className="inner_seat">
                      <span className="cross_icon" onClick={() => setCheckSeats(false)}><ImCross /></span>
                      <h4 className="heading">Available Seats</h4>
                      {avialableSeats && avialableSeats.map((item, index) => {
                        if (index > 0) {
                          return <span key={index} className={selectedSeat == item ? "seats_box sle" : "seats_box"} onClick={(e) => selectSeat(e, item)}>{item}</span>
                        }
                      })
                      }
                    </div>
                  </div>
                  }
                </div>
              }

              {specialLogin && <div className="common_input">
                <label className="common_label">Special Amount</label>
                <input type="text" placeholder="Special Amount" name="classes_for" onChange={(e) => setSpecialAmount(e)} />
              </div>
              }
              <div className="common_input buttons">
                <span className="can" onClick={() => closePopUp()}>Cancel</span>
                {inactiveUserForPayNow ?
                  <span className="sub" onClick={() => inActiveTOActive()}>Submit</span> :
                  <span className="sub" onClick={() => paymentUpdate()}>Submit</span>
                }
              </div>
            </div>
          </div>}

          {isLoader && <div className="loader">
            <img src={loader} />
          </div>}



        </div>
      </div>
    </div>
  )
};
