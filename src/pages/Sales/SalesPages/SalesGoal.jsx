import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const SalesGoal = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : {
      MonthYear: "",
      EntryDate: "",
      EmployeeName: "",
      StartDate: '',
      EndDate: "",
      TotalCollection: '',
      TotalPaidCommition: '',
      TotalRemainingCommition: '',
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
      MonthYear: "",
      EntryDate: "",
      EmployeeName: "",
      StartDate: '',
      EndDate: "",
      TotalCollection: '',
      TotalPaidCommition: '',
      TotalRemainingCommition: '',
      status: '',
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
    const name = row.name ? row.name.toLowerCase() : '';
    const status = row.status ? row.status.toLowerCase() : '';
    
    if (filter === 'All') {
      return name.includes(searchTerm.toLowerCase());
    } else {
      return (
        status === filter &&
        name.includes(searchTerm.toLowerCase())
      );
    }
  });

  const calculateCommission = (totalSales) => {
    // Assuming commission rate is 3%
    const commissionRate = 0.03;
    const commission = totalSales * commissionRate;
    return commission.toFixed(2); // Round to 2 decimal places
  };

  return (
    <div className="absolute shadow-xl w-[82vw] right-[1vw] rounded-md top-[4vw] h-[40vw]">
      <div className='flex flex-row m-[1vw] gap-[1vw] items-center image-hover-effect'>
        <div className='w-[3vw]'>
          <img src="/Sales/Salespages/Goal.png" className="image-hover-effect" alt="Leave" />
        </div>
        <h1 className=' text-[2vw] text-[#E9278E]'>Sales Goal</h1>
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
              <th className="border p-[0.5vw] text-[1vw]">Month and Year</th>
              <th className="border p-[0.5vw] text-[1vw]">Booked Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Employee Name</th>
              <th className='border p-[0.5vw] text-[1vw]'>Start Date</th>
              <th className="border p-[0.5vw] text-[1vw]">End Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Total Collection</th>
              <th className="border p-[0.5vw] text-[1vw]">Total Commition</th>
              <th className="border p-[0.5vw] text-[1vw]">Total Paid Commition</th>
              <th className="border p-[0.5vw] text-[1vw]">Total Remaining Commition</th>
              <th className="border p-[0.5vw] text-[1vw]">Status</th>
              <th className="border p-[0.5vw] text-[1vw]">Actions</th>
            </tr>
          </thead>
          <tbody className="rounded-lg bg-gray-100 w-[80vw] text-center">
            {filteredRows.map((row, index) => (
              <tr key={index}>
                <td className="p-[1.5vw]">{row.MonthYear}</td>
                <td className="p-[1.5vw]">{row.EntryDate}</td>
                <td className="p-[1.5vw]">{row.EmployeeName}</td>
                <td className="p-[1.5vw]">{row.StartDate}</td>
                <td className="p-[1.5vw]">{row.EndDate}</td>
                <td className="p-[1.5vw]">{row.TotalCollection}</td>
                <td className="p-[1.5vw]">{calculateCommission(row.TotalCollection)}</td>
                <td className="p-[1.5vw]">{row.TotalPaidCommition}</td>
                <td className="p-[1.5vw]">{row.TotalRemainingCommition}</td>
                <td className="p-[1.5vw]">{row.status}</td>
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
            className="w-[4vw] p-2 rounded "
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
          <form onSubmit={handleSubmit} className="overflow-y-auto  p-[1vw] ">
            <div className="mb-[0.3vw]">
              <label htmlFor="MonthYear" className="block mb-[0.3vw] text-[1vw]">
                Month and Year:
              </label>
              <input
                type="date"
                id="MonthYear"
                name="MonthYear"
                value={formData.MonthYear}
                onChange={handleChange}
                className='border border-black p-[0.3vw] rounded-md w-[20vw]'
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="EntryDate" className="block mb-[0.3vw] text-[1vw]">
                Booked Date:
              </label>
              <input
                type="date"
                id="EntryDate"
                name="EntryDate"
                value={formData.EntryDate}
                onChange={handleChange}
                className='border border-black p-[0.3vw] rounded-md w-[20vw]'
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
                className='border border-black p-[0.3vw] rounded-md w-[20vw]'
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="StartDate" className="block mb-[0.3vw] text-[1vw]">
                Start Date:
              </label>
              <input
                type="date"
                id="StartDate"
                name="StartDate"
                value={formData.StartDate}
                onChange={handleChange}
                className='border border-black p-[0.3vw] rounded-md w-[20vw]'
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="EndDate" className="block mb-[0.3vw] text-[1vw]">
                End Date:
              </label>
              <input
                type="date"
                id="EndDate"
                name="EndDate"
                value={formData.EndDate}
                onChange={handleChange}
                className='border border-black p-[0.3vw] rounded-md w-[20vw]'
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="TotalCollection" className="block mb-[0.3vw] text-[1vw]">
                Total Collection:
              </label>
              <input
                type="text"
                id="TotalCollection"
                name="TotalCollection"
                value={formData.TotalCollection}
                onChange={handleChange}
                className='border border-black p-[0.3vw] rounded-md w-[20vw]'
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="TotalPaidCommition" className="block mb-[0.3vw] text-[1vw]">
                Total Paid Commition:
              </label>
              <input
                type="text"
                id="TotalPaidCommition"
                name="TotalPaidCommition"
                value={formData.TotalPaidCommition}
                onChange={handleChange}
                className='border border-black p-[0.3vw] rounded-md w-[20vw]'
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="TotalRemainingCommition" className="block mb-[0.3vw] text-[1vw]">
                Total Remaining Commition:
              </label>
              <input
                type="text"
                id="TotalRemainingCommition"
                name="TotalRemainingCommition"
                value={formData.TotalRemainingCommition}
                onChange={handleChange}
                className='border border-black p-[0.3vw] rounded-md w-[20vw]'
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="status" className="block mb-[0.3vw] text-[1vw]">
                Status:
              </label>
              <select
                className='border border-black p-[0.3vw] rounded-md w-[20vw]'
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
              {editIndex !== null ? "Edit " : "Add "}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SalesGoal;


