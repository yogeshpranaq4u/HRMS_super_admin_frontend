import React, { useEffect, useState } from "react";

const TableComponent = ({ tableHeader, dataSource, dataKeys }) => {

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
          </tr>
        </thead>
        <tbody>
          {
            dataSource?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>test</td>

                </tr>
              )
            })
          }
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default TableComponent;
