import React, { useState } from 'react'
import SideBar from './SideBar'
import Header from './Header'

function MainLayout({ children }) {
    const [mobileMenu, setmobileMenu] = useState(false)
    const handleTogel = ()=>{
        setmobileMenu(!mobileMenu)
    }
    return (
        <section className={`main-wrapper ${mobileMenu ? "slide-nav":""}`}>
            <Header  handleTogel={handleTogel}/>
            <SideBar />
            {children}
        </section>
    )
}

export default MainLayout
