"use client";


import Link from 'next/link';
import Image from 'next/image';

export default function ContactUs() {
  return (
    <section>
      <div className="contact-page">
        {/* Breadcrumb Section */}
        <div className="breadcrumb-section">
          <div className="container">
            <h3 className="text-center">Liên Hệ</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">Trang Chủ</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Liên Hệ</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Main content*/}
        <div className="contact-main container">
          <div className="row align-items-start">
            {/* Form*/}
            <div className="col-lg-6">
              <form className="contact-form">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="firstName">
                      First Name*
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="firstName"
                      placeholder="Ex. John"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="lastName">
                      Last Name*
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="lastName"
                      placeholder="Ex. Doe"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="email">
                      Email*
                    </label>
                    <input
                      className="form-control"
                      type="email"
                      id="email"
                      placeholder="BRC@gmail.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="phone">
                      Phone*
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="phone"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="subject">
                      Subject*
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="subject"
                      placeholder="Enter here.."
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="message">
                      Your Message*
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      rows={4}
                      placeholder="Enter here.."
                      defaultValue={""}
                    />
                  </div>
                  <div className="col-12">
                    <button className="btn-send" type="submit">
                      Send a Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {/* */}
            <div className="col-lg-6 d-none d-lg-block">
              <div className="contact-image">
                <Image
                  className="img-fluid rounded"
                  src="/images/contact-illustration.png"
                  alt="Contact Illustration"
                  width={500}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Contact Info*/}
        <div className="contact-info container mt-5">
          <div className="row text-center">
            <div className="col-md-4">
              <div className="info-box">
                <Image className="icon" src="/icons/address.svg" alt="Address" width={32} height={32} />
                <div className="info-title">Address</div>
                <div className="info-text">
                  37 đường số 9 phường 17 quận gò vấp 
              </div>
            </div>
            <div className="col-md-4">
              <div className="info-box">
                <Image className="icon" src="/icons/phone.svg" alt="Phone" width={32} height={32} />
                <div className="info-title">Phone</div>
                <div className="info-text">+84344712604</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="info-box">
                <Image className="icon" src="/icons/email.svg" alt="Email" width={32} height={32} />
                <div className="info-title">Email</div>
                <div className="info-text">BRC@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
