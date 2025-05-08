import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Dashboardadmin from './Admin/Dashboard'
import Loginpage from './Login'
import Dashboardpekerja from './Pekerja/Dashboard'
import API from './Functions/API'
import lodash from 'lodash'
import Sidebar from './Components/Sidebar'
import Vadmin from './Admin/V_admin'
import Vpekerja from './Admin/V_pekerja'
import Daftarbuku from './Pekerja/Daftarbuku'
import Riwayat from './Pekerja/Riwayat'
import Buatpesanan from './Pekerja/Buatpesanan'

function App() {
const navto = useNavigate()
const location = useLocation();
const [loading, setLoading] = useState(true);
const [ρόλος , setρόλος] = useState('');

const getProfile = lodash.debounce(async () => {
  try{
    const resp = await API.get('/api/getprofile', {})
    if(resp.status !== 200){
      navto('/login', {replace: true})
    }
    else{
      sessionStorage.setItem('token', JSON.stringify(resp.data))
    }
  }catch(err){
    navto('/login', {replace: true})
  }
}, 200)

const checkRole = lodash.debounce(async (pathname) => {
    try {
      let token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (!token) return navto('/login');

      const parsedToken = JSON.parse(token);
      const role = parsedToken.role; 

      const resp = await API.get('/api/checkrole', {
        headers: {
          Authorization: `${role}`
        }
      });

      if (resp.status !== 200) {
        navto('/login', { replace: true });
      }else{
        setρόλος(role);
        if (pathname === '/') {
          if(role === 'admin'){
              navto('/Admin', { replace: true });
          }else if(role === 'pekerja'){
              navto('/Pekerja', { replace: true });
          }
        }else if(pathname.startsWith('/Admin')){
          if(role === 'pekerja'){
              navto('/Pekerja', { replace: true });
          }
        }else if(pathname.startsWith('/Pekerja')){
          if(role === 'admin'){
              navto('/Admin', { replace: true });
          }
        }
        else if(pathname.startsWith('/Home')){
          if(role === 'admin'){
              navto('/Admin', { replace: true });
          }else if(role === 'pekerja'){
              navto('/Pekerja', { replace: true });
          }
        }else{
          navto('/', { replace: true });
        }
        setLoading(false);
      }

    } catch (err) {
      navto('/login', { replace: true });
    }

}, 100);

useEffect(() => {
  getProfile();
}, []);

useEffect(() => {
  const { pathname } = location;

  checkRole(pathname);
}, [location]);


  return (
    <>
      <div>
        {loading ? 
        (  
        <div>Loading...</div>
        ) : (
        <div className='flex w-full h-screen '>
          <Sidebar role={ρόλος}/>
          <div className='w-full h-full '>
          <Routes>
            <Route path='/login' element={<Loginpage />}></Route>
            {/* Admin */}
            <Route path='/Admin' element={<Dashboardadmin />}></Route>
            <Route path='/Admin/admin' element={<Vadmin />}></Route>
            <Route path='/Admin/pekerja' element={<Vpekerja />}></Route>
            {/* Pekerja */}
            <Route path='/Pekerja' element={<Dashboardpekerja />}></Route>
            <Route path='/Pekerja/tasks' element={<Daftarbuku />}></Route>
            <Route path='/Pekerja/orders' element={<Buatpesanan />}></Route>
            <Route path='/Pekerja/history' element={<Riwayat />}></Route>
            {/* User */}
          </Routes>
          </div>
        </div>
        )}
      </div>
    </>
  )
}

export default App
