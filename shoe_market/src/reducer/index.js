// import combineReducers from redux
import { combineReducers } from 'redux'

// import reducer
import userReducer from "./userReducer"


// combine all reducer
let allReducers = combineReducers ({
    user: userReducer,
})

export default allReducers