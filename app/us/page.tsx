'use client'

import Image from 'next/image'

export default function ContactUs() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-start">
        <div className="col-lg-7">
          <form className="bg-white p-4 rounded shadow-sm">
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label fw-bold">First Name*</label>
                <input type="text" className="form-control" placeholder="Ex. John" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Last Name*</label>
                <input type="text" className="form-control" placeholder="Ex. Doe" />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label fw-bold">Email*</label>
                <input type="email" className="form-control" placeholder="BRC@gmail.com" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Phone*</label>
                <input type="text" className="form-control" placeholder="Enter phone number" />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Subject*</label>
              <input type="text" className="form-control" placeholder="Enter here.." />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Your Message*</label>
              <textarea className="form-control border-success" rows={5} placeholder="Enter here.." />
            </div>
            <button type="submit" className="btn btn-warning text-dark fw-bold px-5 py-2 rounded-3" style={{minWidth:200}}>Send a Message</button>
          </form>
        </div>
        <div className="col-lg-5 d-flex justify-content-center align-items-start mb-4 mb-lg-0">
          <img src="/images/contact-illustration.png" alt="Contact Illustration" style={{maxWidth:'350px',width:'100%'}} />
        </div>
      </div>
      <div className="row text-center mt-5">
        <div className="col-md-4 mb-4 mb-md-0">
          <img src="/images/address-icon.png" alt="Address" width={40} className="mb-2" />
          <div className="fw-bold">Address</div>
          <div className="text-muted">8502 Preston Rd. Inlewood, Maine 98380</div>
        </div>
        <div className="col-md-4 mb-4 mb-md-0">
          <img src="/images/phone-icon.png" alt="Phone" width={40} className="mb-2" />
          <div className="fw-bold">Phone</div>
          <div className="text-muted">+0123-456-789</div>
        </div>
        <div className="col-md-4">
          <img src="/images/email-icon.png" alt="Email" width={40} className="mb-2" />
          <div className="fw-bold">Email</div>
          <div className="text-muted">BRC@gmail.com</div>
        </div>
      </div>
    </div>
  )
}