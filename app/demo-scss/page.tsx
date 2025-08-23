'use client';

import { Button, Card, CardHeader, CardBody, CardFooter } from '@/components';
import Link from 'next/link';

export default function SCSSDemoPage() {
  return (
    <div className="container my-5">
      <h1 className="mb-4">SCSS Components Demo</h1>
      
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="container">
          <h3 className="text-center">SCSS Demo</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Trang Chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">SCSS Demo</li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Buttons Demo */}
      <section className="mb-5">
        <h2>Buttons</h2>
        <div className="d-flex gap-3 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="outline">Outline</Button>
        </div>
        
        <div className="d-flex gap-3 flex-wrap mt-3">
          <Button variant="primary" size="small">Small</Button>
          <Button variant="primary" size="large">Large</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </section>
      
      {/* Cards Demo */}
      <section className="mb-5">
        <h2>Cards</h2>
        <div className="row">
          <div className="col-md-4 mb-3">
            <Card variant="primary" hover>
              <CardHeader title="Primary Card" subtitle="This is a primary card">
                <span className="badge bg-primary">New</span>
              </CardHeader>
              <CardBody>
                <p>This is the card body content. You can put any content here.</p>
              </CardBody>
              <CardFooter>
                <Button variant="primary" size="small">Action</Button>
                <small className="text-muted">2 hours ago</small>
              </CardFooter>
            </Card>
          </div>
          
          <div className="col-md-4 mb-3">
            <Card variant="success" hover>
              <CardHeader title="Success Card" subtitle="This is a success card" />
              <CardBody>
                <p>This card shows success state with green accent.</p>
              </CardBody>
              <CardFooter>
                <Button variant="success" size="small">Success</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="col-md-4 mb-3">
            <Card variant="warning" hover>
              <CardHeader title="Warning Card" subtitle="This is a warning card" />
              <CardBody>
                <p>This card shows warning state with orange accent.</p>
              </CardBody>
              <CardFooter>
                <Button variant="warning" size="small">Warning</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Grid Demo */}
      <section className="mb-5">
        <h2>Responsive Grid</h2>
        <div className="row">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
              <Card compact>
                <CardBody>
                  <h5>Item {item}</h5>
                  <p>This is a responsive grid item.</p>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </section>
      
      {/* Form Demo */}
      <section className="mb-5">
        <h2>Form Elements</h2>
        <div className="row">
          <div className="col-md-6">
            <Card>
              <CardHeader title="Contact Form" subtitle="Fill out the form below" />
              <CardBody>
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Enter your name" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter your email" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea className="form-control" id="message" rows={3} placeholder="Enter your message"></textarea>
                  </div>
                </form>
              </CardBody>
              <CardFooter>
                <Button variant="primary" fullWidth>Submit</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="col-md-6">
            <Card variant="info">
              <CardHeader title="Information" subtitle="Important details" />
              <CardBody>
                <p>This is an information card with different styling.</p>
                <ul>
                  <li>Feature 1</li>
                  <li>Feature 2</li>
                  <li>Feature 3</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
