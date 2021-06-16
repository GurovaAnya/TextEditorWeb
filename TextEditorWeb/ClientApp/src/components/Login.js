import React, { Component } from "react";
import axios from "axios";

export default class Login extends Component {

    state = {name: null, login: null, password: null, response: null};

    constructor(props) {
        super(props);
        this.state = {login: null, password: null, response: null}
    }

    async logIn() {
        const data = {
            login: this.state.login,
            password: this.state.password
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        const response =  await axios.post("/api/auth/token", data)
            .catch(error => document.getElementById("error").innerText = "Error!");
        console.log(response);

        if (response.status === 200){
            const json = response.data;
            localStorage.setItem('jwt', json.access_token);
            localStorage.setItem('id', json.id);
            window.location.href ='/text-picker';
        }
    }

    changeLogin(event){
        this.setState({login: event.target.value});
    }

    changePassword(event){
        this.setState({password: event.target.value});
    }

    render() {
        return (
            <>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input value={this.state.login} onChange={(e)=>this.changeLogin(e)}  type="login" className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input value={this.state.password} onChange={(e)=>this.changePassword(e)}  type="password" className="form-control" placeholder="Enter password" />
                </div>

                <div id="error"></div>
                <button onClick={()=>this.logIn()} className="btn btn-primary btn-block">Submit</button>
            </>
        );
    }
}