import React, { useState, useRef, useEffect } from 'react'
import Axios from 'axios'
import {
    Button,
    Card,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'



export default function Products() {
    let renderCount = useRef(1)
    let [data, setData] = useState([])

    useEffect(() => {
        Axios.get("http://localhost:2000/products")
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => console.log(err))

        renderCount.current = renderCount.current + 1

    }, [])

    // console.log(data)
    console.log(`Products component rendered ${renderCount.current} times`)
    return (
        <div styles={{ padding: "50px", }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
                <h1 style={{width: "100vw",marginLeft:'40px'}}>Our Products</h1>
                {data.map((item, index) => {
                    return (
                        <Card key={index} style={{ width: '18rem', marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                            <Card.Img variant="top" src={item.images[1]} />
                            <Card.Body style={styles.cardBody}>
                                <Card.Title>{item.name}</Card.Title>
                                <h6>Price: IDR {item.price ? item.price.toLocaleString() : 0}</h6>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly', padding:"10px" }}>
                                    <Button variant="warning" >Wish List</Button>
                                    <Button variant="primary" as={Link} to={`/detail?id=${item.id}`}>Buy Now</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    )
                })}
            </div>
        </div>

    )
}

const styles = {
    cardBody: {
        // backgroundColor: 'lightgreen',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
}