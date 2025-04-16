import React from 'react'

function Footer() {
  return (
    <div>
      <footer class="bg-light border-top">
        <div class="container py-5">
          <div class="row text-start text-md-left">

            {/* <!-- Developed Team --> */}
            <div class="col-md-4 mb-4">
              <h6 class="fw-bold">Developed Team</h6>
              <p class="text-muted small">
                Starting from a very humble beginning, the founders of Cyber Vision Infotech Pvt. Ltd.
                (formerly CV Infotech), Akash and Ekta, had a common goal to become the best team you can RELY ON!
              </p>
            </div>

            {/* <!-- Quick Links --> */}
            <div class="col-md-4 mb-4">
              <h6 class="fw-bold">Quick Links</h6>
              <ul class="list-unstyled small text-muted">
                <li><a href="#" class="text-decoration-none text-muted">Refund Policy</a></li>
                <li><a href="#" class="text-decoration-none text-muted">Privacy Policy</a></li>
                <li><a href="#" class="text-decoration-none text-muted">Terms & Conditions</a></li>
              </ul>
            </div>

            
            <div class="col-md-4 mb-4">
              <h6 class="fw-bold">Contact Us</h6>
              <p class="mb-2 small text-muted d-flex gap-1 align-items-center">
              <svg    width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-mail"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" /><path d="M3 7l9 6l9 -6" /></svg>
                 <a href="mailto:hrms@cvinfotech.com" class="text-decoration-none text-muted">hrms@cvinfotech.com</a>
              </p>
              <p class="small text-muted d-flex gap-1 align-items-center">
              <svg    width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-phone"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></svg>
               <a href="tel:+918766291838" class="text-decoration-none text-muted">+91-8766291838</a>
              </p>
            </div>

          </div>
        </div>

        <div class="bg-body-secondary text-center py-3 small">
          Powered By CV Infotech Pvt Ltd
        </div>
      </footer>

    </div>
  )
}

export default Footer
