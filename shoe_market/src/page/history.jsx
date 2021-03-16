import React, { useState, useRef, useEffect } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions
} from '@material-ui/core'

import {
    Table,
} from 'react-bootstrap'

import HistoryIcon from '@material-ui/icons/History'
import InfoIcon from '@material-ui/icons/Info'

// import action
import { URL, getHistory } from '../action'


function History(props) {
    console.log(props)
    let renderCount = useRef(1)
    console.log(`History page rendered ${renderCount.current} times`)
    renderCount.current = renderCount.current + 1

    let [alert, setAlert] = useState(false)
    let [details, setDetails] = useState([])
    let history = props.getHistory

    useEffect(() => {
        Axios.get(URL + `/transaction_history?userid=${localStorage.id}`)
            .then(res => {
                console.log(res.data)
                history(res.data)
            })
            .catch(err => console.log(err))
    },[history])

    function handleInvoice () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return ' invoice: ' + Math.random().toString(36).substr(2, 9)
      }

    function handleClose() {
        setAlert(false)
    }

    function handleDetails(data) {
        setDetails(data)
        setAlert(true)
    }

    function renderTableHead() {
        return (
            <thead>
                <tr>
                    <td style={styles.tableHead}>No</td>
                    <td style={styles.tableHead}>Date</td>
                    <td style={styles.tableHead}>Total</td>
                    <td style={styles.tableHead}>Action</td>
                </tr>
            </thead>
        )
    }

    function renderTableContents() {
        return (
            props.history.map((item, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.date}{handleInvoice()}</td>
                    <td>IDR {item.total.toLocaleString()}</td>
                    <td>
                        <Button
                            startIcon={<InfoIcon />}
                            style={styles.details}
                            onClick={_ => handleDetails(item.products)}
                        >
                            Details
                    </Button>
                    </td>
                </tr>
            ))
        )
    }

    function renderDetails() {
        return (
            (details ? details : []).map((item, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        <img src={item.image[0]} width="70px" alt="product-img" />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.brand}</td>
                    <td>{item.colour}</td>
                    <td>IDR {item.price.toLocaleString()}</td>
                    <td>{item.size}</td>
                    <td>{item.qty}</td>
                </tr>
            ))
        )
    }


    if (!props.username) {
        return <Redirect to='/' />
    }

    return (
        <div style={styles.root}>
            <div style={styles.title}>
                <HistoryIcon fontSize="large" />
                <h1 style={styles.subTitle}>Transaction History</h1>
            </div>
            <Table style={{ backgroundColor: 'white' }}>
                {renderTableHead()}
                <tbody>
                    {renderTableContents()}
                </tbody>
            </Table>
            <Dialog
                open={alert}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={'md'}
            >
                <DialogContent style={{ margin: 0, padding: 0 }}>
                    <Table >
                        <thead>
                            <tr>
                                <td>No</td>
                                <td>Image</td>
                                <td>Product</td>
                                <td>Brand</td>
                                <td>Color</td>
                                <td>Price</td>
                                <td>Size</td>
                                <td>Quantity</td>
                            </tr>
                        </thead>
                        <tbody>
                            {renderDetails()}
                        </tbody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Ok
                        </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const styles = {
    root: {
        width: '100%',
        height: 'calc(100vh - 70px)',
        backgroundColor: '#f2f2f2',
        padding: '90px 10% 3% 10%'
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
    details: {
        color: '#130f40'
    },
    tableHead: {
        fontWeight: 600,
        fontSize: 17
    }
}

const mapStateToProps = (props) => {
    return {
        username: props.user.username,
        history: props.history
    }
}

export default connect(mapStateToProps, { getHistory })(History)