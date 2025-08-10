'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { useRouter } from 'next/navigation'
import locationService, { MappedProvince, MappedDistrict, MappedWard } from '../../lib/locationService'

// Tạo mã QR ngân hàng thông qua API backend
const generateBankQR = async (amount: number, orderId: string, bankCode: string) => {
  try {
    const response = await api.post('/payment/bank-qr', {
      amount,
      orderId,
      bankCode
    });
    
    const data = response.data as { status: string; data: { qrCodeUrl: string } };
    
    if (data.status === 'success') {
      return data.data.qrCodeUrl;
    } else {
      throw new Error('Failed to generate QR code');
    }
  } catch (error) {
    console.error('Error generating bank QR:', error);
    // Fallback to client-side generation if API fails
    return generateClientSideQR(amount, orderId, bankCode);
  }
};

// Hàm tính CRC16-CCITT cho VIETQR
const calculateCRC16 = (data: string): string => {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
};

// Fallback function for client-side QR generation
const generateClientSideQR = (amount: number, orderId: string, bankCode: string) => {
  // Danh sách ngân hàng hỗ trợ VIETQR
  const banks = {
    '970436': { name: 'Vietcombank', accountNumber: '1234567890' },
    '970403': { name: 'BIDV', accountNumber: '1234567890' },
    '970415': { name: 'Agribank', accountNumber: '1234567890' },
    '970416': { name: 'MB Bank', accountNumber: '1234567890' },
    '970418': { name: 'Techcombank', accountNumber: '1234567890' },
    '970419': { name: 'ACB', accountNumber: '1234567890' },
    '970420': { name: 'Sacombank', accountNumber: '1234567890' },
    '970421': { name: 'VPBank', accountNumber: '1234567890' },
    '970422': { name: 'TPBank', accountNumber: '1234567890' },
    '970423': { name: 'SeABank', accountNumber: '1234567890' },
    '970424': { name: 'VIB', accountNumber: '1234567890' },
    '970425': { name: 'VietinBank', accountNumber: '108874779238' }
  };

  const selectedBankInfo = banks[bankCode as keyof typeof banks] || banks['970436'];
  
  // Thông tin ngân hàng
  const bankInfo = {
    bankCode: bankCode,
    accountNumber: selectedBankInfo.accountNumber,
    accountName: 'TAP HOA XANH',
    bankName: selectedBankInfo.name
  };

  // Tạo chuỗi VIETQR theo chuẩn đơn giản hơn
  const vietqrData = [
    { id: '00', value: '02' }, // Payload Format Indicator
    { id: '01', value: '12' }, // Point of Initiation Method (12 = static QR)
    { id: '26', value: [ // Merchant Account Information
      { id: '00', value: 'A000000727' }, // Global Unique Identifier
      { id: '01', value: bankInfo.bankCode }, // Bank Code
      { id: '02', value: bankInfo.accountNumber }, // Account Number
      { id: '03', value: 'PHAM TUAN KIET' } // Account Name - Sử dụng tên thực tế
    ]},
    { id: '52', value: '0000' }, // Merchant Category Code
    { id: '53', value: '704' }, // Transaction Currency (VND)
    { id: '54', value: amount.toString() }, // Transaction Amount
    { id: '55', value: 'VN' }, // Country Code
    { id: '58', value: 'VN' }, // Merchant City
    { id: '59', value: 'PHAM TUAN KIET' }, // Merchant Name - Sử dụng tên thực tế
    { id: '60', value: 'Ninh Thuan' }, // Merchant City - Cập nhật theo chi nhánh
    { id: '62', value: [ // Additional Data Field Template
      { id: '01', value: orderId } // Reference Label
    ]}
  ];

  // Tạo chuỗi VIETQR
  let vietqrString = '';
  vietqrData.forEach(field => {
    if (Array.isArray(field.value)) {
      // Nested fields
      let nestedString = '';
      field.value.forEach(nestedField => {
        nestedString += `${nestedField.id.padStart(2, '0')}${nestedField.value.length.toString().padStart(2, '0')}${nestedField.value}`;
      });
      vietqrString += `${field.id}${nestedString.length.toString().padStart(2, '0')}${nestedString}`;
    } else {
      vietqrString += `${field.id}${field.value.length.toString().padStart(2, '0')}${field.value}`;
    }
  });

  // Thêm CRC (Cyclic Redundancy Check) - bắt buộc cho VIETQR
  const crc = calculateCRC16(vietqrString + '6304');
  vietqrString += `6304${crc}`;

  // Trả về URL để tạo mã QR ngân hàng
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(vietqrString)}`;
};

type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  slug: string
  images: string
  discount: number
  description: string
  variant_id?: number
  variant_name?: string
  stock?: number
}

function CheckoutPage() {
  console.log('🔥 CheckoutPage component rendered');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    address2: '',
    city: '',
    cityCode: '',
    state: '',
    stateCode: '',
    zip: '',
    zipCode: '',
    phone: '',
    email: '',
    createAccount: false,
    shipToDifferent: false,
    notes: '',
    agree: false,
    payment: '',
    voucher: ''
  });

  // Location data states
  const [provinces, setProvinces] = useState<MappedProvince[]>([]);
  const [districts, setDistricts] = useState<MappedDistrict[]>([]);
  const [wards, setWards] = useState<MappedWard[]>([]);
  const [locationLoading, setLocationLoading] = useState({
    provinces: false,
    districts: false,
    wards: false
  });

  // Debug log for provinces state
  console.log('📊 Current state - Provinces:', provinces.length, 'Districts:', districts.length, 'Wards:', wards.length);



  const [selectedProductVoucher, setSelectedProductVoucher] = useState<string | null>(null)
  const [selectedShippingVoucher, setSelectedShippingVoucher] = useState<string | null>(null)
  const router = useRouter();
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<{
    id?: number;
    code: string;
    min_order_value: number;
    max_discount: number;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState('970425'); // VietinBank mặc định

  useEffect(() => {
    const selected = localStorage.getItem("cart_selected");
    if (!selected || JSON.parse(selected).length === 0) {
      window.location.href = "/cart";
    }
    // Ưu tiên lấy sản phẩm đã chọn (cart_selected), nếu không có thì lấy toàn bộ cart_local
    if (selected) {
      try {
        setCart(JSON.parse(selected));
      } catch {
        setCart([]);
      }
    } else {
      const local = localStorage.getItem("cart_local");
      if (local) {
        try {
          setCart(JSON.parse(local));
        } catch {
          setCart([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Lấy mã voucher đã chọn từ localStorage
    const productCode = localStorage.getItem('selectedProductVoucher')
    const shippingCode = localStorage.getItem('selectedShippingVoucher')
    setSelectedProductVoucher(productCode)
    setSelectedShippingVoucher(shippingCode)
    // Có thể fetch thêm thông tin voucher nếu cần
  }, [])

  useEffect(() => {
    const voucherStr = localStorage.getItem('selectedVoucher');
    if (voucherStr) {
      setSelectedVoucher(JSON.parse(voucherStr));
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('checkout_user_info');
    if (saved) {
      const savedData = JSON.parse(saved);
      setForm(f => ({ 
        ...f, 
        ...savedData,
        payment: '' // Luôn reset về trống
      }));
    }
  }, []);

  // Đảm bảo payment luôn trống khi vào trang checkout
  useEffect(() => {
    setForm(f => ({
      ...f,
      payment: '' // Luôn reset về trống
    }));
  }, []);

  // Load danh sách tỉnh/thành phố khi component mount
  useEffect(() => {
    console.log('🔄 useEffect for provinces triggered');
    const loadProvinces = async () => {
      console.log('🚀 Starting to load provinces...');
      setLocationLoading(prev => ({ ...prev, provinces: true }));
      try {
        console.log('📡 Calling locationService.getProvinces()...');
        const provincesData = await locationService.getProvinces();
        console.log('✅ Successfully loaded provinces:', provincesData.length, provincesData.slice(0, 3));
        setProvinces(provincesData);
        console.log('💾 Provinces state updated');
      } catch (error) {
        console.error('❌ Error loading provinces:', error);
      } finally {
        setLocationLoading(prev => ({ ...prev, provinces: false }));
      }
    };

    loadProvinces();
  }, []);

  // Load danh sách huyện/quận khi chọn tỉnh
  useEffect(() => {
    const loadDistricts = async () => {
      if (form.cityCode) {
        setLocationLoading(prev => ({ ...prev, districts: true }));
        setDistricts([]);
        setWards([]);
        setForm(prev => ({ ...prev, state: '', stateCode: '', zip: '', zipCode: '' }));
        
        try {
          const districtsData = await locationService.getDistrictsByProvince(parseInt(form.cityCode));
          setDistricts(districtsData);
          console.log('Loaded districts for province', form.cityCode, ':', districtsData.length);
        } catch (error) {
          console.error('Error loading districts:', error);
        } finally {
          setLocationLoading(prev => ({ ...prev, districts: false }));
        }
      } else {
        setDistricts([]);
        setWards([]);
      }
    };

    loadDistricts();
  }, [form.cityCode]);

  // Load danh sách xã/phường khi chọn huyện
  useEffect(() => {
    const loadWards = async () => {
      if (form.stateCode) {
        setLocationLoading(prev => ({ ...prev, wards: true }));
        setWards([]);
        setForm(prev => ({ ...prev, zip: '', zipCode: '' }));
        
        try {
          const wardsData = await locationService.getWardsByDistrict(parseInt(form.stateCode));
          setWards(wardsData);
          console.log('Loaded wards for district', form.stateCode, ':', wardsData.length);
        } catch (error) {
          console.error('Error loading wards:', error);
        } finally {
          setLocationLoading(prev => ({ ...prev, wards: false }));
        }
      } else {
        setWards([]);
      }
    };

    loadWards();
  }, [form.stateCode]);



  // Tính tổng tiền
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  if (selectedVoucher && subtotal >= selectedVoucher.min_order_value) {
    discount = Math.min(selectedVoucher.max_discount, subtotal);
  }
  const shipping = subtotal > 300000 ? 0 : 15000;
  const total = subtotal - discount + shipping;

  // Tạo mã QR khi chọn phương thức thanh toán QR
  useEffect(() => {
    if (form.payment === 'qr' && total > 0) {
      setQrLoading(true);
      const orderId = `ORDER_${Date.now()}`;
      
      generateBankQR(total, orderId, selectedBank)
        .then(qrUrl => {
          setQrCodeUrl(qrUrl);
          setQrLoading(false);
        })
        .catch(error => {
          console.error('Error generating QR:', error);
          setQrLoading(false);
        });
    } else {
      setQrCodeUrl('');
      setQrLoading(false);
    }
  }, [form.payment, total, selectedBank]);

  const requiredFields = [
    { key: 'fullName', label: 'Họ và tên' },
    { key: 'address', label: 'Địa chỉ' },
    { key: 'city', label: 'Tỉnh/Thành phố' },
    { key: 'state', label: 'Huyện/Quận' },
    { key: 'zip', label: 'Xã/Thị trấn' },
    { key: 'phone', label: 'Số điện thoại' },
    { key: 'email', label: 'Email' }
  ];

  // Handlers for location selection
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const selectedProvince = provinces.find(p => p.code.toString() === selectedCode);
    
    console.log('🏙️ Province selected:', selectedCode, selectedProvince?.name);
    
    setForm(prev => ({
      ...prev,
      cityCode: selectedCode,
      city: selectedProvince ? selectedProvince.name : '',
      state: '',
      stateCode: '',
      zip: '',
      zipCode: ''
    }));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const selectedDistrict = districts.find(d => d.code.toString() === selectedCode);
    
    console.log('🏘️ District selected:', selectedCode, selectedDistrict?.name);
    
    setForm(prev => ({
      ...prev,
      stateCode: selectedCode,
      state: selectedDistrict ? selectedDistrict.name : '',
      zip: '',
      zipCode: ''
    }));
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const selectedWard = wards.find(w => w.code.toString() === selectedCode);
    
    console.log('🏠 Ward selected:', selectedCode, selectedWard?.name);
    
    setForm(prev => ({
      ...prev,
      zipCode: selectedCode,
      zip: selectedWard ? selectedWard.name : ''
    }));
  };

  // Kiểm tra xem đã nhập đầy đủ thông tin nhận hàng chưa
  const isShippingInfoComplete = () => {
    return requiredFields.every(field => {
      const value = form[field.key as keyof typeof form];
      return value && value.toString().trim() !== '';
    });
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = requiredFields.filter(f => !form[f.key as keyof typeof form]);
    if (missing.length > 0) {
      setErrorFields(missing.map(f => f.label));
      return;
    }
    setErrorFields([]);
    try {
      // Gửi đúng các trường backend yêu cầu
      const orderData = {
        totalPrice: total,
        paymentMethod: form.payment || 'COD',
        comment: form.notes || '',
        discount: discount || 0,
        shippingFee: shipping || 0,
        voucherId: selectedVoucher?.id || null,
        currency: 'VND',
        items: cart.map(item => ({
          product: item.id,
          quantity: item.quantity,
          images: item.images,
          unit_price: item.price
        }))
      };
      
      console.log('🚀 Sending order data:', orderData);
      console.log('🚀 Cart items:', cart);
      console.log('🚀 Total price:', total);
      console.log('🚀 Payment method:', form.payment);
      
      await api.post('/order', orderData);

      // Nếu thành công mới xóa giỏ hàng và chuyển trang
      const cartLocal = JSON.parse(localStorage.getItem('cart_local') || '[]') as CartItem[];
      const cartSelected = JSON.parse(localStorage.getItem('cart_selected') || '[]') as CartItem[];
      const updatedCart = cartLocal.filter((item: CartItem) =>
        !cartSelected.some((sel: CartItem) => sel.id === item.id && sel.variant_id === item.variant_id)
      );
      localStorage.setItem('cart_local', JSON.stringify(updatedCart));
      localStorage.removeItem('cart_selected');
      localStorage.setItem('checkout_user_info', JSON.stringify(form));
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.href = '/profile?tab=orders';
      }, 1500);
    } catch (err: unknown) {
      console.error('🚨 Order error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      const apiError = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      const statusCode = (err as { response?: { status?: number } })?.response?.status;
      
      console.error('🚨 Error details:', {
        message: errorMessage,
        apiError,
        statusCode,
        fullError: err
      });
      
      alert('Có lỗi khi đặt hàng: ' + (apiError?.error || apiError?.message || errorMessage) + (statusCode ? ` (${statusCode})` : ''));
    }
  };

  return (
    <>
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '40px 48px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16
          }}>
            <div style={{fontSize: 60, color: '#22c55e', marginBottom: 8}}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div style={{fontSize: 22, fontWeight: 700, color: '#22c55e', textAlign: 'center'}}>Đã đặt hàng thành công</div>
          </div>
        </div>
      )}
      <main className="main-content">
        <div className="container py-4">
          <div className="row">
            {/* Cột trái: Mặc định hiển thị thông tin nhận hàng, chỉ thay đổi khi chọn phương thức thanh toán */}
            <div className="col-md-7">
              {form.payment === 'qr' ? (
                // Hiển thị mã QR khi chọn thanh toán QR
                <div className="text-center">
                  <div className="alert mb-4" style={{backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534'}}>
                    <h5 className="fw-bold">Thanh toán qua mã QR ngân hàng</h5>
                    <p className="mb-0">
                      <i className="fa-solid fa-university me-2"></i>
                      Quét mã QR bên dưới bằng ứng dụng ngân hàng để thanh toán trực tiếp
                    </p>
                    <p className="mb-0 mt-2">
                      <i className="fa-solid fa-lock me-2 text-success"></i>
                      Mã QR ngân hàng đã được mã hóa với số tiền cố định - Không thể thay đổi
                    </p>
                  </div>
                                    <div className="bg-white p-4 rounded-3" style={{border: '1.5px solid #f3f3f3'}}>
                    {/* Chọn ngân hàng */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">Chọn ngân hàng:</label>
                      <select 
                        className="form-select" 
                        value={selectedBank} 
                        onChange={(e) => setSelectedBank(e.target.value)}
                        style={{borderColor: '#bbf7d0', backgroundColor: '#f0fdf4'}}
                      >
                        <option value="970425">VietinBank (PHAM TUAN KIET)</option>
                        <option value="970436">Vietcombank</option>
                        <option value="970403">BIDV</option>
                        <option value="970415">Agribank</option>
                        <option value="970416">MB Bank</option>
                        <option value="970418">Techcombank</option>
                        <option value="970419">ACB</option>
                        <option value="970420">Sacombank</option>
                        <option value="970421">VPBank</option>
                        <option value="970422">TPBank</option>
                        <option value="970423">SeABank</option>
                        <option value="970424">VIB</option>
                      </select>
                    </div>
                    
                    <div className="text-center">
                      {qrLoading ? (
                        <>
                          <div className="mb-3">
                            <div className="spinner-border text-success" role="status">
                              <span className="visually-hidden">Đang tạo mã QR...</span>
                            </div>
                            <p className="text-muted mt-2">Đang tạo mã QR với thông tin thanh toán...</p>
                          </div>
                          <div className="alert alert-warning" style={{backgroundColor: '#fef3c7', borderColor: '#fde68a', color: '#92400e'}}>
                            <i className="fa-solid fa-exclamation-triangle me-2"></i>
                            <strong>Lưu ý:</strong> Mã QR sẽ được tạo động với số tiền {total.toLocaleString('vi-VN')}₫. 
                            Vui lòng chờ trong giây lát...
                          </div>
                        </>
                      ) : qrCodeUrl ? (
                        <>
                          <img 
                            src={qrCodeUrl}
                            alt="Mã QR thanh toán động" 
                            className="img-fluid"
                            style={{maxWidth: '300px', height: 'auto'}}
                          />
                          <div className="alert alert-success mt-3" style={{backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534'}}>
                            <i className="fa-solid fa-check-circle me-2"></i>
                            <strong>Mã QR ngân hàng đã sẵn sàng!</strong> Quét mã để thanh toán trực tiếp với số tiền {total.toLocaleString('vi-VN')}₫
                          </div>
                        </>
                      ) : (
                        <div className="alert alert-danger">
                          <i className="fa-solid fa-exclamation-triangle me-2"></i>
                          <strong>Lỗi:</strong> Không thể tạo mã QR. Vui lòng thử lại.
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="text-muted mb-2">Số tiền cần thanh toán:</p>
                      <h4 className="fw-bold text-success">{total.toLocaleString('vi-VN')}₫</h4>
                      <div className="alert mt-3" style={{backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534'}}>
                        <i className="fa-solid fa-shield-alt me-2"></i>
                        <strong>Bảo mật:</strong> Mã QR ngân hàng đã được mã hóa với số tiền {total.toLocaleString('vi-VN')}₫ cố định. 
                        Số tiền này không thể thay đổi khi quét mã, đảm bảo an toàn cho giao dịch.
                      </div>
                      <p className="text-muted small mt-2">
                        <i className="fa-solid fa-check-circle me-2 text-success"></i>
                        Sau khi thanh toán thành công, đơn hàng sẽ được xử lý tự động
                      </p>
                    </div>
                  </div>
                </div>
              ) : form.payment === 'bank' ? (
                // Hiển thị form thông tin chuyển khoản ngân hàng
                <div>
                  <div className="alert mb-4" style={{backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534'}}>
                    <h5 className="fw-bold">Thông tin chuyển khoản ngân hàng</h5>
                    <p className="mb-0">Vui lòng điền thông tin để nhận hướng dẫn chuyển khoản</p>
                  </div>
                  <div className="bg-white p-4 rounded-3" style={{border: '1.5px solid #f3f3f3'}}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label>Ngân hàng nhận tiền *</label>
                        <select className="form-control" defaultValue="" style={{borderColor: '#bbf7d0', backgroundColor: '#f0fdf4'}}>
                          <option value="">Chọn ngân hàng</option>
                          <option value="vietcombank">Vietcombank</option>
                          <option value="agribank">Agribank</option>
                          <option value="bidv">BIDV</option>
                          <option value="techcombank">Techcombank</option>
                          <option value="mbbank">MB Bank</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label>Số tài khoản *</label>
                        <input className="form-control" placeholder="Nhập số tài khoản" style={{borderColor: '#bbf7d0', backgroundColor: '#f0fdf4'}} />
                      </div>
                      <div className="col-12">
                        <label>Tên chủ tài khoản *</label>
                        <input className="form-control" placeholder="Nhập tên chủ tài khoản" style={{borderColor: '#bbf7d0', backgroundColor: '#f0fdf4'}} />
                      </div>
                      <div className="col-12">
                        <label>Nội dung chuyển khoản</label>
                        <input className="form-control" placeholder="Nội dung chuyển khoản (không bắt buộc)" style={{borderColor: '#bbf7d0', backgroundColor: '#f0fdf4'}} />
                      </div>
                      <div className="col-12">
                        <div className="alert" style={{backgroundColor: '#fef3c7', borderColor: '#fde68a', color: '#92400e'}}>
                          <strong>Lưu ý:</strong> Sau khi chuyển khoản, vui lòng giữ lại biên lai để xác nhận thanh toán.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : form.payment === 'ewallet' ? (
                // Hiển thị form thông tin ví điện tử
                <div>
                  <div className="alert mb-4" style={{backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534'}}>
                    <h5 className="fw-bold">Thông tin ví điện tử</h5>
                    <p className="mb-0">Vui lòng chọn ví điện tử và điền thông tin thanh toán</p>
                  </div>
                  <div className="bg-white p-4 rounded-3" style={{border: '1.5px solid #f3f3f3'}}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label>Chọn ví điện tử *</label>
                        <select className="form-control" defaultValue="" style={{borderColor: '#bbf7d0', backgroundColor: '#f0fdf4'}}>
                          <option value="">Chọn ví điện tử</option>
                          <option value="momo">MoMo</option>
                          <option value="zalopay">ZaloPay</option>
                          <option value="vnpay">VNPay</option>
                          <option value="airpay">AirPay</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label>Số điện thoại đăng ký ví *</label>
                        <input className="form-control" placeholder="Nhập số điện thoại đăng ký ví điện tử" style={{borderColor: '#bbf7d0', backgroundColor: '#f0fdf4'}} />
                      </div>
                      <div className="col-12">
                        <label>Email (nếu có)</label>
                        <input className="form-control" placeholder="Nhập email (không bắt buộc)" style={{borderColor: '#bbf7d0', backgroundColor: '#f0fdf4'}} />
                      </div>
                      <div className="col-12">
                        <div className="alert" style={{backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534'}}>
                          <strong>Hướng dẫn:</strong> Sau khi xác nhận, bạn sẽ được chuyển đến trang thanh toán của ví điện tử đã chọn.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Hiển thị form thông tin nhận hàng (mặc định) khi chưa chọn phương thức thanh toán hoặc COD
                <>
                  <div className="alert mb-4" style={{backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534'}}>
                    Thêm <b>{(300000 - subtotal).toLocaleString('vi-VN')}₫</b> vào giỏ để được <b>miễn phí giao hàng!</b>
                  </div>
                  <h3 className="fw-bold mb-3">
                    <i className="fa-solid fa-user me-2"></i>
                    Thông tin nhận hàng
                  </h3>
                  {!form.payment && (
                    <div className="alert mb-3" style={{backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534'}}>
                      <i className="fa-solid fa-info-circle me-2"></i>
                      <strong>Bước 1:</strong> Vui lòng nhập đầy đủ thông tin nhận hàng bên dưới, sau đó chọn phương thức thanh toán ở bên phải.
                    </div>
                  )}
                  <div className="row g-3">
                    <div className="col-12">
                      <label>Họ và tên *</label>
                      <input className="form-control" value={form.fullName} onChange={e => setForm(f => ({...f, fullName: e.target.value}))} />
                    </div>
                    <div className="col-12">
                      <label>Địa chỉ *</label>
                      <input className="form-control" placeholder="Số nhà, tên đường" value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} />
                      <input className="form-control mt-2" placeholder="Căn hộ, tầng, v.v. (không bắt buộc)" value={form.address2} onChange={e => setForm(f => ({...f, address2: e.target.value}))} />
                    </div>
                    <div className="col-md-6">
                      <label>Tỉnh/Thành phố *</label>
                      <select 
                        className="form-control" 
                        value={form.cityCode} 
                        onChange={handleProvinceChange}
                        disabled={locationLoading.provinces}
                      >
                        <option value="">
                          {locationLoading.provinces ? 'Đang tải tỉnh/thành phố...' : 'Chọn tỉnh/thành phố'}
                        </option>
                        {provinces.map(province => (
                          <option key={province.code} value={province.code}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label>Huyện/Quận *</label>
                      <select 
                        className="form-control" 
                        value={form.stateCode} 
                        onChange={handleDistrictChange}
                        disabled={!form.cityCode || locationLoading.districts}
                      >
                        <option value="">
                          {!form.cityCode ? 'Chọn tỉnh trước' : 
                           locationLoading.districts ? 'Đang tải huyện/quận...' : 'Chọn huyện/quận'}
                        </option>
                        {districts.map(district => (
                          <option key={district.code} value={district.code}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label>Xã/Thị trấn *</label>
                      <select 
                        className="form-control" 
                        value={form.zipCode} 
                        onChange={handleWardChange}
                        disabled={!form.stateCode || locationLoading.wards}
                      >
                        <option value="">
                          {!form.stateCode ? 'Chọn huyện trước' : 
                           locationLoading.wards ? 'Đang tải xã/phường...' : 'Chọn xã/phường'}
                        </option>
                        {wards.map(ward => (
                          <option key={ward.code} value={ward.code}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label>Số điện thoại *</label>
                      <input className="form-control" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
                    </div>
                    <div className="col-md-6">
                      <label>Email *</label>
                      <input className="form-control" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={form.createAccount} onChange={e => setForm(f => ({...f, createAccount: e.target.checked}))} />
                        <label className="form-check-label">Tạo tài khoản?</label>
                      </div>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={form.shipToDifferent} onChange={e => setForm(f => ({...f, shipToDifferent: e.target.checked}))} />
                        <label className="form-check-label">Giao hàng tới địa chỉ khác?</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <label>Ghi chú đơn hàng (không bắt buộc)</label>
                      <textarea className="form-control" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cột phải: Đơn hàng */}
            <div className="col-md-5">
              <div className="bg-white p-3 rounded-3 mb-4" style={{border: '1.5px solid #f3f3f3'}}>
                <h5 className="fw-bold mb-3">Đơn hàng của bạn</h5>
                {/* Thông báo điều kiện voucher */}
                {selectedVoucher && subtotal < selectedVoucher.min_order_value && (
                  <div className="alert alert-warning mt-2">
                    Bạn không đủ điều kiện để dùng voucher này (Đơn tối thiểu: {selectedVoucher.min_order_value.toLocaleString('vi-VN')}₫)
                  </div>
                )}
                <table className="table mb-3">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-end">Tạm tính</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id}>
                        <td>{item.name} ×{item.quantity}</td>
                        <td className="text-end">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
                      </tr>
                    ))}
                    <tr>
                      <td><b>Tạm tính</b></td>
                      <td className="text-end">{subtotal.toLocaleString('vi-VN')}₫</td>
                    </tr>
                    <tr>
                      <td>Giảm giá voucher</td>
                      <td className="text-end">-{discount.toLocaleString('vi-VN')}₫</td>
                    </tr>
                    <tr>
                      <td>Phí vận chuyển</td>
                      <td className="text-end">{shipping === 0 ? 'Miễn phí' : shipping.toLocaleString('vi-VN') + '₫'}</td>
                    </tr>
                    <tr>
                      <td><b>Tổng cộng</b></td>
                      <td className="text-end"><b style={{color:'#22c55e', fontSize:18}}>{total.toLocaleString('vi-VN')}₫</b></td>
                    </tr>
                  </tbody>
                </table>
                <div className="mb-3">
                  <label className="fw-bold mb-2">Mã giảm giá</label>
                  <div className="d-flex align-items-center mb-3">
                    <button type="button" className="btn btn-outline-primary me-2" onClick={() => router.push('/voucher')}>
                      Chọn mã giảm giá
                    </button>
                    <div>
                      {selectedProductVoucher && (
                        <div className="badge bg-success me-1">Sản phẩm: {selectedProductVoucher}</div>
                      )}
                      {selectedShippingVoucher && (
                        <div className="badge bg-info">Vận chuyển: {selectedShippingVoucher}</div>
                      )}
                      {!(selectedProductVoucher || selectedShippingVoucher) && (
                        <span className="text-muted">Chưa chọn mã giảm giá</span>
                      )}
                    </div>
                  </div>
                  
                  {!isShippingInfoComplete() ? (
                    <div className="alert alert-warning">
                      <i className="fa-solid fa-exclamation-triangle me-2"></i>
                      <strong>Vui lòng nhập đầy đủ thông tin nhận hàng trước khi chọn phương thức thanh toán</strong>
                    </div>
                  ) : (
                    <>
                      <div className="alert mb-3" style={{backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534'}}>
                        <i className="fa-solid fa-check-circle me-2"></i>
                        <strong>Thông tin nhận hàng đã đầy đủ!</strong> Bây giờ bạn có thể chọn phương thức thanh toán.
                      </div>
                      <div className="form-check">
                        <input type="radio" className="form-check-input" checked={form.payment === 'bank'} onChange={() => setForm(f => ({...f, payment: 'bank'}))} />
                        <label className="form-check-label"><b>Chuyển khoản ngân hàng</b></label>
                        <div className="small text-muted ms-4">
                          Vui lòng chuyển khoản theo hướng dẫn. Đơn hàng sẽ được xử lý sau khi nhận được tiền.
                        </div>
                      </div>
                      <div className="form-check mt-2">
                        <input type="radio" className="form-check-input" checked={form.payment === 'ewallet'} onChange={() => setForm(f => ({...f, payment: 'ewallet'}))} />
                        <label className="form-check-label"><b>Ví điện tử (MoMo, ZaloPay, VNPay)</b></label>
                        <div className="small text-muted ms-4">
                          Thanh toán nhanh chóng và an toàn qua ví điện tử. Bạn sẽ được chuyển đến trang thanh toán.
                        </div>
                      </div>
                      <div className="form-check mt-2">
                        <input type="radio" className="form-check-input" checked={form.payment === 'qr'} onChange={() => setForm(f => ({...f, payment: 'qr'}))} />
                        <label className="form-check-label"><b>Thanh toán qua mã QR</b></label>
                        <div className="small text-muted ms-4">
                          Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử để thanh toán nhanh chóng.
                        </div>
                      </div>
                      <div className="form-check mt-2">
                        <input type="radio" className="form-check-input" checked={form.payment === 'cod'} onChange={() => setForm(f => ({...f, payment: 'cod'}))} />
                        <label className="form-check-label">Thanh toán khi nhận hàng</label>
                      </div>
                    </>
                  )}
                </div>
                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" checked={form.agree} onChange={e => setForm(f => ({...f, agree: e.target.checked}))} />
                  <label className="form-check-label">
                    Tôi đã đọc và đồng ý với <a href="#" target="_blank">điều khoản & chính sách</a>
                  </label>
                </div>
                {/* Debug info - Location API */}
                

                {/* Thông báo lỗi nếu thiếu thông tin */}
                {errorFields.length > 0 && (
                  <div className="alert alert-danger">
                    Bạn chưa nhập: {errorFields.join(', ')}
                  </div>
                )}
                <button
                  className="btn btn-primary w-100 fw-bold"
                  style={{
                    background: (form.agree && isShippingInfoComplete() && form.payment) ? '#22c55e' : '#bdbdbd',
                    border: 0,
                    borderRadius: 8,
                    fontSize: 18,
                    opacity: (form.agree && isShippingInfoComplete() && form.payment) ? 1 : 0.7,
                    cursor: (form.agree && isShippingInfoComplete() && form.payment) ? 'pointer' : 'not-allowed'
                  }}
                  disabled={!(form.agree && isShippingInfoComplete() && form.payment)}
                  onClick={handleOrder}
                >
                  {!isShippingInfoComplete() ? 'Vui lòng nhập đầy đủ thông tin' : 
                   !form.payment ? 'Vui lòng chọn phương thức thanh toán' : 'Đặt hàng'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default CheckoutPage;
