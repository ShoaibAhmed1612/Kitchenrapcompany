import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const ManageLeave = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : {
      profilePic: null,
      name: '',
      job: '',
      approvedBy: '', // Changed from 'approved' to 'approvedBy'
      shift: '',
      department: '',
      status: '',
    };
  });

  const [isFormVisible, setFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [srNo, setSrNo] = useState(() => {
    const savedSrNo = localStorage.getItem('srNo');
    return savedSrNo ? parseInt(savedSrNo) : 1;
  });
  const [rows, setRows] = useState(() => {
    const savedRows = localStorage.getItem('rows');
    return savedRows ? JSON.parse(savedRows) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('rows', JSON.stringify(rows));
  }, [rows]);

  useEffect(() => {
    localStorage.setItem('srNo', srNo.toString());
  }, [srNo]);

  const addEmployee = () => {
    const newEmployee = {
      id: srNo,
      name: `Employee ${srNo}`,
    };
    setRows([...rows, newEmployee]);
    setSrNo(srNo + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profilePic: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[editIndex] = formData;
        return updatedRows;
      });
      setEditIndex(null);
    } else {
      setRows((prevRows) => [...prevRows, formData]);
    }

    setFormData({
      profilePic: null,
      name: "",
      job: "",
      approvedBy: "", // Changed from 'approved' to 'approvedBy'
      shift: "",
      department: "",
      status: "",
    });

    setFormVisible(false);
  };

  const handleDelete = (index) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    const employeeToEdit = rows[index];
    setFormData(employeeToEdit);
    setEditIndex(index);
    setFormVisible(true);
  };

  const toggleFormVisibility = () => {
    setFormVisible((prevVisibility) => !prevVisibility);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleFilter = () => {
    if (filter === 'Active') {
      setRows((prevRows) => prevRows.filter((row) => row.status === 'Active'));
    } else if (filter === 'Inactive') {
      setRows((prevRows) => prevRows.filter((row) => row.status === 'Inactive'));
    }
  };

  const handleExport = () => {
    const doc = new jsPDF();
    rows.forEach((row, index) => {
      const yPos = 10 + (index * 10);
      doc.text(`${row.name} - ${row.code}`, 10, yPos);
    });
    doc.save('employee_table.pdf');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRows = rows.filter((row) => {
    if (filter === 'All') {
      return row.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return (
        row.status === filter &&
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  return (
    <div className="absolute shadow-xl right-[1vw] rounded-md top-[4vw] h-[40vw]">
      <div className="h-[50vw]">
        <div className="bg-gray-400 w-[80vw] h-[3vw] flex flex-row px-[2vw] items-center"> 
          <input
            className="p-[0.3vw] w-[18vw] text-[1vw] rounded-md mx-[1vw]"
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            className="p-[0.5vw] text-[1vw] w-[13vw] rounded-md mx-[1vw]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="w-[2vw] bg-orange-500 mx-[0.5vw] rounded-md" onClick={handleRefresh}>
            <img src="/HRM/refresh.png" alt="" />
          </button>
          <button className="w-[2vw] bg-red-500 mx-[0.5vw] rounded-md" onClick={handleFilter}>
            <img src="/HRM/filter.png" alt="" />
          </button>
          <button className="w-[2vw] bg-sky-500 mx-[0.5vw] rounded-md" onClick={handleExport}>
            <img src="/HRM/export.png" alt="" />
          </button>
        </div>
        <table className="w-[80vw] overflow-y-auto">
          <thead className="bg-gray-300 w-[80vw]">
            <tr className="w-[80vw]">
              <th className="border p-[0.5vw] text-[1vw]">Sr no</th>
              <th className="border p-[0.5vw] text-[1vw]">Picture</th>
              <th className="border p-[0.5vw] text-[1vw]">Name</th>
              <th className="border p-[0.5vw] text-[1vw]">Approved by</th>
              <th className="border p-[0.5vw] text-[1vw]">Shift</th>
              <th className="border p-[0.5vw] text-[1vw]">Leave type</th>
              <th className="border p-[0.5vw] text-[1vw]">Status</th>
              <th className="border p-[0.5vw] text-[1vw]">Actions</th>
            </tr>
          </thead>
          <tbody className="rounded-lg bg-gray-100 w-[80vw] text-center">
            {filteredRows.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {row.profilePic ? (
                    <img
                      src={URL.createObjectURL(row.profilePic)}
                      alt="Profile"
                      width={50}
                      height={50}
                      className="rounded-full ml-[2vw]"
                    />
                  ) : (
                    <img src="/HRM/profile.png" className="w-[2vw] mx-auto" alt="" />
                  )}
                </td>
                <td className="p-[1.5vw]">{row.name}</td>
                <td className="p-[1.5vw]">
                  <input
                    type="text"
                    value={row.approvedBy}
                    onChange={(e) => handleChange({ target: { name: 'approvedBy', value: e.target.value } })}
                    className="border p-[0.5vw] rounded w-[10vw] h-[2.5vw]"
                  />
                </td>
                <td>
                  <select
                    className="p-[1vw] text-[1vw] w-[13vw] rounded-md border"
                    value={row.shift}
                    onChange={(e) => handleChange({ target: { name: 'shift', value: e.target.value } })}
                  >
                    <option value="Morning">Morning</option>
                    <option value="Night">Night</option>
                  </select>
                </td>
                <td>
                  <select
                    className="p-[1vw] text-[1vw] w-[13vw] rounded-md mx-[1vw]"
                    value={row.department}
                    onChange={(e) => handleChange({ target: { name: 'department', value: e.target.value } })}
                  >
                    <option value="salesman">Annual Leave</option>
                    <option value="Site Inspector">Unpaid Leave</option>
                    <option value="Sales Manager">Sick Leave</option>
                  </select>
                </td>
                <td>
                  <select
                    className="p-[1vw] text-[1vw] w-[13vw] rounded-md border"
                    value={row.status}
                    onChange={(e) => handleChange({ target: { name: 'status', value: e.target.value } })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td className="p-[0.1vw]">
                  <button
                    className="hover:bg-blue-500 p-2 rounded-full mb-2 mr-[0.6vw]"
                    onClick={() => handleEdit(index)}
                  >
                    <img src="/HRM/edit.png" className="w-[1.4vw]" alt="" />
                  </button>
                  <button
                    className="hover:bg-red-500 p-2 rounded-full"
                    onClick={() => handleDelete(index)}
                  >
                    <img src="/HRM/Trash.png" className="w-[1.4vw]" alt="" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isFormVisible && (
        <div className="absolute bottom-4 left-4">
          <button
            className="w-[4vw] text-white p-2 rounded"
            onClick={toggleFormVisibility}
          >
            <img src="/HRM/form.png" alt="" />
          </button>
        </div>
      )}

      {isFormVisible && (
        <div className="w-[26vw] bg-white shadow-2xl absolute right-0 z-10 top-[0vw] overflow-y-auto rounded-lg ml-4 h-[32vw]">
          <div className="flex justify-between p-4">
            <button
              className="hover:bg-red-500 w-[2vw] bg-white  shadow-lg rounded-md text-white p-[0.3vw]"
              onClick={toggleFormVisibility}
            >
              <img src="/HRM/close.png" alt="" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="overflow-y-auto  p-[1vw] ">
            <div className="mb-[0.3vw]">
              <label htmlFor="profilePic" className="block mb-[0.3vw] text-[1vw]">
                Picture:
            </label>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="name" className="block mb-[0.3vw] text-[1vw]">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="approvedBy" className="block mb-[0.3vw] text-[1vw]"> {/* Changed 'code' to 'approvedBy' */}
                Approved by:
              </label>
              <input
                type="text"
                id="approvedBy"
                name="approvedBy"
                value={formData.approvedBy}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="shift" className="block mb-[0.3vw] text-[1vw]">
                Shift:
              </label>
              <select
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
                id="shift"
                name="shift"
                value={formData.shift}
                onChange={handleChange}
              >
                <option value="Morning">Morning</option>
                <option value="Night">Night</option>
              </select>
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="department" className="block mb-[0.3vw] text-[1vw]">
                Department:
              </label>
              <select
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="salesman">Annual Leave</option>
                <option value="Site Inspector">Unpaid Leave</option>
                <option value="Sales Manager">Sick Leave</option>
              </select>
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="status" className="block mb-[0.3vw] text-[1vw]">
                Status:
              </label>
              <select
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-[#E9278E] mt-[0.5vw] text-white p-2 rounded w-full"
            >
              {editIndex !== null ? "Edit Employee" : "Add Employee"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ManageLeave;
