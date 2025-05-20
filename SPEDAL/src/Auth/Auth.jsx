import { useNavigate } from "react-router-dom"
import API from "../Functions/API"
import {useEffect, useState } from "react"
import lodash from 'lodash'

const Authpage = ({type}) => {
    const [userdata, setUserdata] = useState([])
    const [error, setError] = useState([])
    const navto = useNavigate()
    const Send = async () => {
        try {
          const body = {
            username: userdata.username,
            password: userdata.password,
            email: userdata.email,
            notelp: userdata.notelp,
          };
      
          const resp = await API.post(`/api/${type}`, body);
          if(resp.status === 200){
            sessionStorage.setItem('token', JSON.stringify({
              uname: resp.data.uname,
              email: resp.data.email,
              notelp: resp.data.notelp,
              role: resp.data.role
            }))
          }
          navto('/')
        } catch (err) {
          setError('Kesalahan user atau password')
        }
    };

    const getProfile = lodash.debounce(async () => {
      try{
        const resp = await API.get('/api/getprofile', {})
        if(resp.status === 200){
          sessionStorage.setItem('token', JSON.stringify(resp.data))
          navto('/', {replace: true})
        }
      }catch(err){
        
      }
    }, 200)

    useEffect(() => {
      getProfile()
    }, [])
      
    return (
        <div className="flex items-center justify-center bg-[] min-h-screen px-4">
          <div className="bg-white w-full max-w-sm md:max-w-md lg:max-w-lg p-6 rounded shadow">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
              {type === "login" ? "Login" : "Register"}
            </h1>
    
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">
                  {type === "login"
                    ? "Username / Email / No Telp"
                    : "Username"}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="Username"
                  onChange={(e) =>
                    setUserdata({ ...userdata, username: e.target.value })
                  }
                />
              </div>
    
              {type === "register" && (
                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded p-2"
                    placeholder="Email"
                    onChange={(e) =>
                      setUserdata({ ...userdata, email: e.target.value })
                    }
                  />
                </div>
              )}
    
              <div>
                <label className="block font-semibold mb-1">Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="Password"
                  onChange={(e) =>
                    setUserdata({ ...userdata, password: e.target.value })
                  }
                />
              </div>
    
              {type === "register" && (
                <div>
                  <label className="block font-semibold mb-1">No Telp</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2"
                    placeholder="No Telp"
                    onChange={(e) =>
                      setUserdata({ ...userdata, notelp: e.target.value })
                    }
                  />
                </div>
              )}

              <button
                className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition"
                onClick={Send}
              >
                {type === "login" ? "Login" : "Register"}
              </button>
            </div>
          </div>
        </div>
      );
}

export default Authpage