import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const InstallationSchedule = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData
      ? JSON.parse(savedData)
      : {
          EntryDate: "",
          Jobno: "",
          CustomerName: "",
          ProjectName: "",
          Contractno: "",
          JobType: "",
          InstallationDate: "",
          Notes: "",
          status: "",
          Installers: [], // New field for installers
          Squares: 0, // New field for squares
          Colour: "", // New field for colour
          InstallationDays: 0, // New field for installation days
        };
  });

  const [isFormVisible, setFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Installers") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
          ? value.split(",").map((installer) => installer.trim())
          : [],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profilePic: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      Jobno: formData.Jobno || `JOB-${rows.length + 1}`, // Auto-generate if empty
      InstallationDays: Math.ceil(formData.Squares / 10), // Assuming 10 square meters per day
    };

    if (editIndex !== null) {
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[editIndex] = updatedFormData;
        return updatedRows;
      });
      setEditIndex(null);
    } else {
      setRows((prevRows) => [...prevRows, updatedFormData]);
    }

    setFormData({
      EntryDate: "",
      Jobno: "",
      CustomerName: "",
      ProjectName: "",
      Contractno: "",
      JobType: "",
      InstallationDate: "",
      Notes: "",
      status: "",
      Installers: [],
      Squares: 0,
      Colour: "",
      InstallationDays: 0,
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
    // Check if row.name and row.status are defined before accessing them
    const name = row.name ? row.name.toLowerCase() : "";
    const status = row.status ? row.status.toLowerCase() : "";

    if (filter === "All") {
      return name.includes(searchTerm.toLowerCase());
    } else {
      return (
        status === filter.toLowerCase() &&
        name.includes(searchTerm.toLowerCase())
      );
    }
  });

  const getStatusColor = (status, installationDate) => {
    if (!installationDate) {
      return "red";
    }
    return status === "Complete" ? "green" : "transparent";
  };

  const handleExportJobCard = (index) => {
    const job = rows[index];
    const doc = new jsPDF();
    doc.text(`Job Card for ${job.ProjectName}`, 10, 10);
    doc.text(`Customer Name: ${job.CustomerName}`, 10, 20);
    doc.text(`Project Name: ${job.ProjectName}`, 10, 30);
    doc.text(`Contract no: ${job.Contractno}`, 10, 40);
    doc.text(`Job Type: ${job.JobType}`, 10, 50);
    doc.text(`Installation Date: ${job.InstallationDate}`, 10, 60);
    doc.text(`Notes: ${job.Notes}`, 10, 70);
    doc.text(`Installers: ${job.Installers.join(", ")}`, 10, 80);
    doc.text(`Squares: ${job.Squares}`, 10, 90);
    doc.text(`Colour: ${job.Colour}`, 10, 100);
    doc.text(`Installation Days: ${job.InstallationDays}`, 10, 110);
    doc.save(`job_card_${job.Jobno}.pdf`);
  };

  return (
    <div className="absolute shadow-xl w-[82vw] right-[1vw] rounded-md top-[4vw] h-[40vw]">
      <div className="flex flex-row m-[1vw] gap-[1vw] items-center image-hover-effect">
        <div className="w-[3vw]">
          <img
            src="/Sales/Salespages/Schedule.png"
            className="image-hover-effect"
            alt="Leave"
          />
        </div>
        <h1 className=" text-[2vw] text-[#E9278E]">Installation Schedule</h1>
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
              <th className="border p-[0.5vw] text-[1vw]">Job no</th>
              <th className="border p-[0.5vw] text-[1vw]">Customer Name</th>
              <th className="border p-[0.5vw] text-[1vw]">Project Name</th>
              <th className="border p-[0.5vw] text-[1vw]">Contract no</th>
              <th className="border p-[0.5vw] text-[1vw]">Job Type</th>
              <th className="border p-[0.5vw] text-[1vw]">Installation Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Notes</th>
              <th className="border p-[0.5vw] text-[1vw]">Status</th>
              <th className="border p-[0.5vw] text-[1vw]">Export</th>
              <th className="border p-[0.5vw] text-[1vw]">Color</th>
              <th className="border p-[0.5vw] text-[1vw]">Actions</th>
            </tr>
          </thead>
          <tbody className="rounded-lg bg-gray-100 w-[80vw] text-center">
            {filteredRows.map((row, index) => (
              <tr key={index}>
                <td className="p-[1.5vw]">{index + 1}</td>
                <td className="p-[1.5vw]">{row.EntryDate}</td>
                <td className="p-[1.5vw]">{row.Jobno}</td>
                <td className="p-[1.5vw]">{row.CustomerName}</td>
                <td className="p-[1.5vw]">{row.ProjectName}</td>
                <td className="p-[1.5vw]">{row.Contractno}</td>
                <td className="p-[1.5vw]">{row.JobType}</td>
                <td className="p-[1.5vw]">{row.InstallationDate}</td>
                <td className="p-[1.5vw]">{row.Notes}</td>
                <td
                  className="p-[1.5vw]"
                  style={{
                    backgroundColor: getStatusColor(
                      row.status,
                      row.InstallationDate
                    ),
                  }}
                >
                  {row.status}
                </td>
                <td className="p-[0.1vw]">
                  <button
                    className="bg-gray-500 p-2 rounded-full"
                    onClick={() => handleExportJobCard(index)}
                  >
                    <img src="/HRM/export.png" className="w-[1.4vw]" alt="" />
                  </button>
                </td>
                <td className="p-[1.5vw]">{row.Colour}</td>
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
              className="hover:bg-red-500 h-[2vw] shadow-lg rounded-md text-white p-[0.3vw]"
              onClick={toggleFormVisibility}
            >
              <img src="/HRM/close.png" className="w-[2vw]" alt="" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="overflow-y-auto  p-[1vw] ">
            <div className="mb-[0.3vw]">
              <label
                htmlFor="EntryDate"
                className="block mb-[0.3vw] text-[1vw]"
              >
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
              <label htmlFor="Jobno" className="block mb-[0.3vw] text-[1vw]">
                Job no:
              </label>
              <input
                type="text"
                id="Jobno"
                name="Jobno"
                value={formData.Jobno}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label
                htmlFor="CustomerName"
                className="block mb-[0.3vw] text-[1vw]"
              >
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
              <label
                htmlFor="ProjectName"
                className="block mb-[0.3vw] text-[1vw]"
              >
                Project Name:
              </label>
              <input
                type="text"
                id="ProjectName"
                name="ProjectName"
                value={formData.ProjectName}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label
                htmlFor="Contractno"
                className="block mb-[0.3vw] text-[1vw]"
              >
                Contract no:
              </label>
              <input
                type="text"
                id="Contractno"
                name="Contractno"
                value={formData.Contractno}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="JobType" className="block mb-[0.3vw] text-[1vw]">
                Job Type:
              </label>
              <input
                type="text"
                id="JobType"
                name="JobType"
                value={formData.JobType}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label
                htmlFor="InstallationDate"
                className="block mb-[0.3vw] text-[1vw]"
              >
                Installation Date:
              </label>
              <input
                type="date"
                id="InstallationDate"
                name="InstallationDate"
                value={formData.InstallationDate}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Notes" className="block mb-[0.3vw] text-[1vw]">
                Notes:
              </label>
              <input
                type="text"
                id="Notes"
                name="Notes"
                value={formData.Notes}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label
                htmlFor="Installers"
                className="block mb-[0.3vw] text-[1vw]"
              >
                Installers:
              </label>
              <input
                type="text"
                id="Installers"
                name="Installers"
                value={
                  formData.Installers ? formData.Installers.join(", ") : ""
                }
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>

            <div className="mb-[0.3vw]">
              <label htmlFor="Squares" className="block mb-[0.3vw] text-[1vw]">
                Squares:
              </label>
              <input
                type="number"
                id="Squares"
                name="Squares"
                value={formData.Squares}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Colour" className="block mb-[0.3vw] text-[1vw]">
                Colour:
              </label>
              <input
                type="text"
                id="Colour"
                name="Colour"
                value={formData.Colour}
                onChange={handleChange}
                className="border p-[0.5vw] rounded w-[22vw] h-[2.5vw]"
              />
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
                <option value="Cancel">Cancel</option>
                <option value="Pending">Pending</option>
                <option value="Complete">Complete</option>
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

export default InstallationSchedule;
