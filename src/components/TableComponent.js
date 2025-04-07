import React, { useEffect, useState } from "react";

const TableComponent = ({ tableHeader, dataSource, dataKeys, onEdit, handleDelete, onView }) => {

  return (
    <React.Fragment>
      <table className="table datatable">
        <thead className="thead-light">
          <tr>
            {
              tableHeader?.map((tableHead, index) => {
                return (
                  <th key={index}>{tableHead}</th>
                )
              })
            }
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataSource?.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {dataKeys?.map((key, colIndex) => (
                <td key={colIndex}>{item[key] !== undefined && item[key] !== '' ? item[key] : '-'}</td>
              ))}

              <td>
                <div className="action-icon d-inline-flex">
                  {
                    onView &&
                    <a href="#" className="me-2"
                      onClick={()=>{onView(item ,"view")}}
                      title='View Details'>
                      <i className="ti ti-eye"></i>
                    </a>
                  }
                  {
                    onEdit &&
                    <a href="#" className="me-2"
                      onClick={()=>{onEdit(item ,"edit")}}
                      title='Register' >
                      <i className="ti ti-user-edit"></i>
                    </a>
                  }
                  {/* <a href="#" className="me-2" title='Edit' ><i className="ti ti-edit"></i></a> */}
                  {
                    handleDelete &&
                    <a  onClick={()=>{handleDelete(item ,"delete")}} ><i className="ti ti-trash"></i></a>
                  }
                </div>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </React.Fragment>
  );
};

export default TableComponent;
