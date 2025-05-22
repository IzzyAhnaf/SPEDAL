import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Loginpage from './Pages/Login.jsx'
import Dashboardadmin from './Pages/Admin/Dashboard.jsx'
import Dashboardpekerja from './Pages/Pekerja/Dashboard.jsx'
import Vadmin from './Pages/Admin/Daftaradmin.jsx'
import Vpekerja from './Pages/Admin/Daftarpekerja.jsx'
import Daftarbuku from './Pages/Pekerja/Daftarbuku.jsx'
import Buatpesanan from './Pages/Pekerja/Buatpesanan.jsx'
import Riwayat from './Pages/Pekerja/Riwayat.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/Admin',
        element: <Dashboardadmin />,
        children: [
          {
            path: '/Admin/admin',
            element: <Vadmin />,
          },
          {
            path: '/Admin/pekerja',
            element: <Vpekerja />,
          },
        ]
      },
      {
        path: '/Pekerja',
        element: <Dashboardpekerja />,
        children: [
          {
            path: '/Pekerja/tasks',
            element: <Daftarbuku />,
          },
          {
            path: '/Pekerja/orders',
            element: <Buatpesanan />,
          },
          {
            path: '/Pekerja/history',
            element: <Riwayat />,
          },
        ]
      }
    ]
  },
  {
    path: '/login',
    element: <Loginpage />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
