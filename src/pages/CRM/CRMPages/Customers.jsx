import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const Customers = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData
      ? JSON.parse(savedData)
      : {
    Branch: "",
    EntryDate: "",
    Name: "",
    Location: "",
    Contactno: "",
    Email: "",
    CustomerCode: "",
    Projects: [],
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
      ReceiptDate: "",
      Addedby: "",
      BranchName: "",
      Receiptno: "",
      PaymentMethod: "",
      FromAccount: "",
      ToAccount: "",
      TotalAmount: "",
      Description: "",
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
  const addProject = () => {
    setFormData((prevData) => ({
      ...prevData,
      Projects: [...prevData.Projects, { ProjectName: "", ProjectValue: "" }],
    }));
  };

  const handleProjectChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedProjects = [...prevData.Projects];
      updatedProjects[index][name] = value;
      return { ...prevData, Projects: updatedProjects };
    });
  };

  const removeProject = (index) => {
    setFormData((prevData) => {
      const updatedProjects = [...prevData.Projects];
      updatedProjects.splice(index, 1);
      return { ...prevData, Projects: updatedProjects };
    });
  };

  const handleViewQuote = (customerId, projectIndex) => {
    alert(`Viewing quote for Customer ID: ${customerId}, Project Index: ${projectIndex}`);
  };

  return (
    <div className="absolute shadow-xl w-[82vw] right-[1vw] rounded-md top-[4vw] h-[40vw]">
      <div className="flex flex-row m-[1vw] gap-[1vw] items-center image-hover-effect">
        <div className="w-[3vw]">
          <img src="/CRM/pages/Customers.png" className="image-hover-effect" alt="Leave" />
        </div>
        <h1 className="text-[2vw] text-[#E9278E]">Customers</h1>
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
              <th className="border p-[0.5vw] text-[1vw]">Entry no</th>
              <th className="border p-[0.5vw] text-[1vw]">Branch</th>
              <th className="border p-[0.5vw] text-[1vw]">Entry Date</th>
              <th className="border p-[0.5vw] text-[1vw]">Name</th>
              <th className="border p-[0.5vw] text-[1vw]">Location</th>
              <th className="border p-[0.5vw] text-[1vw]">Contact no</th>
              <th className="border p-[0.5vw] text-[1vw]">Email</th>
              <th className="border p-[0.5vw] text-[1vw]">Customer Code</th>
              <th className="border p-[0.5vw] text-[1vw]">Actions</th>
            </tr>
          </thead>
          <tbody className="w-[80vw]">
            {filteredRows.map((row, index) => (
              <React.Fragment key={index}>
                <tr className="bg-gray-100">
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{row.Branch}</td>
                  <td className="text-center">{row.EntryDate}</td>
                  <td className="text-center">{row.Name}</td>
                  <td className="text-center">{row.Location}</td>
                  <td className="text-center">{row.Contactno}</td>
                  <td className="text-center">{row.Email}</td>
                  <td className="text-center">{row.CustomerCode}</td>
                  <td className="p-[0.1vw]">
                    <button className="hover:bg-blue-500 p-2 rounded-full mb-2 mr-[0.6vw]" onClick={() => handleEdit(index)}>
                      <img src="/HRM/edit.png" className="w-[1.4vw]" alt="" />
                    </button>
                    <button className="hover:bg-red-500 p-2 rounded-full" onClick={() => handleDelete(index)}>
                      <img src="/HRM/Trash.png" className="w-[1.4vw]" alt="" />
                    </button>
                  </td>
                </tr>
                {row.Projects.map((project, projIndex) => (
                  <tr className="text-center text-[20px] bg-gray-200" key={`${index}-${projIndex}`}>
                    <td colSpan="9">
                   Project name: {project.ProjectName} - Value: {project.ProjectValue}
                      <button onClick={() => handleViewQuote(row.id, projIndex)} className="ml-2 bg-gray-400 text-white p-1 rounded">
                        View Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {!isFormVisible && (
        <div className="absolute bottom-4 left-4">
          <button className="w-[4vw] text-white p-2 rounded" onClick={toggleFormVisibility}>
            <img src="/HRM/form.png" alt="" />
          </button>
        </div>
      )}
      {isFormVisible && (
        <div className="w-[30vw] bg-white shadow-lg absolute right-0 z-10 top-[0vw] overflow-y-auto rounded-lg ml-4 h-full">
          <div className="flex justify-between p-4">
            <button className="hover:bg-red-500 w-[3vw] bg-white shadow-lg rounded-[0.7vw] text-white p-[0.5vw]" onClick={toggleFormVisibility}>
              <img src="/HRM/close.png" className="w-[2.4vw]" alt="" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="overflow-y-auto p-[1vw] ">
            <div className="mb-[0.3vw]">
              <label htmlFor="Branch" className="block mb-1">
                Branch:
              </label>
              <input type="text" id="Branch" name="Branch" value={formData.Branch} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="EntryDate" className="block mb-1">
                Entry Date:
              </label>
              <input type="date" id="EntryDate" name="EntryDate" value={formData.EntryDate} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Name" className="block mb-1">
                Name:
              </label>
              <input type="text" id="Name" name="Name" value={formData.Name} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Location" className="block mb-1">
                Location:
              </label>
              <input type="text" id="Location" name="Location" value={formData.Location} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Contactno" className="block mb-1">
                Contact no:
              </label>
              <input type="text" id="Contactno" name="Contactno" value={formData.Contactno} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Email" className="block mb-1">
                Email:
              </label>
              <input type="email" id="Email" name="Email" value={formData.Email} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div className="mb-[0.3vw]">
              <label htmlFor="Projects" className="block mb-1">
                Projects:
              </label>
              {formData.Projects.map((project, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    name="ProjectName"
                    placeholder="Project Name"
                    value={project.ProjectName}
                    onChange={(e) => handleProjectChange(e, index)}
                    className="border p-2 rounded w-full mr-2"
                  />
                  <input
                    type="text"
                    name="ProjectValue"
                    placeholder="Project Value"
                    value={project.ProjectValue}
                    onChange={(e) => handleProjectChange(e, index)}
                    className="border p-2 rounded w-full mr-2"
                  />
                  <button type="button" onClick={() => removeProject(index)} className="bg-red-500 text-white p-2 rounded">
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addProject} className="bg-gray-500 text-white p-2 rounded w-full">
                Add Project
              </button>
            </div>
            <button type="submit" className="bg-[#E9278E] text-white p-2 rounded w-full">
              {editIndex !== null ? "Edit Customer" : "Add Customer"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Customers;
