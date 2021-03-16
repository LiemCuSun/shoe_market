import React, { useState, useRef, useEffect } from 'react'
import Axios from 'axios'
import {
    Button,
    Modal
} from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel'
import { Redirect } from 'react-router-dom'

// import connect redux
import { connect } from "react-redux"




function DetailProducts(props) {
    console.log(props) // ini untuk liat component dari function DetailProducts(props) < harus ada props biar bisa diinspect
    let renderCount = useRef(1)
    renderCount.current = renderCount.current + 1

    let [data, setData] = useState([])
    let [ToLogin, setToLogin] = useState(false)
    let [ToCart, setToCart] = useState(false)
    let [cartErr, setCartErr] = useState(false)
    let [img, setImg] = useState([])
    let [inventory, setInventory] = useState({
        stock: '',
        selectedSize: null,
        size: 0,
    })
    let [Quantity, setQuantity] = useState({
        quantity: 0
    })

    useEffect(() => {
        Axios.get(`http://localhost:2000/products${props.location.search}`)
            .then((res) => {
                // console.log(res.data[0])
                setData(res.data[0])
                setImg(res.data[0].images)
            })
            .catch((err) => console.log(err))
    }, [inventory, props.location.search])

    function handleAddToChart() {
        if (!props.username) return setToLogin(true)
        console.log("logged in")

        if(inventory.total === 0 || inventory.stock === 0) return setCartErr(true)
        console.log("added item to cart")

        let cartData = {
            cartID: props.location.search,
            name: data.name,
            image: data.images,
            category: data.category,
            brand: data.brand,
            colour: data.colour,
            price: data.price,
            size: inventory.size,
            qty: Quantity.quantity,
            total: Quantity.quantity * data.price,
            stock: inventory.stock
        }
        // console.log(cartData)

        let tempCart = props.cart
        tempCart.push(cartData)

        Axios.patch(`http://localhost:2000/users/${props.id}`, {cart: tempCart})
        .then((res) => {
            console.log(res.data)
            setToCart(true)
            
        })
        .catch((err) => console.log(err))
    }

    if (ToLogin) return <Redirect to='/login' />
    if (ToCart) return <Redirect to='/cart' />

    // console.log(data)
    // console.log(img)
    console.log(`Detail products rendered ${renderCount.current} times`)
    // console.log(inventory.size)
    // console.log(props.id)
    return (
        <div style={{ marginTop: '90px', padding: "0 20px", }}>
            <h1>Product Details</h1>
            <div style={{ display: "flex", height: "40vh", }}>
                <div style={{ display: "flex", flexBasis: "40%", }}>
                    <Carousel>
                        {img.map((item, index) => {
                            return (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block w-100"
                                        src={item}
                                        alt="xxx"
                                    />
                                    <Carousel.Caption key={index}>
                                        <h4 style={{ background: 'rgba(82, 192, 192, 0.7)', borderRadius: '15px', }}>{data.name} - {index + 1}</h4>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            )
                        })}
                    </Carousel>
                </div>
                <div style={{ display: "flex", flexDirection: "column", flexBasis: "60%", padding: "0 20px" }}>
                    <h2>{data.name}</h2>
                    <h6>Category: {data.category}</h6>
                    <h6>Brand: {data.brand}</h6>
                    <h6>Colour: {data.colour}</h6>
                    <h6 style={{ padding: "10px", fontFamily: 'Sansita Swashed' }}>
                        "{data.description}"
                    </h6>
                    <h6>Price: IDR {data.price ? data.price.toLocaleString() : 0}</h6>
                    <div style={styles.adjust}>
                        <div style={{ marginRight: '50px' }}>
                            <h6>Available size : </h6>
                            <div>
                                {
                                    // NOTE penting ini supaya ga kosong pas di refresh
                                    (data.stock ? data.stock : []).map((item, index) => {
                                        return <Button
                                            key={index}
                                            variant='outlined'
                                            onClick={() => setInventory({ stock: item.total, selectedSize: index, size: item.code })}
                                            style={{
                                                backgroundColor: inventory.selectedSize === index ? '#130f40' : '#ffffff',
                                                color: inventory.selectedSize === index ? 'white' : 'black',
                                                border: '1px #130f40 solid'
                                            }}
                                        >{item.code}</Button>
                                    })
                                }
                            </div>
                            <h6>* available stock = {inventory.stock ? inventory.stock : '-'}</h6>
                        </div>
                        <div style={{ width: '30%', marginTop: "-20px" }}>
                            <h6>Quantity (Max Purchases {inventory.stock}) :</h6>
                            <div style={{ display: 'flex', borderRadius: '10px', backgroundColor: '#ffffff', justifyContent: 'space-between' }}>
                                <Button
                                    disabled={Quantity.quantity <= 0 ? true : false}
                                    onClick={() => setQuantity({quantity: Quantity.quantity - 1})}
                                    variant="danger"
                                > - </Button>
                                <h1 style={{ margin: "0 0" }}>{Quantity.quantity}</h1>
                                <Button
                                    disabled={Quantity.quantity >= inventory.stock ? true : false}
                                    onClick={() => setQuantity({quantity: Quantity.quantity + 1})}
                                    variant="primary"
                                > + </Button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Button onClick={handleAddToChart}>Add to Cart</Button>
                    </div>
                </div>
            </div>
            <Modal show={cartErr} onHide={() => setCartErr(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please choose one of size and quantity!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCartErr(false)}>
                        Okay
                            </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

const styles = {
    img1: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexBasis: '40%',
        borderRadius: '15px',
        backgroundColor: 'lightblue'
    },
    detail: {
        display: 'flex',
        flexDirection: 'column',
        flexBasis: '60%',
        backgroundColor: 'salmon',
        padding: '15px',
        borderRadius: '15px'
    },
    total: {
        display: 'flex',
        alignItems: 'center'
    },
    adjust: {
        display: 'flex',
        // alignItems: 'center'
    }
}

let mapStateToProps = (props) => {
    return ({
        username: props.user.username,
        cart: props.user.cart,
        id: props.user.id,
    })
}

export default connect(mapStateToProps)(DetailProducts)