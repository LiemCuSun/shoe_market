import Axios from 'axios'
import React, { useState, useRef, useEffect } from 'react'
import {
    Button,
    InputGroup,
    FormControl,
    Modal
} from 'react-bootstrap'

// import action untuk login dan logout
import {
    login,
    logout
} from '../action'

// import connect redux
import { connect } from "react-redux"

// import redirect from react router-dom
import { Redirect } from "react-router-dom"

function Login(props) {
    // NOTE nyobain useEffect 
    let renderCount = useRef(1)
    useEffect(() => {
        renderCount.current = renderCount.current + 1
    },[])


    let usernameRef = useRef('')
    let passwordRef = useRef('')
    console.log(usernameRef, passwordRef)



    // function handleUsersChange(e) {
    //     setUsers(e.target.value)
    // }

    let [visible, setVisible] = useState(false)

    let [regErr, setRegErr] = useState([false, ""])


    function handleLogin(x) {
        // let username = this.refs.username.value NOTE ini cara lama yg pake state
        // let password = this.refs.password.value
        console.log(x)
        let username = usernameRef.current.value
        let password = passwordRef.current.value
        console.log(username, password)

        if (!username || !password) return setRegErr([true, 'Please input username & password'])

        Axios.get(`http://localhost:2000/users?username=${username}&password=${password}`)
            .then((res) => {
                console.log(res.data)
                if (res.data.length === 0) return setRegErr([true, 'Invalid username or password'])

                props.login(res.data[0])
                // localStorage.setItem("username", username) ini syntax lebih panjang
                localStorage.username = username
                localStorage.id = res.data[0].id
                console.log(localStorage.id)


            })
            .catch((err) => { console.log(err) })
    }
    if (props.username) return <Redirect to='/' />
    console.log(usernameRef.current.value)
    console.log(`login page rendered ${renderCount.current} times`)
    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <h1 style={{ display: "flex", justifyContent: "center" }}>Login</h1>
                <p>Username</p>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">
                            <i className="fas fa-user"></i>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        ref={usernameRef}
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>
                <p>Password</p>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend style={{ cursor: 'pointer', width: '40px' }}
                        onClick={() => setVisible(!visible)}>
                        <InputGroup.Text id="basic-addon1">
                            <i className={visible ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                            {/* {visible ? <i class="fas fa-eye"></i> : <i class="fas fa-eye-slash"></i>} */}
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        ref={passwordRef}
                        placeholder="password"
                        aria-label="password"
                        type={visible ? "text" : "password"}
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>
                <div style={{ display: "flex", justifyContent: "center", }}>
                    <Button onClick={handleLogin} variant='primary' style={{ marginTop: "20px", }}>Login</Button>
                </div>
                <Modal show={regErr[0]} onHide={() => setRegErr([false, ""])} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{regErr[1]}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setRegErr([false,""])}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

const styles = {
    container: {
        width: '400px',
        background: 'rgba(82, 192, 192, 0.7)',
        padding: '10px',
        borderRadius: '15px',
        marginTop: '200px',
        height: '400px',
    },
    item: {
        margin: '15px 0'
    },
    background: {
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        background: "url(https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80) no-repeat center",
        backgroundSize: '100vw 100vh'
    }
}


let mapStateToProps = (props) => {
    return ({
        username: props.user.username,
        id: props.user.id
    })
}


export default connect(mapStateToProps, { login, logout })(Login)