import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const InventoryReport = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData
      ? JSON.parse(savedData)
      : {
          Category: "",
          SubCategory: "",
          SKU: "",
          Barcode: "",
          Productname: "",
          Stock: 0,
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
  const [projectArea, setProjectArea] = useState(0);

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
      ...formData,
      Stock: parseFloat(formData.Stock),
    };
    setRows([...rows, newEmployee]);
    setSrNo(srNo + 1);
    setFormData({
      Category: "",
      SubCategory: "",
      SKU: "",
      Barcode: "",
      Productname: "",
      Stock: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      Area:
        name === "Length" || name === "Width"
          ? prevData.Length * prevData.Width
          : prevData.Area,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[editIndex] = {
          id: rows[editIndex].id,
          ...formData,
          Stock: parseFloat(formData.Stock),
        };
        return updatedRows;
      });
      setEditIndex(null);
    } else {
      addEmployee();
    }

    setFormVisible(false);
  };

  const handleDelete = (index) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setFormData(rows[index]);
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
    // Filter functionality
  };

  const handleExport = () => {
    const doc = new jsPDF();
    rows.forEach((row, index) => {
      const yPos = 10 + index * 10;
      doc.text(`${row.Productname} - ${row.Barcode}`, 10, yPos);
    });
    doc.save("inventory_table.pdf");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const calculateMaterials = (projectArea) => {
    const requiredMeters = projectArea + projectArea * 0.35;
    return Math.ceil(requiredMeters);
  };

  const handlePlaceOrder = () => {
    const requiredMeters = calculateMaterials(projectArea);

    rows.forEach((row, index) => {
      if (
        row.Category === "Project A" &&
        row.Productname === "kitchen measurements"
      ) {
        const currentStock = row.Stock;
        const toOrder = requiredMeters - currentStock;

        if (toOrder > 0) {
          console.log(`Order ${toOrder} meters of ${row.Productname}`);
        } else {
          console.log(
            `Reserve ${requiredMeters} meters from stock for ${row.Productname}`
          );
        }

        const updatedStock =
          currentStock >= requiredMeters ? currentStock - requiredMeters : 0;
        const updatedRow = { ...row, Stock: updatedStock };
        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows[index] = updatedRow;
          return updatedRows;
        });
      }
    });
  };

  const filteredRows = rows.filter((row) => {
    const category = row.Category ? row.Category.toLowerCase() : "";
    const subCategory = row.SubCategory ? row.SubCategory.toLowerCase() : "";
    const searchTermLower = searchTerm.toLowerCase();

    if (filter === "All") {
      return (
        category.includes(searchTermLower) ||
        subCategory.includes(searchTermLower)
      );
    } else {
      return (
        row.status.toLowerCase() === filter.toLowerCase() &&
        (category.includes(searchTermLower) ||
          subCategory.includes(searchTermLower))
      );
    }
  });

  return (
    <div className="absolute shadow-xl w-[82vw] right-[1vw] rounded-md top-[4vw] h-[40vw]">
      <div className="flex flex-row m-[1vw] gap-[1vw] items-center image-hover-effect">
        <div className="w-[3vw]">
          <img
            src="/Inventory/report.png"
            className="image-hover-effect"
            alt="Leave"
          />
        </div>
        <h1 className=" text-[2vw] text-[#E9278E]">Inventory Report</h1>
      </div>
      <div className="h-[50vw]">
        <div className="bg-gray-400 w-[80vw] h-[3vw] flex flex-row px-[2vw] items-center">
          <input
            className="p-[0.3vw] w-[18vw] text-[1vw] rounded-md mx-[1vw]"
            type="text"
            placeholder="Search by Category name"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
                className="p-[0.5vw] text-[1vw] w-[13vw] rounded-md mx-[1vw]"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Discontinued">Discontinued</option>
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
              <th className="border p-[0.5vw] text-[1vw]">Project no</th>
              <th className="border p-[0.5vw] text-[1vw]">Category</th>
              <th className="border p-[0.5vw] text-[1vw]">Sub Category</th>
              <th className="border p-[0.5vw] text-[1vw]">SKU</th>
              <th className="border p-[0.5vw] text-[1vw]">Barcode</th>
              <th className="border p-[0.5vw] text-[1vw]">Product Name</th>
              <th className="border p-[0.5vw] text-[1vw]">Length (m)</th>
              <th className="border p-[0.5vw] text-[1vw]">Width (m)</th>
              <th className="border p-[0.5vw] text-[1vw]">Area (m²)</th>
              <th className="border p-[0.5vw] text-[1vw]">Stock</th>
              <th className="border p-[0.5vw] text-[1vw]">Status</th>
              <th className="border p-[0.5vw] text-[1vw]">Actions</th>
            </tr>
          </thead>
          <tbody className="rounded-lg bg-gray-100 w-[80vw] text-center">
            {filteredRows.map((row, index) => (
              <tr key={index}>
                <td>{row.id}</td>
                <td>{row.Category}</td>
                <td>{row.SubCategory}</td>
                <td>{row.SKU}</td>
                <td>{row.Barcode}</td>
                <td>{row.Productname}</td>
                <td>{row.Length}</td>
                <td>{row.Width}</td>
                <td>{row.Length * row.Width}</td>
                <td>{row.Stock}</td>
                <td>{row.status}</td>
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
          <form onSubmit={handleSubmit} className="overflow-y-auto p-[1vw]">
            <div className="mb-[0.3vw]">
              <label>Category Name:</label>
              <input
                type="text"
                name="Category"
                value={formData.Category}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label>Sub-Category Name:</label>
              <input
                type="text"
                name="SubCategory"
                value={formData.SubCategory}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label>SKU Number:</label>
              <input
                type="text"
                name="SKU"
                value={formData.SKU}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label>Barcode Number:</label>
              <input
                type="text"
                name="Barcode"
                value={formData.Barcode}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label>Product Name:</label>
              <input
                type="text"
                name="Productname"
                value={formData.Productname}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label>Stock:</label>
              <input
                type="number"
                name="Stock"
                value={formData.Stock}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label>Length (m):</label>
              <input
                type="number"
                name="Length"
                value={formData.Length}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label>Width (m):</label>
              <input
                type="number"
                name="Width"
                value={formData.Width}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            <div className="mb-[0.3vw]">
              <label>Area (m²):</label>
              <input
                type="number"
                name="Area"
                value={formData.Length * formData.Width}
                readOnly
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              />
            </div>
            
            <div className="mb-[0.3vw]">
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="p-[0.7vw] text-[1vw] w-[22vw] rounded-md border"
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Discontinued">Discontinued</option>
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

export default InventoryReport;
