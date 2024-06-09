import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const Customers = () => {
  const [formData, setFormData] = useState({
    Branch: "",
    EntryDate: "",
    Name: "",
    Total: "",
    Location: "",
    Contactno: "",
    Email: "",
    CustomerCode: "",
    ProjectNo: ""
  });

  const [isFormVisible, setFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [srNo, setSrNo] = useState(1);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const savedRows = localStorage.getItem("rows");
    if (savedRows) {
      setRows(JSON.parse(savedRows));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows));
  }, [rows]);

  const generateCustomerCode = () => {
    const existingCustomer = rows.find(
      (row) => row.Contactno === formData.Contactno
    );
    if (existingCustomer) {
      return existingCustomer.CustomerCode;
    } else {
      return `CC${Math.floor(Math.random() * 10000)}`;
    }
  };

  const addCustomer = () => {
    const customerCode = generateCustomerCode();
    const newCustomer = {
      id: srNo,
      Branch: formData.Branch,
      EntryDate: formData.EntryDate,
      Name: formData.Name,
      Total: formData.Total,
      Location: formData.Location,
      Contactno: formData.Contactno,
      Email: formData.Email,
      CustomerCode: customerCode,
      ProjectNo: formData.ProjectNo
    };
    setRows([...rows, newCustomer]);
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
      addCustomer();
    }

    setFormData({
      Branch: "",
      EntryDate: "",
      Name: "",
      Total: "",
      Location: "",
      Contactno: "",
      Email: "",
      ProjectNo: ""
    });

    setFormVisible(false);
  };

  const handleDelete = (index) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    const customerToEdit = rows[index];
    setFormData(customerToEdit);
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
      setRows((prevRows) => prevRows.filter((row) => row.status === "Inactive"));
    }
  };

  const handleExport = () => {
    const doc = new jsPDF();
    rows.forEach((row, index) => {
      const yPos = 10 + index * 10;
      doc.text(`${row.Name} - ${row.Contactno}`, 10, yPos);
    });
    doc.save("customer_table.pdf");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRows = rows.filter((row) => {
    if (filter === "All") {
      return (
        row.Name &&
        row.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return (
        row.Location &&
        row.Location === filter &&
        row.Name &&
        row.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });
  return (
    <div className="absolute shadow-xl w-[82vw] right-[1vw] rounded-md top-[4vw] h-[40vw]">
    <div className='flex flex-row m-[1vw] gap-[1vw] items-center image-hover-effect'>
      <div className='w-[3vw]'>
      <img src="/CRM/pages/Customers.png" className="image-hover-effect" alt="Leave" />
      </div>
      <h1 className=' text-[2vw] text-[#E9278E]'>Customers</h1>
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
              <th className="border p-[0.5vw] text-[1vw]">Branch</th>
              <th className="border p-[0.5vw] text-[1vw]">Entry Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Name</th>
              <th className="border p-[0.5vw] text-[1vw]">Location</th>
              <th className="border p-[0.5vw] text-[1vw]">Contact no</th>
              <th className="border p-[0.5vw] text-[1vw]">Email</th>
              <th className="border p-[0.5vw] text-[1vw]">Customer Code</th>
              <th className="border p-[0.5vw] text-[1vw]">Project No</th>
              <th className="border p-[0.5vw] text-[1vw]">Actions</th>
            </tr>
          </thead>
          <tbody className="rounded-lg bg-gray-100 w-[80vw] text-center">
            {filteredRows.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row.Branch}</td>
                <td>{row.EntryDate}</td>
                <td>{row.Name}</td>
                <td>{row.Location}</td>
                <td>{row.Contactno}</td>
                <td>{row.Email}</td>
                <td>{row.CustomerCode}</td>
                <td>{row.ProjectNo}</td>
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
        <div className="w-[20vw] bg-white shadow-lg absolute right-0 z-10 top-[6vw] overflow-y-auto rounded-lg ml-4 h-full">
          <div className="flex justify-between p-4">
            <button
              className="hover:bg-red-500 w-[3vw] bg-white shadow-lg rounded-[0.7vw] text-white p-[0.5vw]"
              onClick={toggleFormVisibility}
            >
              <img src="/HRM/close.png" className="w-[2.4vw]" alt="" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="overflow-y-auto p-[1vw] ">
            <div className="mb-[0.3vw]">
              <label htmlFor="Branch" className="block mb-1">
                Branch:
              </label>
              <input
                type="text"
                id="Branch"
                name="Branch"
                value={formData.Branch}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
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
              <label htmlFor="Name" className="block mb-1">
                Name:
              </label>
              <input
                type="text"
                id="Name"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Location" className="block mb-1">
                Location:
              </label>
              <input
                type="text"
                id="Location"
                name="Location"
                value={formData.Location}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Contactno" className="block mb-1">
                Contact no:
              </label>
              <input
                type="text"
                id="Contactno"
                name="Contactno"
                value={formData.Contactno}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Email" className="block mb-1">
                Email:
              </label>
              <input
                type="email"
                id="Email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="ProjectNo" className="block mb-1">
                Project No:
              </label>
              <input
                type="text"
                id="ProjectNo"
                name="ProjectNo"
                value={formData.ProjectNo}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-[#E9278E] text-white p-2 rounded w-full"
            >
              {editIndex !== null ? "Edit Customer" : "Add Customer"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Customers;