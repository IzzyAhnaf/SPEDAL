/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaCheck } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import lodash from 'lodash';
import API from '@functions/API';

const Dashboardpekerja = () => {
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

      const resp = await API.post('/api/pekerjaubahprofil', body, {
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
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
    <div className='bg-[url("/g_perpus.jpg")] h-full flex items-center justify-center'>
      <div className="flex flex-col bg-white h-[95%] w-[98%] px-4 sm:px-8 md:px-16 rounded-md">
        <h1 className="text-3xl font-bold m-5 text-center">Profil Pekerja</h1>
        <div className="flex flex-col sm:flex-row sm:space-x-10 justify-center mt-5 w-full">

          {/* Data */}
          <div className="w-full space-y-3">

            <div className='flex justify-between p-3 gap-3 sm:flex-row flex-col w-full '>
              {/* Nama */}
              <div className='w-full'>
                <h2>Nama</h2>
                <div className="flex items-center justify-between space-x-2 w-full">
                  {editnama ? (
                    <>
                      <input
                        type="text"
                        className="outline-none border rounded px-2 py-1 w-full"
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
                      <p className="w-full py-1">{userdata.uname}</p>
                      <FaPencilAlt onClick={() => setEditnama(true)} className="cursor-pointer" />
                    </>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className='w-full'>
                <h2>Email</h2>
                <div className="flex items-center justify-between space-x-2 w-full">
                  <input type="text"
                  className="outline-none bg-gray-200 px-2 py-1 w-full rounded"
                  disabled
                  value={userdata.email}/>
                </div>
              </div>
            </div>

            <div className='w-full p-3'>
              {/* No. Telp */}
              <h2>No. Telp</h2>
              <div className="flex items-center justify-between space-x-2">
                {editnotelp ? (
                  <>
                    <input
                      type="text"
                      className="outline-none border rounded px-2 py-1 w-full"
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
                    <p className="w-full py-1">{userdata.notelp}</p>
                    <FaPencilAlt onClick={() => setEditnotelp(true)} className="cursor-pointer" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-[200px] mt-5 ml-auto">
          <button
            className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboardpekerja;
