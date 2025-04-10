import React from 'react'

function ConfirmDelete({handleData}) {
    return (
        <div className="modal fade show" id="delete_modal" aria-modal="true" role="dialog" style={{display:"block"}}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content">
                    <div className="modal-body text-center">
                        <span className="avatar avatar-xl bg-transparent-danger text-danger mb-3">
                            <i className="ti ti-trash-x fs-36"></i>
                        </span>
                        <h4 className="mb-1">Confirm Delete</h4>
                        <p className="mb-3">{
                            handleData?.message ? handleData?.message :
                            "You want to delete all the marked items, this cant be undone once you delete."
                            }
                            
                            </p>
                        <div className="d-flex justify-content-center">
                            <a onClick={handleData.onClose} className="btn btn-light me-3" data-bs-dismiss="modal">Cancel</a>
                            <a onClick={handleData.onCanfirm} className="btn btn-danger">Yes, Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDelete
