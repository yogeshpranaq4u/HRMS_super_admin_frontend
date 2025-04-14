import React from 'react';
import { formatCurrency } from '../helpers/frontend';
// import './InvoicePreview.css';

const InvoicePreview = ({handleData, invoiceData }) => {
    console.log("handleData" ,handleData);
    
    const {
        invoiceNo = 'INV-001',
        invoiceDate = '2025-04-14',
        dueDate = '2025-05-14',
        placeOfSupply = 'Haryana (06)',
        customer = {
            name: 'Yogesh Rana',
            company: 'Yogesh Pvt Ltd',
            address: 'New Delhi 110059 Delhi',
            email: 'sadqrfdv@kk.com'
        },
        items = [{ description: 'Mobile', qty: 1, rate: 599 }],
        signatureName = 'Akash Singh'
    } = invoiceData;

    const total = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
    const amountInWords = "Ten Thousand."; // Example static for now

    return (
        <div className="preview-invoice-overlay">
            <div className=" preview-invoice border p-4 bg-white shadow">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <img src="/assets/images/logoNew.png" alt="Logo" style={{ height: 50 }} />
                    </div>
                    <div className="text-end">
                        <h5>Cyber Vision Infotech Private Limited</h5>
                        <div className="small">
                            <div>Company ID: U72900HR2021PTC098108</div>
                            <div>Address: 2nd Floor, Plot No 96,</div>
                            <div>Gurgaon Udyog Vihar, Phase 2</div>
                            <div>Haryana, 122016</div>
                            <div>GSTIN: 06AAJCC8706J2ZF</div>
                        </div>
                        <h5 className="mt-2">TAX INVOICE</h5>
                    </div>
                </div>

                <div className="row mt-2 border ">
                    <div className="col-md-6 border p-2">
                        <p className='p-0 m-0'>
                            <strong>
                                # Invoice</strong> : <b className='text-dark'>
                                {invoiceNo}
                            </b>
                        </p>
                        <p className='p-0 m-0'>
                            <strong>
                                Invoice Date</strong>: <b className='text-dark'>
                                {invoiceDate}
                            </b>
                        </p>
                        <p className='p-0 m-0'>
                            <strong>
                                Terms</strong>: <b className='text-dark'>
                                : Due on Receipt
                            </b>
                        </p>
                    </div>

                    <div className="col-md-6 border p-2">
                        <p>
                            <strong>
                                Place Of Supply</strong>: <b className='text-dark'>
                                {placeOfSupply}
                            </b>
                        </p>
                    </div>

                </div>

                <div className="row ">
                    <div className='col-12 p-0'>
                        <h6 className='p-2' style={{ background: "#E9EDF4" }}>Bill To</h6>
                    </div>
                    <div className='col-12 p-2 border'>
                        <b className='text-dark'>{customer.name}</b><br />
                        <b className='text-dark'>{customer.company}</b><br />
                        {customer.address}<br />
                        {customer.email}

                    </div>
                    <div className='col-12 p-0'>
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Plan</th>
                                    <th>Included Services</th>
                                    {/* <th>Price</th> */}
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{"Basic"}</td>
                                        <td>Hrms/INVOICE</td>
                                        {/* <td>{item.rate}</td> */}
                                        <td>
                                            ₹599.00
                                            {/* {formatCurrency(599.00)} */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

                <div className=" row">
                    <div className="col-md-6 border">
                        <div className="py-2">
                            <strong>Total in Words:</strong><br />
                            {amountInWords}
                        </div>
                        <h6>Invoice to be paid at:</h6>
                        <div>
                            Company Name: Cyber Vision Infotech Private Limited<br />
                            Bank Account: 506002386881<br />
                            IFSC: HDFC0000508<br />
                            Swift Code: HDFCINBB<br />
                            Bank Name: HDFC Bank Limited<br />
                            Company Address: Second Floor, Plot No 96B, Udyog Vihar Phase-2, Gurugram, Haryana, Zip Code: 122016 (INDIA)<br />
                            Bank Branch Address: Vashis Kunj, ENKAY SQUARE, Nr B1, Phase IV, Gurugram, Haryana, Zip Code: 122001 (INDIA)
                        </div>
                    </div>

                    <div className="col-md-6 text-end border">
                        <div className="mb-3 pt-1">
                            <div className="d-flex justify-content-between">
                                <strong>Sub Total</strong>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <strong>Tax (Inclusive)</strong>
                                <span>₹0</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <strong>Discount</strong>
                                <span>₹0</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                                <strong>Total</strong>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="text-end border p-2 mb-1">
                            <div className='d-flex justify-content-center '>
                                <img src="/assets/images/sign.png" alt="Signature" height={50} /><br />
                            </div>
                            <small>{signatureName}</small><br />
                            <em>Authorized Signature</em>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-2 gap-2">
                    <button 
                    onClick={()=>{
                        handleData.onClose()
                    }}
                    className="btn btn-secondary">Cancel</button>
                    {/* <button className="btn btn-primary">Save As Draft</button> */}
                    <button className="btn btn-success">
                        <i className='ti ti-download' />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;


