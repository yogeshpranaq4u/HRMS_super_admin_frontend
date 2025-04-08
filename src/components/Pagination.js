import React from 'react'

function Pagination({pagination, onPageChange}) {
    const currentPage  = pagination?.currentPage||1;
    const totalPage  = pagination?.totalPage||1;
    const total  = pagination?.total||1;
    const limit  = pagination?.limit||1;
    // const { currentPage, totalPage, total, limit } = pagination;
    // const { currentPage, totalPage, total, limit } = pagination;

    const pages = [];
    for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
    }

    const handleClick = (page) => {
        if (page !== currentPage && onPageChange) {
            onPageChange(page);
        }
    };
    return (
        <div className="row p-3 align-items-center">
            <div className="col-sm-12 col-md-5">
                <div className="dataTables_info" role="status" aria-live="polite">
                    Showing {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, total)} of {total} entries
                </div>
            </div>
            <div className="col-sm-12 col-md-7 sv-dataTables_paginate">
                <div className="dataTables_paginate paging_simple_numbers mt-0 p-0">
                    <ul className="pagination">
                        <li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
                                <i className="ti ti-chevron-left"></i>
                            </button>
                        </li>
                        {pages.map(page => (
                            <li key={page} className={`paginate_button page-item ${page === currentPage ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handleClick(page)}>{page}</button>
                            </li>
                        ))}
                        <li className={`paginate_button page-item next ${currentPage === totalPage ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPage}>
                                <i className="ti ti-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    )
}

export default Pagination
