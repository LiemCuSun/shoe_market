export let login = (data) => {
    return {
        type: "LOG_IN",
        payload: data
    }
}

export let logout = () => {
    return {
        type: "LOG_OUT"
    }
}