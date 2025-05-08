import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaCheck } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { CgProfile } from 'react-icons/cg';
import lodash from 'lodash';
import API from '../Functions/API';

const Dashboardadmin = () => {
  const [userdata, setUserdata] = useState({});
  const [editdata, setEditdata] = useState({ uname: '', notelp: '' });
  const [editnama, setEditnama] = useState(false);
  const [editnotelp, setEditnotelp] = useState(false);
  const navto = useNavigate();

  const Send = lodash.debounce(async (num) => {
    try {
      const body = {};

      if (num === 1) {
        body.uname = editdata.uname;
        body.notelp = '-';
        body.status = 'uname';
      }

      if (num === 2) {
        body.uname = '-';
        body.notelp = editdata.notelp;
        body.status = 'notelp';
      }

      const resp = await API.post('/api/adminubahprofil', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (resp.status === 200) {
        if (num === 1) {
          setUserdata((prev) => ({ ...prev, uname: resp.data.finaldata }));
          setEditdata((prev) => ({ ...prev, uname: resp.data.finaldata }));

          const updatedToken = { ...JSON.parse(sessionStorage.getItem('token') || '{}'), uname: resp.data.finaldata };
          sessionStorage.setItem('token', JSON.stringify(updatedToken));
          if (localStorage.getItem('token')) {
            localStorage.setItem('token', JSON.stringify(updatedToken));
          }
        }
        if (num === 2) {
          setUserdata((prev) => ({ ...prev, notelp: resp.data.finaldata }));
          setEditdata((prev) => ({ ...prev, notelp: resp.data.finaldata }));

          const updatedToken = { ...JSON.parse(sessionStorage.getItem('token') || '{}'), finaldata: resp.data.finaldata };
          sessionStorage.setItem('token', JSON.stringify(updatedToken));
          if (localStorage.getItem('token')) {
            localStorage.setItem('token', JSON.stringify(updatedToken));
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, 200);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      const resp = await   API.get('/api/logout');
      if(resp.status === 200){ navto('/')}
    } catch (err) {

    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(token);
      setUserdata(decoded);
      setEditdata({
        uname: decoded.uname || '',
        notelp: decoded.notelp || '',
      });
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full w-full px-4 sm:px-8 md:px-16">
      <h1 className="text-3xl font-bold m-5">Dashboard Admin</h1>
      <CgProfile size={300} className="mb-5" />

      <div className="flex flex-col sm:flex-row sm:space-x-10 justify-center mt-5 w-full">
        {/* Label */}
        <div className="w-full sm:w-[200px] space-y-3">
          <p>Nama</p>
          <p>Email</p>
          <p>No. Telp</p>
        </div>

        {/* Data */}
        <div className="w-full sm:w-[250px] space-y-3">
          {/* Nama */}
          <div className="flex items-center justify-between space-x-2">
            {editnama ? (
              <>
                <input
                  type="text"
                  className="outline-none border px-2 py-1 w-full"
                  placeholder={userdata.uname || 'Nama'}
                  value={editdata.uname || ''}
                  onChange={(e) => setEditdata({ ...editdata, uname: e.target.value })}
                />
                <div className="flex space-x-2">
                  <FaCheck
                    onClick={() => {
                      Send(1);
                      setUserdata({ ...userdata, uname: editdata.uname });
                      setEditnama(false);
                    }}
                    className="cursor-pointer text-green-600"
                  />
                  <ImCross
                    onClick={() => setEditnama(false)}
                    className="cursor-pointer text-red-600"
                  />
                </div>
              </>
            ) : (
              <>
                <p className="w-full">{userdata.uname}</p>
                <FaPencilAlt onClick={() => setEditnama(true)} className="cursor-pointer" />
              </>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center justify-between">
            <p>{userdata.email}</p>
          </div>

          {/* No. Telp */}
          <div className="flex items-center justify-between space-x-2">
            {editnotelp ? (
              <>
                <input
                  type="text"
                  className="outline-none border px-2 py-1 w-full"
                  placeholder={userdata.notelp || 'Nomor Telp'}
                  value={editdata.notelp || ''}
                  onChange={(e) => setEditdata({ ...editdata, notelp: e.target.value })}
                />
                <div className="flex space-x-2">
                  <FaCheck
                    onClick={() => {
                      Send(2);
                      setUserdata({ ...userdata, notelp: editdata.notelp });
                      setEditnotelp(false);
                    }}
                    className="cursor-pointer text-green-600"
                  />
                  <ImCross
                    onClick={() => setEditnotelp(false)}
                    className="cursor-pointer text-red-600"
                  />
                </div>
              </>
            ) : (
              <>
                <p className="w-full">{userdata.notelp}</p>
                <FaPencilAlt onClick={() => setEditnotelp(true)} className="cursor-pointer" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full sm:w-[200px] mt-8">
        <button
          className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Keluar
        </button>
      </div>
    </div>
  );
};

export default Dashboardadmin;
