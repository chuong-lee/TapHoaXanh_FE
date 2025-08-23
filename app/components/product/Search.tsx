'use client'

interface SearchFilterProps {
  onFilter: (filters: { search: string; category: string; maxPrice: string }) => void
}

const SearchFilter = ({ onFilter }: SearchFilterProps) => {
  const searchRef = useRef('')
  const categoryRef = useRef('')
  const maxPriceRef = useRef('')

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    onFilter({ 
      search: searchRef.current, 
      category: categoryRef.current, 
      maxPrice: maxPriceRef.current 
    })
  }

  return (
    <form className="row mb-4" onSubmit={handleSearch}>
      <div className="col-md-4">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm sản phẩm..."
          defaultValue={searchRef.current}
          onChange={(e) => searchRef.current = e.target.value}
        />
      </div>

      <div className="col-md-3">
        <select
          className="form-select"
          defaultValue={categoryRef.current}
          onChange={(e) => categoryRef.current = e.target.value}
        >
          <option value="">Tất cả danh mục</option>
          <option value="rau">Rau</option>
          <option value="thit">Thịt</option>
          <option value="hai-san">Hải sản</option>
        </select>
      </div>

      <div className="col-md-3">
        <input
          type="number"
          className="form-control"
          placeholder="Giá tối đa"
          defaultValue={maxPriceRef.current}
          onChange={(e) => maxPriceRef.current = e.target.value}
        />
      </div>

      <div className="col-md-2">
        <button type="submit" className="btn btn-success w-100">Tìm kiếm</button>
      </div>
    </form>
  )
}

export default SearchFilter
