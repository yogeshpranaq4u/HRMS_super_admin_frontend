import React from 'react'
import SideBar from './SideBar'
import Header from './Header'

function MainLayout({ children }) {
    return (
        <section class="main-wrapper">
            <Header/>
            <SideBar/>
            {children}
        </section>
    )
}

export default MainLayout
