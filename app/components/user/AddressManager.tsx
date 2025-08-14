'use client'

import { useState, useEffect, useRef } from 'react'
import api from '@/lib/axios'
import locationService, { MappedProvince, MappedDistrict, MappedWard } from '../../../lib/locationService'

interface Address {
  id: number;
  street: string;
  city: string;
  district: string;
  is_default: boolean;
  usersId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface AddressFormData {
  street: string;
  city: string;
  district: string;
  zipCode?: string;
  is_default: boolean;
}

export default function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    street: '',
    city: '',
    district: '',
    is_default: false
  });

  // Location data
  const [provinces, setProvinces] = useState<MappedProvince[]>([]);
  const [districts, setDistricts] = useState<MappedDistrict[]>([]);
  const [wards, setWards] = useState<MappedWard[]>([]);
  const locationLoadingRef = useRef({
    provinces: false,
    districts: false,
    wards: false
  });

  // Load addresses
  const loadAddresses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/address');
      setAddresses(response.data.data || []);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load provinces
  const loadProvinces = async () => {
    locationLoadingRef.current.provinces = true;
    try {
      const provincesData = await locationService.getProvinces();
      setProvinces(provincesData);
    } catch (error) {
      console.error('Error loading provinces:', error);
    } finally {
      locationLoadingRef.current.provinces = false;
    }
  };

  // Load districts when city changes
  const loadDistricts = async (cityCode: string) => {
    if (!cityCode) {
      setDistricts([]);
      setWards([]);
      return;
    }
    
    setLocationLoading(prev => ({ ...prev, districts: true }));
    try {
      const districtsData = await locationService.getDistrictsByProvince(parseInt(cityCode));
      setDistricts(districtsData);
    } catch (error) {
      console.error('Error loading districts:', error);
    } finally {
      setLocationLoading(prev => ({ ...prev, districts: false }));
    }
  };

  // Load wards when district changes
  const loadWards = async (districtCode: string) => {
    if (!districtCode) {
      setWards([]);
      return;
    }
    
    setLocationLoading(prev => ({ ...prev, wards: true }));
    try {
      const wardsData = await locationService.getWardsByDistrict(parseInt(districtCode));
      setWards(wardsData);
    } catch (error) {
      console.error('Error loading wards:', error);
    } finally {
      setLocationLoading(prev => ({ ...prev, wards: false }));
    }
  };

  useEffect(() => {
    loadAddresses();
    loadProvinces();
  }, []);

  const resetForm = () => {
    setFormData({
      street: '',
      city: '',
      district: '',
      zipCode: '',
      is_default: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.street || !formData.city || !formData.district) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      if (editingAddress) {
        await api.put('/address', {
          id: editingAddress.id,
          ...formData
        });
        alert('Địa chỉ đã được cập nhật thành công');
      } else {
        await api.post('/address', formData);
        alert('Địa chỉ đã được thêm thành công');
      }
      
      loadAddresses();
      resetForm();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      alert(errorMessage);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      street: address.street,
      city: address.city,
      district: address.district,
      is_default: address.is_default
    });
    setShowForm(true);
  };

  const handleDelete = async (address: Address) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return;
    }

    try {
      await api.delete(`/address?id=${address.id}`);
      alert('Địa chỉ đã được xóa thành công');
      loadAddresses();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      alert(errorMessage);
    }
  };

  const handleSetDefault = async (address: Address) => {
    try {
      await api.put('/address', {
        id: address.id,
        street: address.street,
        city: address.city,
        district: address.district,
        is_default: true
      });
      alert('Đã đặt làm địa chỉ mặc định');
      loadAddresses();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      alert(errorMessage);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const selectedProvince = provinces.find(p => p.code.toString() === selectedCode);
    
    setFormData(prev => ({
      ...prev,
      city: selectedProvince ? selectedProvince.name : '',
      district: '',
      zipCode: ''
    }));
    
    loadDistricts(selectedCode);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const selectedDistrict = districts.find(d => d.code.toString() === selectedCode);
    
    setFormData(prev => ({
      ...prev,
      district: selectedDistrict ? selectedDistrict.name : '',
      zipCode: ''
    }));
    
    loadWards(selectedCode);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const selectedWard = wards.find(w => w.code.toString() === selectedCode);
    
    setFormData(prev => ({
      ...prev,
      zipCode: selectedWard ? selectedWard.name : ''
    }));
  };

  return (
    <div className="address-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">Quản lý địa chỉ</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(true)}
        >
          Thêm địa chỉ mới
        </button>
      </div>

      {/* Danh sách địa chỉ */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="alert alert-info">
          Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ đầu tiên!
        </div>
      ) : (
        <div className="address-list">
          {addresses.map((address) => (
            <div key={address.id} className="address-item card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                                     <div className="address-info flex-grow-1">
                     <div className="d-flex align-items-center mb-2">
                       <h5 className="name mb-0">Địa chỉ #{address.id}</h5>
                       {address.is_default && (
                         <span className="badge bg-success ms-2">Mặc định</span>
                       )}
                     </div>
                     <p className="address mb-1">
                       {address.street}, {address.district}, {address.city}
                     </p>
                     <p className="text-muted mb-0">
                       Tạo lúc: {new Date(address.createdAt).toLocaleDateString('vi-VN')}
                     </p>
                   </div>
                  <div className="address-actions">
                    {!address.is_default && (
                      <button 
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleSetDefault(address)}
                      >
                        Đặt mặc định
                      </button>
                    )}
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(address)}
                    >
                      Sửa
                    </button>
                    {!address.is_default && (
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(address)}
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form thêm/sửa địa chỉ */}
      {showForm && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={resetForm}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                                 <div className="modal-body">
                   <div className="mb-3">
                     <label className="form-label">
                       Địa chỉ đường <span className="text-danger">*</span>
                     </label>
                     <input
                       type="text"
                       className="form-control"
                       value={formData.street}
                       onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                       required
                     />
                   </div>

                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">
                          Tỉnh/Thành phố <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={provinces.find(p => p.name === formData.city)?.code || ''}
                          onChange={handleCityChange}
                          required
                        >
                          <option value="">Chọn tỉnh/thành phố</option>
                          {provinces.map((province) => (
                            <option key={province.code} value={province.code}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">
                          Huyện/Quận <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={districts.find(d => d.name === formData.district)?.code || ''}
                          onChange={handleDistrictChange}
                          required
                          disabled={!formData.city}
                        >
                          <option value="">Chọn huyện/quận</option>
                          {districts.map((district) => (
                            <option key={district.code} value={district.code}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Xã/Phường</label>
                        <select
                          className="form-select"
                          value={wards.find(w => w.name === formData.zipCode)?.code || ''}
                          onChange={handleWardChange}
                          disabled={!formData.district}
                        >
                          <option value="">Chọn xã/phường</option>
                          {wards.map((ward) => (
                            <option key={ward.code} value={ward.code}>
                              {ward.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isDefault"
                        checked={formData.is_default}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                      />
                      <label className="form-check-label" htmlFor="isDefault">
                        Đặt làm địa chỉ mặc định
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={resetForm}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {showForm && (
        <div 
          className="modal-backdrop fade show" 
          onClick={resetForm}
        ></div>
      )}
    </div>
  );
} 