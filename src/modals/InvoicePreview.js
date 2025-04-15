import React from 'react';
import { formatCurrency } from '../helpers/frontend';
import { ImagePath } from '../config/apiEndPoints';
// import './InvoicePreview.css';

const InvoicePreview = ({ handleData, companyData }) => {
    const details = handleData?.data
    console.log("handleData", details);
    const customer = {
        name: 'Yogesh Rana',
        company: 'Yogesh Pvt Ltd',
        address: 'New Delhi 110059 Delhi',
        email: 'sadqrfdv@kk.com'
    }

    return (
        <div className="modal fade show  preview-invoice-overlay">
            <div className=" preview-invoice border p-4 bg-white shadow">

                <div className="d-flex justify-content-between align-items-end">
                    <div className='d-flex justify-content-between align-items-start gap-3'>
                        <div>
                            <img src="/assets/images/logoNew.png" alt="Logo" style={{ height: 50 }} />
                        </div>
                        <div className="text-start">
                            <h5>Cyber Vision Infotech Private Limited</h5>
                            <div className="small">
                                <div>Company ID: U72900HR2021PTC098108</div>
                                <div>Address: 2nd Floor, Plot No 96,</div>
                                <div>Gurgaon Udyog Vihar, Phase 2</div>
                                <div>Haryana, 122016</div>
                                <div>GSTIN: 06AAJCC8706J2ZF</div>
                            </div>
                        </div>
                    </div>
                    <div className="text-end ">
                        <h5 className="mt-2">TAX INVOICE</h5>
                    </div>
                </div>

                <div className="row mt-2 border ">
                    <div className="col-md-6 border p-2">
                        <p className='p-0 m-0'>
                            <strong>
                                # Invoice</strong> : <b className='text-dark'>
                                {details?.invoice?.invoice_no || "NA"}
                            </b>
                        </p>
                        <p className='p-0 m-0'>
                            <strong>
                                Invoice Date</strong>: <b className='text-dark'>
                                {details?.invoice?.invoice_date || "NA"}
                            </b>
                        </p>
                        <p className='p-0 m-0'>
                            <strong>
                                Terms</strong>: <b className='text-dark'>
                                : Due on Receipt
                            </b>
                        </p>
                        <p className='p-0 m-0'>
                            <strong>
                                Due Date</strong>: <b className='text-dark'>
                                {details?.invoice?.due_date || "NA"}
                            </b>
                        </p>
                    </div>

                    <div className="col-md-6 border p-2">
                        <p>
                            <strong>
                                Place Of Supply</strong>: <b className='text-dark'>
                                {companyData?.place_of_supply}
                            </b>
                        </p>
                    </div>

                </div>

                <div className="row ">
                    <div className='col-12 p-0'>
                        <h6 className='p-2' style={{ background: "#E9EDF4" }}>Bill To</h6>
                    </div>
                    <div className='col-12 p-2 border'>
                        <b className='text-dark'>{companyData?.company_name}</b><br />
                        <b className='text-dark'>{companyData?.company_name}</b><br />
                        {companyData?.company_address}<br />
                        {companyData?.admin_email}

                    </div>
                    <div className='col-12 p-0'>
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Item & Description </th>
                                    <th>Qty</th>
                                    <th>Rate</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <td>1</td>
                                    <td>
                                        {
                                            details?.plan_name
                                        }
                                    </td>
                                    <td>1</td>
                                    <td>₹{details?.plan_price}</td>
                                    <td>
                                        ₹{details?.plan_price}
                                    </td>
                                </tr>
                                {
                                    details?.services?.map((item, index) => {
                                        return (
                                            <tr key={index} >
                                                <td></td>
                                                <td>
                                                    - {item?.name} ({item.type})
                                                </td>
                                                <td></td>
                                                <td>₹{item?.price}</td>
                                                <td>
                                                    ₹{item?.price}
                                                </td>
                                            </tr>

                                        )
                                    })
                                }

                            </tbody>
                        </table>
                    </div>

                </div>

                <div className=" row">
                    <div className="col-md-6 border">
                        <div className="py-2">
                            <strong>Total in Words:</strong><br />
                            {details?.invoice?.price_in_words}
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
                                <span>₹{details?.invoice?.sub_total}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <strong>Tax (Inclusive)</strong>
                                <span>₹{details?.invoice?.tax || "0.00"}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <strong>Discount</strong>
                                <span>₹{details?.invoice?.discount_price}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                                <strong>Total</strong>
                                <span>₹{details?.invoice?.sub_total}</span>
                            </div>
                        </div>

                        <div className="text-end border p-2 mb-1">
                            <div className='d-flex justify-content-center '>
                                <img src="/assets/images/sign.png" alt="Signature" height={50} /><br />
                            </div>
                            <small>{"Akash Singh"}</small><br />
                            <em>Authorized Signature</em>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-2 gap-2">
                    <button
                        onClick={() => {
                            handleData.onClose()
                        }}
                        className="btn btn-secondary">close</button>
                    {/* <button className="btn btn-primary">Save As Draft</button> */}
                    {/* <button className="btn btn-success">
                        <i className='ti ti-download' />
                        Download
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;


