import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const Estimates = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData)
    : {
    EntryDate: "",
    Estimate: "",
    Customer: "",
    Description: "",
    Total: "",
    EstimateDate: "",
    DueDate: "",
    status: "", 
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
    EntryDate: "",
    Estimate: "",
    Customer: "",
    Description: "",
    Total: "",
    EstimateDate: "",
    DueDate: "",
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
  const Branchname = row.BranchName ? row.BranchName.toLowerCase() : '';
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
          <img src="/CRM/pages/Estimates.png" className="image-hover-effect" alt="Estimates" />
        </div>
        <h1 className='text-[2vw] text-[#E9278E]'>Estimates</h1>
      </div>
      <div className="h-[50vw]">
        <div className="bg-gray-400 w-[80vw] h-[3vw] flex flex-row overflow-y-auto px-[2vw] items-center">
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
          <button
            className="w-[2vw] bg-orange-500 mx-[0.5vw] rounded-md"
            onClick={handleRefresh}
          >
            <img src="/HRM/refresh.png" alt="Refresh" />
          </button>
          <button
            className="w-[2vw] bg-red-500 mx-[0.5vw] rounded-md"
            onClick={handleFilter}
          >
            <img src="/HRM/filter.png" alt="Filter" />
          </button>
          <button
            className="w-[2vw] bg-sky-500 mx-[0.5vw] rounded-md"
            onClick={handleExport}
          >
            <img src="/HRM/export.png" alt="Export" />
          </button>
        </div>
        <table className="w-[80vw] overflow-y-auto">
          <thead className="bg-gray-300 w-[80vw]">
            <tr className="w-[80vw]">
              <th className="border p-[0.5vw] text-[1vw]">RFQ No</th>
              <th className="border p-[0.5vw] text-[1vw]">Entry Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Estimate #</th>
              <th className="border p-[0.5vw] text-[1vw]">Customer/Lead</th>
              <th className="border p-[0.5vw] text-[1vw]">Description</th>
              <th className="border p-[0.5vw] text-[1vw]">Total</th>
              <th className="border p-[0.5vw] text-[1vw]">Estimate Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Due Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Status</th>
              <th className="border p-[0.5vw] text-[1vw]">Actions</th>
            </tr>
          </thead>
          <tbody className="rounded-lg bg-gray-100 w-[80vw] text-center">
          {filteredRows.map((row, index) => (
              <tr key={index}>
                <td className="text-[0.8vw] p-[0.4vw]">{index + 1}</td>
                <td className="text-[0.8vw] p-[0.4vw]">{row.EntryDate}</td>
                <td className="text-[0.8vw] p-[0.4vw]">{row.Estimate}</td>
                <td className="text-[0.8vw] p-[0.4vw]">{row.Customer}</td>
                <td className="text-[0.8vw] p-[0.4vw]">{row.Description}</td>
                <td className="text-[0.8vw] p-[0.4vw]">{row.Total}</td>
                <td className="text-[0.8vw] p-[0.4vw]">{row.EstimateDate}</td>
                <td className="text-[0.8vw] p-[0.4vw]">{row.DueDate}</td>
                <td className="text-[0.8vw] p-[0.4vw]">{row.status}</td>
                <td className="p-[0.1vw]">
                  <button
                    className="hover:bg-blue-500 p-2 rounded-full mb-2 mr-[0.6vw]"
                    onClick={() => handleEdit(index)}
                  >
                    <img src="/HRM/edit.png" className="w-[1.4vw]" alt="Edit" />
                  </button>
                  <button
                    className="hover:bg-red-500 p-2 rounded-full"
                    onClick={() => handleDelete(index)}
                  >
                    <img src="/HRM/Trash.png" className="w-[1.4vw]" alt="Delete"/>
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
            <img src="/HRM/form.png" alt="Add Estimate" />
          </button>
        </div>
      )}

      {isFormVisible && (
        <div className="w-[30vw] bg-white shadow-lg absolute right-0 z-10 top-0 overflow-y-auto rounded-lg ml-4 h-[35vw]">
          <div className="flex justify-between p-4">
            <button
              className="hover:bg-red-500  bg-white shadow-lg rounded-[0.7vw] text-white p-[1vw]"
              onClick={toggleFormVisibility}
            >
              <img src="/HRM/close.png" className="w-[1.4vw]" alt="Close Form" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="overflow-y-auto p-[1vw] ">
            <div className="mb-[0.3vw]">
              <label htmlFor="EntryDate" className="block mb-1">
                Entry Date:
              </label>
              <input
                type="date"
                id="EntryDate"
                name="EntryDate"
                value={formData.EntryDate}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="MM/DD/YYYY"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Estimate" className="block mb-1">
                Estimate #:
              </label>
              <input
                type="text"
                id="Estimate"
                name="Estimate"
                value={formData.Estimate}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Customer" className="block mb-1">
                Customer/Lead:
              </label>
              <input
                type="text"
                id="Customer"
                name="Customer"
                value={formData.Customer}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Description" className="block mb-1">
                Description:
              </label>
              <input
                type="text"
                id="Description"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Total" className="block mb-1">
                Total:
              </label>
              <input
                type="text"
                id="Total"
                name="Total"
                value={formData.Total}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="EstimateDate" className="block mb-1">
                Estimate Date:
              </label>
              <input
                type="date"
                id="EstimateDate"
                name="EstimateDate"
                value={formData.EstimateDate}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="MM/DD/YYYY"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="DueDate" className="block mb-1">
              Due Date:
              </label>
              <input
                type="date"
                id="DueDate"
                name="DueDate"
                value={formData.DueDate}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="MM/DD/YYYY"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="status" className="block mb-1">
                Status:
              </label>
              <select
                className="p-[1vw] text-[1vw] w-[13vw] rounded-md border"
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
              className="bg-[#E9278E] text-white p-2 rounded w-full"
            >
              {editIndex !== null ? "Edit" : "Add "}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Estimates;

