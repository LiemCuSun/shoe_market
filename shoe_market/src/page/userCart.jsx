import React, { useState, useRef, useEffect } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import {
    Button,
    IconButton
} from '@material-ui/core'
import {
    Table,
} from 'react-bootstrap'

import DeleteIcon from '@material-ui/icons/Delete'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import ClearIcon from '@material-ui/icons/Clear'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'

import { Redirect } from 'react-router-dom'
import { URL } from '../action/helper'
import Alert from '../component/alert'
import { login } from '../action'


//NOTE tombol edit quantity harus dikasih control total stock

function UserCart(props) {
    console.log(props)
    let [alert, setAlert] = useState(false)
    let [selectedIndex, setSelectedIndex] = useState(null)
    let [qty, setQty] = useState({
        qty: null
    })
    

    let renderCount = useRef(1)
    useEffect(() => {
        renderCount.current = renderCount.current + 1
    })
    console.log(`User cart rendered ${renderCount.current} times`)

    function handleDelete(index) {
        console.log(index)
        let tempCart = props.cart
        tempCart.splice(index, 1)

        // update database
        Axios.patch(URL + `/users/${props.id}`, { cart: tempCart })
            .then(res => {
                setSelectedIndex(null)
                setQty({ qty: null })
                Axios.get(URL + `/users/${props.id}`)
                    .then((res) => props.login(res.data))
                    .catch((err) => console.log(err))
            })
            .catch(err => console.log(err))
    }

    function handleEdit(index, qty) {
        setSelectedIndex(index)
        setQty({ qty: qty })
    }

    function handleCancel() {
        setSelectedIndex(null)
    }

    function handleDone() {
        console.log('function handle done executed')
        let tempCart = props.cart
        tempCart[selectedIndex].qty = qty.qty
        tempCart[selectedIndex].total = qty.qty * tempCart[selectedIndex].price

        // update database
        Axios.patch(URL + `/users/${props.id}`, { cart: tempCart })
            .then(res => {
                setSelectedIndex(null)
                setQty({ qty: null })
            })
            .catch(err => console.log(err))
    }

    function handleCheckOut() {
        if (props.cart.length === 0) return
        setAlert(true)
    }



    // function hanldeOk() {
    //     let history = {
    //         userId: props.id,
    //         date: new Date().toLocaleString(),
    //         total: props.cart.map(item => item.total).reduce((a, b) => a + b),
    //         transactions: props.cart
    //     }
    //     // console.log(history)

    //     // update database
    //     Axios.post(URL + '/transaction_histories', history)
    //         .then(res => {

    //             // delete user cart
    //             Axios.patch(URL + `/users/${props.id}`, { cart: [] })
    //                 .then(res => {
    //                     props.login()
    //                     setAlert(false)
    //                 })
    //         })
    //         .catch(err => console.log(err))
    // }

    function renderTableHead() {
        return (
            <thead style={{ textAlign: "center" }}>
                <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Size</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
        )
    }

    if (!props.username) return <Redirect to='/login' />
    return (
        <div style={styles.root}>
            <div style={styles.title}>
                <h1 style={styles.subTitle}><i className="fas fa-shopping-cart"></i> User Cart</h1>
            </div>
            <Table responsive striped bordered hover variant= 'light' style={{borderRadius:"15px",background: 'rgba(82, 192, 192, 0.5)'}}>
                {renderTableHead()}
                <tbody>
                    {
                        // NOTE penting ini supaya pas refresh ga error
                        (props.cart ? props.cart : []).map((item, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td style={{ textAlign: "center" }}>{item.name}</td>
                            <td style={{ backgroundColor:"white" }}>
                                <img src={item.image[0]} width="120px" alt="product-img" />
                            </td>
                            <td style={{ textAlign: "center" }}>{item.brand}</td>
                            <td style={{ textAlign: "center" }}>IDR {(item.price).toLocaleString()}</td>
                            <td style={{ textAlign: "center" }}>{item.size}</td>
                            <td style={{ textAlign: "center" }}>
                                {
                                    selectedIndex === index ?
                                        <div style={styles.qty}>
                                            <IconButton disabled={qty.qty === 0 ? true : false} onClick={() => setQty({ qty: qty.qty - 1 })}>
                                                <RemoveCircleIcon />
                                            </IconButton>
                                            <h5 style={styles.qtyInfo}>{qty.qty}</h5>
                                            <IconButton disabled={qty.qty >= item.stock ? true : false} onClick={() => setQty({ qty: qty.qty + 1 })}>
                                                <AddCircleIcon />
                                            </IconButton>
                                        </div>
                                        :
                                        item.qty
                                }
                            </td>
                            <td style={{ textAlign: "center" }}>
                                {
                                    selectedIndex === index ?
                                        `IDR ${(item.price * qty.qty).toLocaleString()}` : `IDR ${(item.total).toLocaleString()}`
                                }
                            </td>
                            <td>
                                {
                                    selectedIndex === index ?
                                        <>
                                            <Button
                                                startIcon={<DoneIcon />}
                                                color="primary"
                                                onClick={handleDone}
                                            >
                                                Done
                            </Button>
                                            <Button
                                                startIcon={<ClearIcon />}
                                                color="primary"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                            </Button>
                                        </>
                                        :
                                        <>
                                            <Button
                                                startIcon={<EditIcon />}
                                                color="primary"
                                                onClick={() => handleEdit(index, item.qty)}
                                            >
                                                Edit
                            </Button>
                                            <Button
                                                startIcon={<DeleteIcon />}
                                                color="secondary"
                                                onClick={() => handleDelete(index)}
                                            >
                                                Delete
                            </Button>
                                        </>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* <h6>Price: IDR {props.price ? data.price.toLocaleString() : 0}</h6> */}
            <Button
                variant="contained"
                style={styles.checkOutButton}
                startIcon={<CreditCardIcon />}
                onClick={handleCheckOut}
            >
                Check Out
                </Button>
            <Alert
                open={alert}
                title="Are you sure to check out and finish transaction ?"
                handleClose={_ => setAlert(false)}
            // handleOk={hanldeOk}
            />
        </div>
    )
}


const styles = {
    root: {
        width: '100%',
        height: 'calc(100vh - 70px)',
        backgroundColor: '#f2f2f2',
        padding: '90px 10% 3% 10%',
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        margin: '2% 0px',
        color: '#130f40'
    },
    subTitle: {
        marginLeft: '1%'
    },
    deleteButton: {
        color: 'white',
        borderRadius: 0,
        padding: '10px 20px'
    },
    checkOutButton: {
        backgroundColor: '#130f40',
        color: 'white',
        borderRadius: 0,
        width: '20%',
        alignSelf: 'flex-end',
        marginTop: '3%'
    },
    tableHead: {
        fontWeight: 600,
        fontSize: 17
    },
    qty: {
        display: 'flex',
        alignItems: 'center'
    },
    qtyInfo: {
        margin: '0px 20px'
    }
}

let mapStateToProps = (props) => {
    return ({
        username: props.user.username,
        cart: props.user.cart,
        id: props.user.id
    })
}

export default connect(mapStateToProps, { login })(UserCart)