import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const Contract = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData
      ? JSON.parse(savedData)
      : {
          profilePic: null,
          name: "",
          job: "",
          code: "",
          issueDate: "",
          expiryDate: "",
          shift: "",
          department: "",
          status: "",
        };
  });

  const [isFormVisible, setFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [srNo, setSrNo] = useState(() => {
    const savedSrNo = localStorage.getItem("srNo");
    return savedSrNo ? parseInt(savedSrNo) : 1;
  });
  const [rows, setRows] = useState(() => {
    const savedRows = localStorage.getItem("rows");
    return savedRows ? JSON.parse(savedRows) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows));
  }, [rows]);

  useEffect(() => {
    localStorage.setItem("srNo", srNo.toString());
  }, [srNo]);

  const addEmployee = () => {
    const newEmployee = {
      id: srNo,
      name: `Employee ${srNo}`,
    };
    setRows([...rows, newEmployee]);
    setSrNo(srNo + 1);
  };

  const handleIssueDate = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Example function to calculate expiry date
  const handleExpiryDateChange = (e) => {
    setFormData({ ...formData, expiryDate: e.target.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "code" ? value.toUpperCase().replace(/[^A-Z-]/g, "") : value,
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
      code: "",
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
    if (filter === "Active") {
      setRows((prevRows) => prevRows.filter((row) => row.status === "Active"));
    } else if (filter === "Inactive") {
      setRows((prevRows) =>
        prevRows.filter((row) => row.status === "Inactive")
      );
    }
  };

  const handleExport = () => {
    const doc = new jsPDF();
    rows.forEach((row, index) => {
      const yPos = 10 + index * 10;
      doc.text(`${row.name} - ${row.code}`, 10, yPos);
    });
    doc.save("employee_table.pdf");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRows = rows.filter((row) => {
    if (filter === "All") {
      return row.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return (
        row.status === filter &&
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });
  return (
    <div className="absolute shadow-xl right-[1vw]  rounded-md top-[12vw] h-[33vw]">
      <div className="h-[50vw]">
        <div className="bg-gray-400 w-[80vw] h-[3vw]  flex flex-row overflow-y-auto px-[2vw] items-center">
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
            <img src="public/HRM/refresh.png" alt="" />
          </button>
          <button
            className="w-[2vw] bg-red-500 mx-[0.5vw] rounded-md"
            onClick={handleFilter}
          >
            <img src="public/HRM/filter.png" alt="" />
          </button>
          <button
            className="w-[2vw] bg-sky-500 mx-[0.5vw] rounded-md"
            onClick={handleExport}
          >
            <img src="public/HRM/export.png" alt="" />
          </button>
        </div>
        <table className="w-[80vw] overflow-y-auto">
          <thead className="bg-gray-300 w-[80vw]">
            <tr className="w-[80vw]">
              <th className="border p-[0.5vw] text-[1vw]">Sr no</th>
              <th className="border p-[0.5vw] text-[1vw]">Picture</th>
              <th className="border p-[0.5vw] text-[1vw]">Name</th>
              <th className="border p-[0.5vw] text-[1vw]">Issue Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Expiry Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Shift</th>
              <th className="border p-[0.5vw] text-[1vw]">Contract Type</th>
              <th className="border p-[0.5vw] text-[1vw]">File no</th>
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
                    <img
                      src="public/HRM/profile.png"
                      className="w-[2vw] mx-auto"
                      alt=""
                    />
                  )}
                </td>
                <td className="p-[1.5vw]">{row.name}</td>
                <td className="p-[1.5vw]">{row.issueDate}</td>
                <td className="p-[1.5vw]">{row.expiryDate}</td>
                <td>
                  <select
                    className="p-[1vw] text-[1vw] w-[9vw] rounded-md border"
                    value={row.shift}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "shift", value: e.target.value },
                      })
                    }
                  >
                    <option value="Morning">Morning</option>
                    <option value="Night">Night</option>
                  </select>
                </td>
                <td>
                  <select
                    className="p-[1vw] text-[1vw] w-[9vw] rounded-md mx-[1vw]"
                    value={row.department}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "department", value: e.target.value },
                      })
                    }
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </td>
                <td className="p-[1.5vw]">{row.code}</td>
                <td>
                  <select
                    className="p-[1vw] text-[1vw] w-[9vw] rounded-md border"
                    value={row.status}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "status", value: e.target.value },
                      })
                    }
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
                    <img
                      src="public/HRM/edit.png"
                      className="w-[1.4vw]"
                      alt=""
                    />
                  </button>
                  <button
                    className="hover:bg-red-500 p-2 rounded-full"
                    onClick={() => handleDelete(index)}
                  >
                    <img
                      src="public/HRM/Trash.png"
                      className="w-[1.4vw]"
                      alt=""
                    />
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
            className="w-[3vw] text-white p-[0.1vw] rounded"
            onClick={toggleFormVisibility}
          >
            <img src="/HRM/form.png" alt="" />
          </button>
        </div>
      )}

      {isFormVisible && (
        <div className="w-[25vw] bg-white shadow-lg absolute right-0 z-10 top-[0vw] overflow-y-auto rounded-lg ml-4 h-full">
          <div className="flex justify-between p-[0.5vw]">
            <button
              className="hover:bg-red-500 w-[2vw] bg-white shadow-lg rounded-[0.7vw] text-white p-[0.2vw]"
              onClick={toggleFormVisibility}
            >
              <img src="/HRM/close.png" alt="" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="overflow-y-auto p-[1vw] ">
            <div className="mb-[0.3vw]">
              <label htmlFor="profilePic" className="block mb-1">
                Picture:
              </label>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="name" className="block mb-1">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="issueDate" className="block mb-1">
                Issue Date:
              </label>
              <input
                type="text"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleIssueDate}
                className="border p-2 rounded w-full"
                placeholder="MM/DD/YYYY"
              />
            </div>

            <div className="mb-[0.3vw]">
              <label htmlFor="expiryDate" className="block mb-1">
                Expiry Date:
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleExpiryDateChange}
                className="border p-2 rounded w-full"
                placeholder="MM/DD/YYYY"
              />
            </div>

            <div className="mb-[0.3vw]">
              <label htmlFor="shift" className="block mb-1">
                Shift:
              </label>
              <select
                className="p-[1vw] text-[1vw] w-[13vw] rounded-md border"
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
              <label htmlFor="department" className="block mb-1">
                Department:
              </label>
              <select
                className="p-[1vw] text-[1vw] w-[13vw] rounded-md border"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="Permanent">Permanent</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="code" className="block mb-1">
                File no:
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="border p-2 rounded w-full"
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
              className="bg-black text-white p-2 rounded w-full"
            >
              {editIndex !== null ? "Edit Employee" : "Add Employee"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Contract;
