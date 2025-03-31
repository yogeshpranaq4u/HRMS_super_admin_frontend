import React, { useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getDemoRequestData } from '../redux/actions/dashBoardActions'

function DemoRequest() {
    const dispatch = useDispatch()
    const allRequest = useSelector((state)=>state.commenData.demoRequestsData)
    // console.log("data " ,allRequest);
    useEffect(() => {
        dispatch(getDemoRequestData("all"))
    }, [])

    return (
        <MainLayout>
            <div>
                DemoRequest
            </div>
        </MainLayout>
    )
}

export default DemoRequest
