import axios from 'axios'
const apiBase = `http://${window.location.hostname}:3000`;

export default axios.create({
    baseURL: apiBase,
    headers: {
        'Content-type': 'application/json'
    },
    withCredentials: true
})


