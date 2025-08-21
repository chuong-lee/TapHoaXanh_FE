// Service để lấy dữ liệu địa danh Việt Nam từ API thật
import axios from 'axios';

const GITHUB_API_URL = 'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json';

export type Province = { 
  Id: string; 
  Name: string;
  Districts: District[];
};

export type District = { 
  Id: string; 
  Name: string;
  Wards: Ward[];
};

export type Ward = { 
  Id: string; 
  Name: string;
  Level: string;
};

// Mapped types for component compatibility
export type MappedProvince = { code: number; name: string };
export type MappedDistrict = { code: number; name: string };
export type MappedWard = { code: number; name: string };

let cachedData: Province[] | null = null;

const locationService = {
  async loadData(): Promise<Province[]> {
    if (cachedData) {
      console.log('📋 Using cached data');
      return cachedData;
    }

    try {
      console.log('🌐 Fetching Vietnam administrative data from GitHub...');
      const response = await axios.get(GITHUB_API_URL);
      cachedData = response.data || [];
      console.log('✅ Successfully loaded:', cachedData.length, 'provinces');
      return cachedData;
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      return [];
    }
  },

  async getProvinces(): Promise<MappedProvince[]> {
    try {
      const data = await this.loadData();
      const mapped = data.map(province => ({
        code: parseInt(province.Id),
        name: province.Name
      }));
      console.log('📋 Mapped provinces:', mapped.length);
      return mapped;
    } catch (error) {
      console.error('❌ Error getting provinces:', error);
      return [];
    }
  },

  async getDistrictsByProvince(provinceCode: number): Promise<MappedDistrict[]> {
    try {
      console.log(`🌐 Fetching districts for province ${provinceCode}...`);
      const data = await this.loadData();
      const province = data.find(p => parseInt(p.Id) === provinceCode);
      
      if (!province) {
        console.log(`⚠️ Province ${provinceCode} not found`);
        return [];
      }

      const mapped = province.Districts.map(district => ({
        code: parseInt(district.Id),
        name: district.Name
      }));
      console.log('✅ Mapped districts:', mapped.length, 'for province', province.Name);
      return mapped;
    } catch (error) {
      console.error(`❌ Error fetching districts for province ${provinceCode}:`, error);
      return [];
    }
  },

  async getWardsByDistrict(districtCode: number): Promise<MappedWard[]> {
    try {
      console.log(`🌐 Fetching wards for district ${districtCode}...`);
      const data = await this.loadData();
      
      // Find district across all provinces
      let targetDistrict: District | null = null;
      for (const province of data) {
        targetDistrict = province.Districts.find(d => parseInt(d.Id) === districtCode) || null;
        if (targetDistrict) break;
      }

      if (!targetDistrict) {
        console.log(`⚠️ District ${districtCode} not found`);
        return [];
      }

      const mapped = targetDistrict.Wards.map(ward => ({
        code: parseInt(ward.Id),
        name: ward.Name
      }));
      console.log('✅ Mapped wards:', mapped.length, 'for district', targetDistrict.Name);
      return mapped;
    } catch (error) {
      console.error(`❌ Error fetching wards for district ${districtCode}:`, error);
      return [];
    }
  },
};

export default locationService;