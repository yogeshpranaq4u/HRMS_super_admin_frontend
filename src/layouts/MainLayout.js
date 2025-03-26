import React from 'react'
import SideBar from './SideBar'
import Header from './Header'

function MainLayout({ children }) {
    return (
        <section class="nk-body bg-lighter npc-general has-sidebar ">
            <div class="nk-app-root">
                <div class="nk-main ">
                    {/* sidebar */}
                    <SideBar />
                    <div class="nk-wrap ">
                        {/* header */}
                        <Header />
                        {children}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default MainLayout
