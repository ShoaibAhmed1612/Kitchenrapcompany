import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const DesignerActivities = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : {
      EntryDate: "",
      EmployeeName: '',
      CompanyName: '',
      CustomerName: '',
      StartTime: '',
      status: '',
      length: '',
      width: '',
      material: '',
      distance: '',
      quote: '',
      profilePic: '',
      sketch: '',
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

  const handleSketchChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      sketch: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const area = parseFloat(formData.length) * parseFloat(formData.width);
    const materialCost = formData.material === 'Material1' ? 10 : 20;
    const distanceCost = parseFloat(formData.distance) * 2;
    const quote = area * materialCost + distanceCost;

    if (editIndex !== null) {
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[editIndex] = { ...formData, quote };
        return updatedRows;
      });
      setEditIndex(null);
    } else {
      setRows((prevRows) => [...prevRows, { ...formData, quote }]);
    }

    setFormData({
      EntryDate: "",
      EmployeeName: '',
      CompanyName: '',
      CustomerName: '',
      StartTime: '',
      status: '',
      length: '',
      width: '',
      material: '',
      distance: '',
      quote: '',
      profilePic: '',
      sketch: '',
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
      doc.text(`${row.EmployeeName} - ${row.quote}`, 10, yPos);
    });
    doc.save('employee_table.pdf');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRows = rows.filter((row) => {
    const name = row.EmployeeName ? row.EmployeeName.toLowerCase() : '';
    const status = row.status ? row.status.toLowerCase() : '';
    if (filter === 'All') {
      return name.includes(searchTerm.toLowerCase());
    } else {
      return (
        status === filter.toLowerCase() &&
        name.includes(searchTerm.toLowerCase())
      );
    }
  });

  return (
    <div className="absolute shadow-xl w-[82vw] right-[1vw] rounded-md top-[4vw] h-[40vw]">
      <div className='flex flex-row m-[1vw] gap-[1vw] items-center image-hover-effect'>
        <div className='w-[3vw]'>
          <img src="/Sales/Salespages/Designer.png" className="image-hover-effect" alt="Leave" />
        </div>
        <h1 className=' text-[2vw] text-[#E9278E]'>Designer Activities</h1>
      </div>
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
              <th className="border p-[0.5vw] text-[1vw]">Entry Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Employee Name</th>
              <th className="border p-[0.5vw] text-[1vw]">Company Name</th>
              <th className="border p-[0.5vw] text-[1vw]">Customer Name</th>
              <th className="border p-[0.5vw] text-[1vw]">Start Time</th>
              <th className="border p-[0.5vw] text-[1vw]">Length</th>
              <th className="border p-[0.5vw] text-[1vw]">Width</th>
              <th className="border p-[0.5vw] text-[1vw]">Material</th>
              <th className="border p-[0.5vw] text-[1vw]">Distance</th>
              <th className="border p-[0.5vw] text-[1vw]">Status</th>
              <th className="border p-[0.5vw] text-[1vw]">Width</th>
              <th className="border p-[0.5vw] text-[1vw]">Actions</th>
            </tr>
          </thead>
          <tbody className="rounded-lg bg-gray-100 w-[80vw] text-center">
            {filteredRows.map((row, index) => (
              <tr key={index}>
                <td className="p-[1.5vw]">{index + 1}</td>
                <td className="p-[1.5vw]">{row.EntryDate}</td>
                <td className="p-[1.5vw]">{row.EmployeeName}</td>
                <td className='p-[1.5vw]'>{row.CompanyName}</td>
                <td className='p-[1.5vw]'>{row.CustomerName}</td>
                <td className='p-[1.5vw]'>{row.StartTime}</td>
                <td className='p-[1.5vw]'>{row.length}</td>
                <td className='p-[1.5vw]'>{row.width}</td>
                <td className='p-[1.5vw]'>{row.material}</td>
                <td className='p-[1.5vw]'>{row.distance}</td>
                <td className='p-[1.5vw]'>{row.status}</td>
                <td className='p-[1.5vw]'>{row.quote}</td>
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
            className="w-[4vw] p-2 rounded"
            onClick={toggleFormVisibility}>
            <img src="/HRM/form.png" className='w-[2vw]' alt="" />
          </button>
        </div>
      )}

      {isFormVisible && (
        <div className="w-[26vw] bg-white shadow-2xl absolute right-0 z-10 top-[0vw] overflow-y-auto rounded-lg ml-4 h-[32vw]">
          <div className="flex justify-between p-4">
            <button
              className="hover:bg-red-500 h-[2vw] shadow-lg rounded-md text-white p-[0.3vw]"
              onClick={toggleFormVisibility}
            >
              <img src="/HRM/close.png" className='w-[2vw]' alt="" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="overflow-y-auto p-[1vw]">
            <div className="mb-[0.3vw]">
              <label htmlFor="EntryDate" className="block mb-[0.3vw] text-[1vw]">
                Entry Date:
              </label>
              <input
                type="date"
                id="EntryDate"
                name="EntryDate"
                value={formData.EntryDate}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="EmployeeName" className="block mb-[0.3vw] text-[1vw]">
                Employee Name:
              </label>
              <input
                type="text"
                id="EmployeeName"
                name="EmployeeName"
                value={formData.EmployeeName}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="CompanyName" className="block mb-[0.3vw] text-[1vw]">
                Company Name:
              </label>
              <input
                type="text"
                id="CompanyName"
                name="CompanyName"
                value={formData.CompanyName}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="CustomerName" className="block mb-[0.3vw] text-[1vw]">
                Customer Name:
              </label>
              <input
                type="text"
                id="CustomerName"
                name="CustomerName"
                value={formData.CustomerName}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="StartTime" className="block mb-[0.3vw] text-[1vw]">
                Start Time:
              </label>
              <input
                type="datetime-local"
                id="StartTime"
                name="StartTime"
                value={formData.StartTime}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="length" className="block mb-[0.3vw] text-[1vw]">
                Length:
              </label>
              <input
                type="text"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="width" className="block mb-[0.3vw] text-[1vw]">
                Width:
              </label>
              <input
                type="text"
                id="width"
                name="width"
                value={formData.width}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="material" className="block mb-[0.3vw] text-[1vw]">
                Material:
              </label>
              <select
                id="material"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              >
                <option value="Material1">Iron</option>
                <option value="Material2">Wood</option>
                <option value="Material2">Aluminium</option>
              </select>
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="distance" className="block mb-[0.3vw] text-[1vw]">
                Distance:
              </label>
              <input
                type="text"
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="status" className="block mb-[0.3vw] text-[1vw]">
                Status:
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-[#E9278E] mt-[0.5vw] text-white p-2 rounded w-full"
            >
              {editIndex !== null ? "Edit" : "Add"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DesignerActivities;
