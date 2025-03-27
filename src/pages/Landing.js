import React from 'react'

function Landing() {
    return (
        <main>
            <div className='landing-sec-1 p-2 px-4'>
                <div className='navbar'>
                    <div className='header-logo'>
                        <img src='/assets/images/logo.png' alt='cvinfotech' />
                    </div>
                    <button type='button' className='request-btn'>Request Demo</button>
                </div>
                <section class="flex flex-col items-center text-center p-8">
                    <h1 class="text-4xl font-bold md:text-5xl">Lorem Ipsum is simply dummy text</h1>
                    <p class="mt-4 text-gray-300 max-w-2xl">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                    <button class="watch-btn">
                        Watch 5 min tutorial video
                    </button>
                </section>
                <section class="flex justify-center p-8">
                    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                        <img src="/assets/images/NewDashboard.png" alt="Dashboard Preview" class="rounded-lg w-full" />
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Landing
