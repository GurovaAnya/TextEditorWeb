import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      loggedIn: localStorage.getItem('jwt') != null
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  componentDidMount() {
    this.setState({loggedIn: localStorage.getItem('jwt') != null});
  }

  render () {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">TextEditorWeb</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <NavLink tag={Link} className="text-dark" to="/text-picker">Chose Text</NavLink>
            <NavLink tag={Link} className="text-dark" to="/document">New text</NavLink>

            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              {/*{ !this.state.loggedIn ?(*/}
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/login">Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/sign-up">Sign Up</NavLink>
                </NavItem>
              {/*</ul>*/}
              {/*    ):*/}
              {/*    (*/}
              {/*        <ul className="navbar-nav flex-grow">*/}
                      <NavItem>
                        <NavLink tag={Link} className="text-dark" onClick={()=>this.logOut()}>Logout</NavLink>
                      </NavItem>
                      </ul>
                  {/*)}*/}
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }

  logOut(){
    localStorage.setItem('jwt', null);
    localStorage.setItem('id', null);
    this.setState({loggedIn: false});
    this.forceUpdate();
    window.location.href ='/document';
    console.log(localStorage.getItem('jwt'))
  }
}
