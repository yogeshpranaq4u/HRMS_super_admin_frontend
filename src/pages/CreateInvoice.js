import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';

const CreateInvoice = () => {
  const [rows, setRows] = useState([
    { item: '', quantity: 0, rate: 0, tax: 'Out of Scope', amount: 0 }
  ]);

  const handleAddRow = () => {
    setRows([...rows, { item: '', quantity: 0, rate: 0, tax: 'Out of Scope', amount: 0 }]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const calculateAmount = (qty, rate) => {
    return (parseFloat(qty) * parseFloat(rate)).toFixed(2);
  };

  const updateRow = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    updatedRows[index].amount = calculateAmount(updatedRows[index].quantity, updatedRows[index].rate);
    setRows(updatedRows);
  };

  const subtotal = rows.reduce((sum, row) => sum + parseFloat(row.amount), 0);

  return (
    <MainLayout>
      <div className="page-wrapper">
        <div className="content">
          <div className="container py-1 bg-white invoice-form">
            <h3 className="text-start my-2">Create Invoice</h3>
            <div className="row g-3">
              <div className="col-md-6">
                <label>Customer Name*</label>
                <input className="form-control" type="text" />
              </div>
              <div className="col-md-6">
                <label>Company Name</label>
                <input className="form-control" type="text" />
              </div>
              <div className="col-md-6">
                <label>Email Address</label>
                <input className="form-control" type="email" />
              </div>
              <div className="col-md-6">
                <label>Invoice#</label>
                <input className="form-control" type="text" defaultValue="INV-001" />
              </div>
              <div className="col-md-6">
                <label>Invoice Date</label>
                <input className="form-control" type="date" defaultValue="2025-04-14" />
              </div>
              <div className="col-md-6">
                <label>Due Date</label>
                <input className="form-control" type="date" defaultValue="2025-05-14" />
              </div>
              <div className="col-md-12">
                <label>Address</label>
                <textarea className="form-control" rows="2"></textarea>
              </div>
            </div>

            <hr />

            <table className="table table-bordered mt-4">
              <thead className="table-light">
                <tr>
                  <th>Item Details</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Tax</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td><input className="form-control" value={row.item} onChange={(e) => updateRow(idx, 'item', e.target.value)} /></td>
                    <td><input className="form-control" type="number" value={row.quantity} onChange={(e) => updateRow(idx, 'quantity', e.target.value)} /></td>
                    <td><input className="form-control" type="number" value={row.rate} onChange={(e) => updateRow(idx, 'rate', e.target.value)} /></td>
                    <td>
                      <select className="form-select" value={row.tax} onChange={(e) => updateRow(idx, 'tax', e.target.value)}>
                        <option>Out of Scope</option>
                        <option>5%</option>
                        <option>10%</option>
                      </select>
                    </td>
                    <td>{row.amount}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemoveRow(idx)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="btn btn-primary mb-3" onClick={handleAddRow}>+ Add New Row</button>

            <div className="row">
              <div className="col-md-6 offset-md-6">
                <div className="d-flex justify-content-between">
                  <strong>Sub Total</strong>
                  <span>{subtotal.toFixed(2)}</span>
                </div>

                <div className="d-flex mt-2">
                  <input type="number" className="form-control me-2" placeholder="Discount %" />
                  <span className="me-2">OR</span>
                  <input type="number" className="form-control" placeholder="Discount Amount" />
                </div>

                <div className="d-flex justify-content-between mt-2">
                  <strong>Total</strong>
                  <span>{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-link">Cancel</button>
              <button className="btn btn-success ms-2">Preview</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateInvoice;
