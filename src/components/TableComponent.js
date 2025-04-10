import React from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../helpers/frontend";
import { useNavigate } from "react-router-dom";

const TableComponent = ({ tableHeader, pdfView, pdfDownload, dataSource, dataKeys, onEdit, handleDelete, onView, historyLink }) => {
  const plansData = useSelector((state) => state.commenData.allPlans)
  const navigate = useNavigate()
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
                  const reVlidate = !Array.isArray(validSelection) ? JSON.parse(validSelection || "[]") : validSelection
                  return (
                    <td key={colIndex}>
                      <div className="d-flex align-items-center justify-content-between">
                        {
                          reVlidate?.map((item, index) => {
                            return (
                              <p key={index} className='p-0 m-0 text-capitalize '>{item}
                                {index == 0 && reVlidate?.length > 1 && "/"}</p>
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
                  // console.log(item ,item["company_logo"]);
                  
                  return (

                    <td key={colIndex}>
                      {
                        // item["company_logo"] !== undefined ?
                        //   <div class="d-flex align-items-center file-name-icon">
                        //     <a class="avatar avatar-md border rounded-circle" href="/react/template/super-admin/companies" data-discover="true">
                        //       <img class="img-fluid" alt="img" src="/react/template/assets/img/company/company-01.svg" />
                        //     </a><div class="ms-2"><h6 class="fw-medium">
                        //       <a href="/react/template/super-admin/companies" data-discover="true">BrightWave Innovations</a></h6>
                        //     </div>
                        //   </div> :
                          item[key] !== undefined && item[key] !== '' ? item[key] : '-' 

                      }
                    </td>
                  )
                }
              })}

              <td>
                <div className="action-icon d-inline-flex">
                  {
                    historyLink &&
                    <a onClick={() => {
                      navigate(historyLink, { state: { data: item["id"] } })
                    }} className="me-2" title='view history' >
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
                    pdfView &&
                    <a href="#" className="me-2"
                      onClick={() => { pdfView(item, "pdfView") }}
                      title='View Invoice'>
                      <i className="ti ti-file-text"></i>
                    </a>
                  }
                  {
                    pdfDownload &&
                    <a href="#" className="me-2"
                      onClick={() => { pdfDownload(item, "pdfDownload") }}
                      title='View Invoice'>
                      <i className="ti ti-download"></i>
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
