import Nav from '../nav/Nav';


const loadDashboard = [
  {
    id: 1,
    title: `Doanh thu`,
    amount: '53,000 VNĐ',
    change: '+55%',
  },
  {
    id: 2,
    title: `Số lượng người dùng`,
    amount: '53,000',
    change: '+55%',
  },
  {
    id: 3,
    title: `Sản phẩm`,
    amount: '53,000',
    change: '+55%',
  },
  {
    id: 4,
    title: `Today's Money`,
    amount: '$53,000',
    change: '+55%',
  }
]
function Dashboard() {
  return (
    <>
      
        <Nav/>

    <div className="container-fluid py-4">
      <div className="row">
        {
          loadDashboard.map((item)=>(


<div className="col-xl-3 col-sm-3 mb-xl-0 mb-4" key={item.id}>
          <div className="card">
            <div className="card-body p-3">
              <div className="row">
                <div className="col-12">
                  <div className="numbers">
                    <p className="text-sm mb-0 text-uppercase font-weight-bold">{item.title}</p>
                    <h5 className="font-weight-bolder">
                      {item.amount}
                    </h5>
                    <p className="mb-0">
                      <span className="text-success text-sm font-weight-bolder">+{item.change}</span>
                      since yesterday
                    </p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>

          ))
        }
        
      </div>
      
      <div className="row mt-5">
        <div className="col-sm-12 col-xl-12 mb-lg-0 mb-4">
          <div className="card ">
            <div className="card-header pb-0 p-3">
              <div className="d-flex justify-content-between">
                <h6 className="mb-2">Danh sách sản phẩm được yêu thích nhất</h6>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table align-items-center ">
                <tbody>
                  <tr>
                    <td className="w-30">
                      <div className="d-flex px-2 py-1 align-items-center">
                        <div>
                        </div>
                        <div className="ms-4">
                          <p className="text-xs font-weight-bold mb-0">Tên sản phẩm:</p>
                          <h6 className="text-sm mb-0">Thịt bò</h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <p className="text-xs font-weight-bold mb-0">Giá bán:</p>
                        <h6 className="text-sm mb-0">2500</h6>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <p className="text-xs font-weight-bold mb-0">Số lượt mua:</p>
                        <h6 className="text-sm mb-0">230,900</h6>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;
