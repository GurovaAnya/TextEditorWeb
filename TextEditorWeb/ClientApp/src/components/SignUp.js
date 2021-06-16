import React, { Component } from "react";
import axios from "axios";

export default class SignUp extends Component {

    state = {name: null, login: null, password: null};

    constructor(props) {
        super(props);
        this.state = {name: null, login: null, password: null}
    }

    async signUp() {
        const data = {
            login: this.state.login,
            password: this.state.password,
            name: this.state.name
        };


        const response =  await axios.post("/api/auth/register", data)
            .catch(error => document.getElementById("error").innerText = "Error!");
        console.log(response);

        if (response.status === 200){
            const json = response.data;
            localStorage.setItem('jwt', json.access_token);
            localStorage.setItem('id', json.id);
            window.location.href ='/text-picker';
        }

        console.log(localStorage.getItem('jwt'));

    }

    changeName(event){
        this.setState({name: event.target.value});
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
                <h3>Sign Up</h3>

                <div className="form-group">
                    <label>Name</label>
                    <input value={this.state.name} onChange={(e)=>this.changeName(e)} type="name" className="form-control" placeholder="Name" />
                </div>

                <div className="form-group">
                    <label>Login</label>
                    <input value={this.state.login} onChange={(e)=>this.changeLogin(e)} type="login" className="form-control" placeholder="Enter login" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input value={this.state.password} onChange={(e)=>this.changePassword(e)} type="new-password" className="form-control" placeholder="Enter password" />
                </div>

                <button onClick={()=>this.signUp()}  className="btn btn-primary btn-block">Sign Up</button>
                </>
        );
    }
}