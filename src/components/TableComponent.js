import React from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../helpers/frontend";
import { useNavigate } from "react-router-dom";
import { ImagePath } from "../config/apiEndPoints";

const TableComponent = ({ tableHeader, pdfView, pdfDownload, dataSource, dataKeys, onEdit, handleDelete, onView, historyLink }) => {
  const plansData = useSelector((state) => state.commenData.allPlans)
  const navigate = useNavigate()
  // console.log("plansData" ,plansData);
  return (
    <React.Fragment>
      <table className="table datatable">
        <thead className="thead-light">
          <tr>
          <th>Sr. No.</th>
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
              <td>{rowIndex+1}</td>
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
                } else if (key == "services" &&item["services"]) {
                  // console.log("debug 1" ,item[key]);

                  return (
                    <td key={colIndex}>
                      <div className="d-flex align-items-center justify-content-between">
                        {
                          item[key]?.map((item, index) => {
                            // console.log(index == 0  ,  item[key] );
                            return (
                              <p key={index} className='p-0 m-0 text-capitalize '>{item?.name} 
                                {index == 0 ? "/":""}</p>
                            )
                          })
                        }

                      </div>
                    </td>
                  )
                }else if (key == "service_type" && item['current_plan']) {
                  // console.log("debug 2" ,item?.current_plan?.services);
                  
                  return (
                    <td key={colIndex}>
                      <div className="d-flex align-items-center justify-content-between">
                        {
                          item['current_plan']?.services?.map((item, index) => {
                            // console.log(index == 0  ,  item['current_plan']?.services?.length );
                            return (
                              <p key={index} className='p-0 m-0 text-capitalize '>{item?.name}
                                {index == 0 ?  "/":""}</p>
                            )
                          })
                        }
                      </div>
                    </td>
                  )
                }  else if (key == "plan_id") {
                  // console.log("findPlan?.name?.toLowerCase()" ,findPlan?.name?.toLowerCase());
                  
                  const findPlan = plansData?.data?.find((planItem) => { return planItem?.id == item[key] }) || {}
                  return (
                    <td key={colIndex}>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="mb-0 me-2">
                          {findPlan?.name}-({findPlan?.duration})
                        </p>
                       
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
                  // console.log(item?.company_logo);
                  return (
                    <td key={colIndex}>
                      {
                        key == "invoice" ? item?.invoice?.invoice_no :
                        <React.Fragment>

                          {["price", "total_price"]?.includes(key) && "₹"}
                          {
                            key == "company_name" ?
                              <div className="d-flex align-items-center gap-2">
                                <span className="avatar ">
                                  <img src={item["company_logo"] ? ImagePath + item["company_logo"] : "/assets/img/user.png"} className="img-fluid rounded-circle border " alt="logo" />
                                </span>
                                {
                                  item[key] !== undefined && item[key] !== '' ? item[key] : '-'
                                }
                              </div> :
                              item[key] !== undefined && item[key] !== '' ? item[key] : '-'
                          }
                           {
                            key == "plan_name" &&  item?.plan_name?.toLowerCase() == "basic" &&
                                <a onClick={()=>{
                                  pdfView(item, "upgrade")
                                }} className="ml-2 badge badge-purple badge-xs" >Upgrade</a>
                            }
                        </React.Fragment>
                      }
                    </td>
                  )
                }
              })}

              <td>
                <div className="action-icon d-inline-flex">
                  {
                    historyLink &&
                    <div onClick={() => {
                      navigate(historyLink, { state: { data: item["id"] } })
                    }} className="me-2" title='view history' >
                      <i className="ti ti-history"></i>
                    </div>
                  }
                  {
                    onView &&
                    <div className="me-2"
                      onClick={() => { onView(item, "view") }}
                      title='View Details'>
                      <i className="ti ti-eye"></i>
                    </div>
                  }
                  {
                    pdfView &&
                    <div className="me-2"
                      onClick={() => { pdfView(item, "pdfView") }}
                      title='View Invoice'>
                      <i className="ti ti-file-text"></i>
                    </div>
                  }
                  {
                    pdfDownload &&
                    <div className="me-2"
                      onClick={() => { pdfDownload(item, "pdfDownload") }}
                      title='View download'>
                      <i className="ti ti-download"></i>
                    </div>
                  }
                  {
                    onEdit &&
                    <div className="me-2"
                      onClick={() => { onEdit(item, "edit") }}
                      title='Register' >
                      <i className="ti ti-user-edit"></i>
                    </div>
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
