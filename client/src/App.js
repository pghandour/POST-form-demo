import React, { Component } from 'react';
import './App.css';
const axios = require('axios');

const regexPatterns = {
  phoneNumber: /^[0-9]{10}$/,
  postalCode: /^[a-zA-Z]\d[a-zA-Z]( )?\d[a-zA-Z]\d$/,
  email: /[^\s@]+@[^\s@]+\.[^\s@]+/,
};
class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      users: [],
      postalCode: '',
      phoneNumber: '',
      email: '',
      postalCodeValid: true,
      emailValid: true,
      phoneNumberValid: true,
      submitted: false,
      result: {},
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    var { phoneNumber, postalCode, email } = this.state;
    var data = {
      phoneNumber: phoneNumber,
      postalCode: postalCode,
      email: email
    };
    var goodToSubmit = true;

    // Test to see if phone number consists of only 10 digits
    if (!regexPatterns.phoneNumber.test(phoneNumber)) {
      // Phone number is invalid
      console.log("invalid PN");
      this.setState({ phoneNumberValid: false });
      goodToSubmit = false;
    } else {
      // Phone number is valid
      console.log("valid PN");
      this.setState({ phoneNumberValid: true });
    }

    // Test to see if postal code follows Canadian format
    if (!regexPatterns.postalCode.test(postalCode)) {
      // Postal Code is invalid
      console.log("invalid PC");
      this.setState({ postalCodeValid: false });
      goodToSubmit = false;
    } else {
      // Postal Code is valid
      console.log("valid PC");
      this.setState({ postalCodeValid: true });
    }

    // Test to see if the email follows the correct format
    if (!regexPatterns.email.test(email)) {
      // Email is invalid
      console.log("invalid email");
      this.setState({ emailValid: false });
      goodToSubmit = false;
    } else {
      // Email is valid
      console.log("valid email");
      this.setState({ emailValid: true });
    }

    if (goodToSubmit) {
      axios.post('http://localhost:8080/api/users', data)
        .then(res => {
          console.log(res.data);
          this.setState({ submitted: true });
          this.getUser();
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  getUser() {
    var data;
    axios.get('http://localhost:8080/api/users')
      .then(res => {
        this.setState({ result: res.data })
      })
      .catch(err => console.log(err));
  }

  render() {
    const { postalCodeValid, emailValid, phoneNumberValid, submitted } = this.state;
    return (
      <div className="App">
        {!submitted ?
          <div id="form">
            <h1>Please enter your information</h1>
            <form onSubmit={this.handleSubmit.bind(this)}>

              Postal Code:
          <input type="text" name="postalCode" value={this.state.postalCode} onChange={this.handleChange.bind(this)} />
              <br />
              {!postalCodeValid &&
                <span id="postalCodeError"> Invalid Postal Code Format (e.g. M1W3B2 or M1W 3B2)<br /></span>
              }
              <br />

              Email:
          <input type="text" name="email" value={this.state.email} onChange={this.handleChange.bind(this)} />
              <br />
              {!emailValid &&
                <span id="emailError"> Invalid Email Format (e.g. abc@xyz.com)<br /></span>
              }
              <br />

              Phone Number:
          <input type="number" name="phoneNumber" value={this.state.phoneNumber} onChange={this.handleChange.bind(this)} />
              <br />
              {!phoneNumberValid &&
                <span id="phoneNumberError" > Invalid Phone Number Format (e.g. 4164206365, no dashes)<br /></span>
              }
              <br />
              <button type="submit">OK!</button>
            </form>
          </div>
          : <div id="thanks">
            <h1>Thank you.</h1>
            <p>{this.state.result.email}</p>
            <p>{this.state.result.phoneNumber}</p>
            <p>{this.state.result.postalCode}</p>
          </div>
        }
      </div>
    );
  }
}

export default App;
