'use client'

import { useState } from 'react'

export default function SidebarFilter() {
  // State cho các filter (có thể lấy từ API nếu muốn động)
  const [selectedCategory, setSelectedCategory] = useState('Deli & Bakery')
  const [price, setPrice] = useState(60)
  const [selectedBrand, setSelectedBrand] = useState(['FreshHarvest'])
  const [selectedType, setSelectedType] = useState(['Packaged Goods'])
  const [inStock, setInStock] = useState(true)

  const categories = [
    { name: 'Deli & Bakery', count: 50 },
    { name: 'Delicatessen', count: 45 },
    { name: 'Fruit', count: 33 },
    { name: 'Vegetables', count: 23 },
    { name: 'Rice & Nuts', count: 87 },
    { name: 'Dried Food', count: 34 },
    { name: 'Korean Products', count: 79 },
    { name: 'Home', count: 88 },
    { name: 'IT & Technology', count: 37 },
  ]
  const brands = ['FreshHarvest', "Nature's Best", 'GoodGrains', 'FarmFresh', 'GreenGrocer']
  const types = ['Packaged Goods', 'Fresh Produce', 'Frozen Foods']

  return (
    <div className="bg-white p-3 rounded-3 mb-4" style={{border: '1.5px solid #f3f3f3', minWidth: 240}}>
      {/* Category */}
      <h5 className="fw-bold mb-3">Category</h5>
      <ul className="list-unstyled mb-4">
        {categories.map(cat => (
          <li key={cat.name} style={{marginBottom: 6}}>
            <label style={{cursor: 'pointer'}}>
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.name}
                onChange={() => setSelectedCategory(cat.name)}
                style={{marginRight: 8}}
              />
              <span style={{color: selectedCategory === cat.name ? '#e11d48' : '#222', fontWeight: selectedCategory === cat.name ? 600 : 400}}>
                {cat.name}
              </span>
              <span className="text-muted ms-1">({cat.count})</span>
            </label>
          </li>
        ))}
      </ul>

      {/* Price */}
      <h5 className="fw-bold mb-2">Price</h5>
      <div className="mb-4">
        <input
          type="range"
          min={25}
          max={125}
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="custom-range"
          style={{
            width: '100%',
            background: `linear-gradient(to right, #1976d2 ${(price-25)/(125-25)*100}%, #e9ecef ${(price-25)/(125-25)*100}%)`
          }}
        />
        <div className="d-flex justify-content-between" style={{fontSize: 14}}>
          <span>${25.00.toFixed(2)}</span>
          <span>${125.00.toFixed(2)}</span>
        </div>
      </div>

      {/* Review */}
      <h5 className="fw-bold mb-2">Review</h5>
      <ul className="list-unstyled mb-4">
        {[5,4,3,2,1].map(star => (
          <li key={star} style={{marginBottom: 4, cursor: 'pointer'}}>
            <span>{star} Star</span>
          </li>
        ))}
      </ul>

      {/* Brand */}
      <h5 className="fw-bold mb-2">Brand</h5>
      <ul className="list-unstyled mb-4">
        {brands.map(brand => (
          <li key={brand} style={{marginBottom: 4}}>
            <label>
              <input
                type="checkbox"
                checked={selectedBrand.includes(brand)}
                onChange={() => {
                  setSelectedBrand(selectedBrand.includes(brand)
                    ? selectedBrand.filter(b => b !== brand)
                    : [...selectedBrand, brand])
                }}
                style={{marginRight: 8}}
              />
              {brand}
            </label>
          </li>
        ))}
      </ul>

      {/* Product Type */}
      <h5 className="fw-bold mb-2">Product Type</h5>
      <ul className="list-unstyled mb-4">
        {types.map(type => (
          <li key={type} style={{marginBottom: 4}}>
            <label>
              <input
                type="checkbox"
                checked={selectedType.includes(type)}
                onChange={() => {
                  setSelectedType(selectedType.includes(type)
                    ? selectedType.filter(t => t !== type)
                    : [...selectedType, type])
                }}
                style={{marginRight: 8}}
              />
              {type}
            </label>
          </li>
        ))}
      </ul>

      {/* Availability */}
      <h5 className="fw-bold mb-2">Availability</h5>
      <ul className="list-unstyled mb-4">
        <li>
          <label>
            <input
              type="checkbox"
              checked={inStock}
              onChange={() => setInStock(!inStock)}
              style={{marginRight: 8}}
            />
            In Stock
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              checked={!inStock}
              onChange={() => setInStock(!inStock)}
              style={{marginRight: 8}}
            />
            Out of Stocks
          </label>
        </li>
      </ul>

      {/* Banner */}
      <div className="mb-2">
        <img
          src="/client/images/banne-milk.png"
          alt="Banner"
          style={{width: '100%', borderRadius: 12}}
        />
      </div>
    </div>
  )
}
