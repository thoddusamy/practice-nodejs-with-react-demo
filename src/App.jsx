import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);
  const [inputPassShown, setInputpassShown] = useState(false);

  let fetchData = async () => {
    try {
      let response = await axios.get('https://practice-nodejs-demo.herokuapp.com/students')
      setUsers(response.data); 
    } catch (error) {
      alert('Error!');
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!isEdit) {
          await axios.post('https://practice-nodejs-demo.herokuapp.com/student', values);
          fetchData();
          resetForm({ values: '' })
          setInputpassShown(false)
        } else {
          delete values._id
          await axios.put(`https://practice-nodejs-demo.herokuapp.com/student/${editUser._id}`, values);
          setIsEdit(false);
          fetchData();
          resetForm({ values: '' })
          setInputpassShown(false)
        }
      } catch (error) {
        alert('Error!');
      }
    }
  })

  let handleEdit = async (id) => {
    try {
      let getData = await axios.get(`https://practice-nodejs-demo.herokuapp.com/student/${id}`);
      formik.setValues(getData.data);
      setEditUser(getData.data)
      setIsEdit(true);
    } catch (error) {
      alert('Error!');
    }
  }

  let handleDelete = async (id) => {
    try {
      let confirmDelete = window.confirm('Are you sure to Delete?');
      if (confirmDelete) {
        await axios.delete(`https://practice-nodejs-demo.herokuapp.com/student/${id}`);
        fetchData();
      }
    } catch (error) {
      alert('Error!');
    }
  }

  let handlePassShown = () => {
    if (passwordShown == false) {
      setPasswordShown(true);
    } else {
      setPasswordShown(false);
    }
  }

  let handleInputPassShown = () => {
    inputPassShown == false ? setInputpassShown(true) : setInputpassShown(false);
  }

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-lg-6">
          <form onSubmit={formik.handleSubmit}>
            <label>Email:</label>
            <input type="text" name='email' value={formik.values.email} onChange={formik.handleChange}
              className='form-control' />
            <label>Password:</label>
            <div className='input-eye'>
              <input type={inputPassShown ? 'text' : "password"} name='password' value={formik.values.password} onChange={formik.handleChange}
                className='form-control' /> <span><i onClick={handleInputPassShown} className={inputPassShown ? 'fa-solid fa-eye' : "fa-solid fa-eye-slash"}></i></span>
            </div>
            <div className="col-lg-12 mt-2">
              <button className='btn btn-success' type='submit'>Submit</button>
            </div>
          </form>
        </div>
        <div className="col-lg-12 mt-4">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">id</th>
                <th scope="col">Email</th>
                <th scope="col">Password</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                users.map((item, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{item._id}</th>
                      <td>{item.email}</td>
                      <td><input className='eye-icon' type={passwordShown ? 'text' : "password"} value={item.password} readOnly />
                        <i style={{ cursor: 'pointer' }} onClick={handlePassShown} className={passwordShown ? 'fa-solid fa-eye' : "fa-solid fa-eye-slash"}></i></td>
                      <td>
                        <button className='btn btn-warning me-1' onClick={() => handleEdit(item._id)}>Edit</button>
                        <button className='btn btn-danger' onClick={() => handleDelete(item._id)}>Delete</button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
