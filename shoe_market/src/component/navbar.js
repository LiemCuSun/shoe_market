import React from 'react'
import {
    Navbar,
    Nav,
    NavLink,
    Dropdown,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import {
    LOGO
} from '../assets'

// import connect
import { connect } from "react-redux"

//NOTE import action log out
import { logout } from "../action"


class Navigation extends React.Component {
    handleLogout = () => {
        localStorage.removeItem('username')
        this.props.logout()
    }
    render() {
        return (
            <Navbar fixed='top' style={{ background: 'rgba(82, 192, 192, 0.7)' }} expand="lg">
                <Navbar>
                    <Navbar.Brand as={Link} to='/'>
                        <img
                            alt=""
                            src={LOGO.default}
                            width="80"
                            height="50"
                            style={{ borderRadius: '15px', margin: "0px" }}
                        />{' '} <strong>Shoe Shop</strong>
                    </Navbar.Brand>
                </Navbar>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavLink as={Link} to='/' style={{ color: 'black' }}>
                            <i className="fas fa-home" syle={{ marginRight: '10px' }}></i>
                            <strong>HOME</strong>
                        </NavLink>
                    </Nav>
                    <Link to='/cart'>
                        <i className="fas fa-shopping-cart" style={{ fontSize: '22px', color: 'white', marginRight:"50px" }}></i>
                    </Link>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            <i className="fas fa-user" style={{ marginRight: "10px" }}></i>
                            {this.props.username ? this.props.username : " Username"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {this.props.username ?
                                <Dropdown.Item onClick={this.handleLogout}>Log Out</Dropdown.Item>
                                :
                                <>
                                    <Dropdown.Item><Link to='/login'>Login</Link></Dropdown.Item>
                                    <Dropdown.Item><Link to='/sign-up'>Sign Up</Link></Dropdown.Item>
                                </>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

// NOTE: state disini ambil dari global state bukan local cuy
let mapStateToProps = (state) => {
    return {
        username: state.user.username,
        password: state.user.password,
        email: state.user.email
    }
}


export default connect(mapStateToProps, { logout })(Navigation)