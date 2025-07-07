export default function Nav() {
    return(
        <nav className="navbar navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" data-scroll="false">
          <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
              
              <h6 className="fw-bold text-white mb-0 fs-4">Tổng quan</h6>
            </nav>
            <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4">
              <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                <div className="input-group">
                  <span className="input-group-text text-body">
                    <i className="fas fa-search" aria-hidden="true"></i>
                  </span>
                  <input type="text" className="form-control" placeholder="Type here..." />
                </div>
              </div>
              <ul className="navbar-nav justify-content-end">
                <li className="nav-item d-flex align-items-center">
                  <a href="#" className="nav-link text-white fw-bold px-0">
                    <i className="fa fa-user me-sm-1"></i>
                    <span className="d-sm-inline d-none">Đăng nhập</span>
                  </a>
                </li>
                <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                  <a href="#" className="nav-link text-white p-0" id="iconNavbarSidenav">
                    <div className="sidenav-toggler-inner">
                      <i className="sidenav-toggler-line bg-white"></i>
                      <i className="sidenav-toggler-line bg-white"></i>
                      <i className="sidenav-toggler-line bg-white"></i>
                    </div>
                  </a>
                </li>
                
              </ul>
            </div>
          </div>
        </nav>
    )
}