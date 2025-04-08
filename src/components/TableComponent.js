import React from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../helpers/frontend";

const TableComponent = ({ tableHeader, dataSource, dataKeys, onEdit, handleDelete, onView, historyLink }) => {
  const plansData = useSelector((state) => state.commenData.allPlans)
  // console.log("plansData" ,plansData);
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
              {dataKeys?.map((key, colIndex) => {
                if (key == "status") {
                  return (
                    <td key={colIndex}>
                      <span class={`badge badge-${item[key] == "Active" ? "success" : item[key] == "Hold" ? "warning" : "danger"} d-inline-flex align-items-center badge-xs`}>
                        <i className="ti ti-point-filled me-1"></i>
                        {item[key] !== undefined && item[key] !== '' ? item[key] : '-'}
                      </span>
                    </td>
                  )
                } else if (key == "service_type") {
                  const validSelection = Array.isArray(item[key])
                    ? item[key]
                    : JSON.parse(item[key] || "[]");
                  // console.log(item[key] ,validSelection);
                  return (
                    <td key={colIndex}>
                      <div className="d-flex align-items-center justify-content-between">
                        {
                          JSON.parse(validSelection || "[]")?.map((item, index) => {
                            return (
                              <p key={index} className='p-0 m-0'>{item},</p>
                            )
                          })
                        }
                      </div>
                    </td>
                  )
                } else if (key == "plan_id") {
                  const findPlan = plansData?.data?.find((planItem) => { return planItem?.id == item[key] }) || {}
                  return (
                    <td key={colIndex}>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="mb-0 me-2">
                          {findPlan?.name}-({findPlan?.duration})
                        </p>
                        {
                          item[key] < 2 &&
                          <a className="badge badge-purple badge-xs" >Upgrade</a>
                        }
                      </div>
                    </td>
                  )
                } else if (key == "plan_dates") {
                  // const findPlan = plansData?.data?.find((planItem) => { return planItem?.id == item[key] }) || {}
                  return (
                    <td key={colIndex}>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="mb-0 me-2">
                          {formatDate(item["plan_start_date"])} - {formatDate(item["plan_end_date"])}
                        </p>
                      </div>
                    </td>
                  )
                } else {
                  return (
                    <td key={colIndex}>{item[key] !== undefined && item[key] !== '' ? item[key] : '-'}</td>
                  )
                }
              })}

              <td>
                <div className="action-icon d-inline-flex">
                  {
                    historyLink &&
                    <a href={historyLink} className="me-2" title='view history' >
                      <i class="ti ti-history"></i>
                    </a>
                  }
                  {
                    onView &&
                    <a href="#" className="me-2"
                      onClick={() => { onView(item, "view") }}
                      title='View Details'>
                      <i className="ti ti-eye"></i>
                    </a>
                  }
                  {
                    onEdit &&
                    <a href="#" className="me-2"
                      onClick={() => { onEdit(item, "edit") }}
                      title='Register' >
                      <i className="ti ti-user-edit"></i>
                    </a>
                  }
                  {/* <a href="#" className="me-2" title='Edit' ><i className="ti ti-edit"></i></a> */}
                  {
                    handleDelete &&
                    <a onClick={() => { handleDelete(item, "delete") }} ><i className="ti ti-trash"></i></a>
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
