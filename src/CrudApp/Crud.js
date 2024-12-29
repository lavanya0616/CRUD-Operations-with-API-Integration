import React, { useState, useEffect } from 'react';
import "./Crud.css";

function Crud() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users`)
      .then((response) => response.json())
      .then((userData) => setData(userData))
      .catch((err) => console.log(err));
  }, []);

  function handleUserData() {
    const userName = name.trim();
    const userEmail = email.trim();
    const userAddress = address.trim();

    if (userName && userEmail && userAddress) {
      if (editUser) {
        fetch(`https://jsonplaceholder.typicode.com/users/${editUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            name: userName,
            email: userEmail,
            address: {
              city: userAddress,
            },
          }),
        })
          .then((res) => res.json())
          .then((updatedUser) =>
            setData(data.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
          );
        setEditUser(null);
      } else {
        fetch(`https://jsonplaceholder.typicode.com/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          body: JSON.stringify({
            name: userName,
            email: userEmail,
            address: {
              city: userAddress,
            },
          }),
        })
          .then((res) => res.json())
          .then((newUser) => setData([...data, newUser]));
      }
      setName('');
      setEmail('');
      setAddress('');
      setShowPopup(false);
    }
  }

  function handleEdit(user) {
    setName(user.name);
    setEmail(user.email);
    setAddress(user.address.city);
    setEditUser(user);
    setShowPopup(true);
  }

  function handleDeleteConfirmation(user) {
    setUserToDelete(user);
    setShowDeletePopup(true);
  }

  function handleDelete() {
    if (userToDelete) {
      fetch(`https://jsonplaceholder.typicode.com/users/${userToDelete.id}`, {
        method: 'DELETE',
      }).then(() => {
        setData(data.filter((predata) => predata.id !== userToDelete.id));
        setShowDeletePopup(false);
        setUserToDelete(null);
      });
    }
  }

  return (
    <div className='container'>
      <nav className="navbar">
        <h1>CRUD Operation Using ReactJs</h1>
        <button className="add-btn" onClick={() => setShowPopup(true)}>Add New User</button>
      </nav>

      {showPopup && (
        <div className='popup'>
          <div className='popup-content'>
            <h2>{editUser ? "Edit User" : "Add User"}</h2>
            <label>Enter User Name:</label>
            <input
              type='text'
              placeholder='Enter User Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <label>Enter User Email:</label>
            <input
              type='email'
              placeholder='Enter User Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <label>Enter User Address:</label>
            <input
              type='text'
              placeholder='Enter User Address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <br />
            <center>
            <button onClick={handleUserData}>{editUser ? "Update" : "Add"}</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
            </center>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className='popup'>
          <div className='popup-content'>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{userToDelete?.name}</strong>?</p>
            <center>
            <button onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white' }}>
              Yes, Delete
            </button>
            <button onClick={() => setShowDeletePopup(false)} style={{ backgroundColor: '#6c757d', color: 'white' }}>
              Cancel
            </button>
            </center>
          </div>
        </div>
      )}

      <table border={1}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>User Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address.city}</td>
              <td>
                <button id='editBtn' onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button id='deleteBtn' onClick={() => handleDeleteConfirmation(user)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Crud;