import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Loginpage from './Login.jsx'
import Vadmin from './Admin/V_admin.jsx'
import Vpekerja from './Admin/V_pekerja.jsx'
import Dashboardadmin from './Admin/Dashboard.jsx'
import Dashboardpekerja from './Pekerja/Dashboard.jsx'
import Daftarbuku from './Pekerja/Daftarbuku.jsx'
import Buatpesanan from './Pekerja/Buatpesanan.jsx'
import Riwayat from './Pekerja/Riwayat.jsx'

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
