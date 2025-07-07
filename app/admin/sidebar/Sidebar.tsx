import Link from "next/link";

const listMenu = [
    {
        id: 1,
        title: "Tông quan",
        href: "/admin/dashboard",
    },
    {
        id: 2,
        title: "Quản lý sản phẩm",
        href: "/admin/product",
    },
    {
        id: 3,
        title: "Quản lý đơn hàng",
        href: "/admin/orders",
    },
    {
        id: 4,
        title: "Quản lý danh mục",
        href: "/admin/categories",
    },
]
export default function Sidebar(){
    return(
        <>
        <aside className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-4 " id="sidenav-main">
    <div className="sidenav-header">
      <i className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
      <Link className="navbar-brand m-0" href="/admin/dashboard ">
        <img src="/client/images/logo.png" width="32px" height="32px" className="navbar-brand-img h-100" alt=""/>
        <span className="ms-1 font-weight-bold">Admin Tap Hoa Xanh</span>
      </Link>
    </div>
    <hr className="horizontal dark mt-0"/>
    <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
      <ul className="navbar-nav">
        {listMenu.map((item)=>(
                <li className="nav-item" key={item.id}>
                <Link className="nav-link active" href={item.href}>
                    <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                    <i className="ni ni-tv-2 text-dark text-sm opacity-10"></i>
                    </div>
                    <span className="nav-link-text ms-1">{item.title}</span>
                </Link>
                </li>
            
        ))}
        
        <li className="nav-item mt-3">
          <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">Trang tài khoản</h6>
        </li>
        <li className="nav-item">
          <Link className="nav-link " href="/admin/users">
            <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
              <i className="ni ni-single-02 text-dark text-sm opacity-10"></i>
            </div>
            <span className="nav-link-text ms-1">Quản lý người dùng</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link " href="../pages/sign-in.html">
            <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
              <i className="ni ni-single-copy-04 text-dark text-sm opacity-10"></i>
            </div>
            <span className="nav-link-text ms-1">Đăng nhập</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link " href="../pages/sign-up.html">
            <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
              <i className="ni ni-collection text-dark text-sm opacity-10"></i>
            </div>
            <span className="nav-link-text ms-1">Đăng ký</span>
          </Link>
        </li>
      </ul>
    </div>
  </aside>
        </>
    )
}