import React, { useState, useRef, useEffect } from 'react'
import Axios from 'axios'
import {
    Button
} from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel'




export default function DetailProducts(props) {
    console.log(props)
    let renderCount = useRef(1)
    let [data, setData] = useState([])
    let [img, setImg] = useState([])
    let [inventory, setInventory] = useState({
        stock: 0,
        selectedSize: null,
        size: null,
        total: 0
    })

    let optionStock = useRef('')
    console.log(optionStock)

    useEffect(() => {
        Axios.get(`http://localhost:2000/products${props.location.search}`)
            .then((res) => {
                console.log(res.data[0])
                setData(res.data[0])
                setImg(res.data[0].images)
                renderCount.current = renderCount.current + 1
            })
            .catch((err) => console.log(err))
    }, [inventory, props.location.search])

    console.log(data)
    console.log(img)
    console.log(`Detail products rendered ${renderCount.current} times`)
    return (
        <div style={{ marginTop: '90px', padding: "0 20px", }}>
            <h1>Product Details</h1>
            <div style={{ display: "flex", height: "40vh", }}>
                <div style={{ display: "flex", flexBasis: "40%", }}>
                    {/* <Image src={img} style={{width:"100%"}} rounded />  */}
                    <Carousel>
                        {img.map((item, index) => {
                            return (
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src={item}
                                        alt="xxx"
                                    />
                                    <Carousel.Caption>
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
                    {/* <h6>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlSelect1" style={{ width: "150px" }}>
                                <Form.Label >Size available:</Form.Label>
                                <Form.Control as="select">
                                    {stock.map((item, index) => {
                                        return (
                                            <>
                                                <option key={index} value={item.total} >{item.code}</option>
                                            </>
                                        )
                                    })}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </h6> */}
                    <div style={styles.adjust}>
                        <div style={{ marginRight: '50px' }}>
                            <h6>Available size : </h6>
                            <div>
                                {
                                    (data.stock ? data.stock : []).map((item, index) => {
                                        return <Button
                                            key={index}
                                            variant='outlined'
                                            onClick={() => setInventory({ stock: item.total, selectedSize: index, size: item.code, total: 0 })}
                                            style={{
                                                backgroundColor: inventory.selectedSize === index ? '#130f40' : '#ffffff',
                                                color: inventory.selectedSize === index ? 'white' : 'black',
                                                border: '1px #130f40 solid'
                                            }}
                                        >{item.code}</Button>
                                    })
                                }
                            </div>
                            <h6>{inventory.stock ? `* available stock = ${inventory.stock}` : ''}</h6>
                        </div>
                        <div style={{ width: '30%' }}>
                            <h6>Total: (Max Purchases {inventory.stock})</h6>
                            <div style={{ display: 'flex', borderRadius: '10px', backgroundColor: '#ffffff', justifyContent: 'space-between' }}>
                                <Button
                                    disabled={inventory.total <= 0 ? true : false}
                                    onClick={() => setInventory({ total: inventory.total - 1 })}
                                    variant="danger"
                                > - </Button>
                                <h1 style={{margin:"0 0"}}>{inventory.total}</h1>
                                <Button
                                    disabled={inventory.total >= inventory.stock ? true : false}
                                    onClick={() => setInventory({ total: inventory.total + 1 })}
                                    variant="primary"
                                > + </Button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Button >Add to Cart</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// NOTE: 
// -menu untuk pilih size
// -menu untuk jumlah pembelian
// -tombol checkout

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