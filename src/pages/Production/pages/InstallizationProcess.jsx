import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const InstallizationProcess = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData
      ? JSON.parse(savedData)
      : {
          EntryDate: "",
          RequestedBy: "",
          BranchName: "",
          CustomerName: "",
          Contract: "",
          JobType: "",
          Jobno: "",
          InstallationDate: "",
          ActionDate: "",
          ProductionOrder: "",
          ProductionOrderby: "",
          Notes: "",
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
      RequestedBy: "",
      BranchName: "",
      CustomerName: "",
      Contract: "",
      JobType: "",
      Jobno: "",
      InstallationDate: "",
      ActionDate: "",
      ProductionOrder: "",
      ProductionOrderby: "",
      Notes: "",
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
    // Filter logic here
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
    const name = row.BranchName ? row.BranchName.toLowerCase() : ''; // Corrected variable name
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
      <img src="/production/process.png" className="image-hover-effect" alt="Leave" />
      </div>
      <h1 className=' text-[2vw] text-[#E9278E]'>Installation Process</h1>
      </div>
      <div className="h-[50vw]">
        <div className="bg-gray-400 w-[80vw] h-[3vw] flex flex-row px-[2vw] items-center">
          <input
            className="p-[0.3vw] w-[18vw] text-[1vw] rounded-md mx-[1vw]"
            type="text"
            placeholder="Search by Branch name"
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
            <img src="/HRM/refresh.png" alt="" />
          </button>
          <button
            className="w-[2vw] bg-red-500 mx-[0.5vw] rounded-md"
            onClick={handleFilter}
          >
            <img src="/HRM/filter.png" alt="" />
          </button>
          <button
            className="w-[2vw] bg-sky-500 mx-[0.5vw] rounded-md"
            onClick={handleExport}
          >
            <img src="/HRM/export.png" alt="" />
          </button>
        </div>
        <table className="w-[80vw] overflow-y-auto">
          <thead className="bg-gray-300 w-[80vw]">
            <tr className="w-[80vw]">
              <th className="border p-[0.5vw] text-[1vw]">Sr no</th>
              <th className="border p-[0.5vw] text-[1vw]">Entry Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Requested By</th>
              <th className="border p-[0.5vw] text-[1vw]">Branch Name</th>
              <th className="border p-[0.5vw] text-[1vw]">Customer Name</th>
              <th className="border p-[0.5vw] text-[1vw]">Contract</th>
              <th className="border p-[0.5vw] text-[1vw]">Job Type</th>
              <th className="border p-[0.5vw] text-[1vw]">Job no</th>
              <th className="border p-[0.5vw] text-[1vw]">Installation Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Action Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Production Order</th>
              <th className="border p-[0.5vw] text-[1vw]">Production Order by</th>
              <th className="border p-[0.5vw] text-[1vw]">Notes</th>
              <th className="border p-[0.5vw] text-[1vw]">Actions</th>
            </tr>
          </thead>
          <tbody className="rounded-lg bg-gray-100 w-[80vw] text-center">
            {filteredRows.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row.EntryDate}</td>
                <td>{row.RequestedBy}</td> {/* Display Requested By */}
                <td>{row.BranchName}</td> {/* Display Branch Name */}
                <td>{row.CustomerName}</td> {/* Display Customer Name */}
                <td>{row.Contract}</td> {/* Display Contract */}
                <td>{row.JobType}</td> {/* Display Job Type */}
                <td>{row.Jobno}</td> {/* Display Job no */}
                <td>{row.InstallationDate}</td> {/* Display Installation Date */}
                <td>{row.ActionDate}</td> {/* Display Action Date */}
                <td>{row.ProductionOrder}</td> {/* Display Production Order */}
                <td>{row.ProductionOrderby}</td> {/* Display Production Order by */}
                <td>{row.Notes}</td> {/* Display Notes */}
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
        <div className="absolute bottom-[1vw] left-[1vw]">
          <button className="p-[1vw]  rounded" onClick={toggleFormVisibility}>
            <img src="/HRM/form.png" className="w-[3vw]" alt="" />
          </button>
        </div>
      )}

      {isFormVisible && (
        <div className="w-[26vw] bg-white shadow-2xl absolute right-0 z-10 top-[0vw] overflow-y-auto rounded-lg ml-4 h-[32vw]">
          <div className="flex justify-between p-4">
            <button
              className="hover:bg-red-500  shadow-lg rounded-md text-white p-[0.3vw]"
              onClick={toggleFormVisibility}
            >
              <img src="/HRM/close.png" className="w-[2vw]" alt="" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="overflow-y-auto  p-[1vw] ">
            <div className="mb-[0.3vw]">
              <h1>Entry Date:</h1>
              <input
                type="date"
                name="EntryDate"
                value={formData.EntryDate}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
            <h1>Requested By:</h1>
              <input
                type="text"
                name="RequestedBy"
                value={formData.RequestedBy}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
            <h1>Branch Name:</h1>
              <input
                type="text"
                name="BranchName"
                value={formData.BranchName}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
            <h1>Customer Name:</h1>
              <input
                type="text"
                name="CustomerName"
                value={formData.CustomerName}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
            <h1>Contract:</h1>
              <input
                type="text"
                name="Contract"
                value={formData.Contract}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
            <h1>Job Type:</h1>
              <input
                type="text"
                name="JobType"
                value={formData.JobType}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
            <h1>Job no:</h1>
              <input
                type="text"
                name="Jobno"
                value={formData.Jobno}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
            <h1>Installation Date:</h1>
              <input
                type="date"
                name="InstallationDate"
                value={formData.InstallationDate}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
            <h1>Action Date:</h1>
              <input
                type="date"
                name="ActionDate"
                value={formData.ActionDate}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
            <h1>Production Order:</h1>
              <select
                name="ProductionOrder"
                value={formData.ProductionOrder}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              >
                <option value="">Select Production Order</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div className="mb-[0.3vw]">
            <h1>Production Order by:</h1>
              <input
                type="text"
                name="ProductionOrderby"
                value={formData.ProductionOrderby}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
            <h1>Notes:</h1>
              <textarea
                name="Notes"
                value={formData.Notes}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
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

export default InstallizationProcess;
