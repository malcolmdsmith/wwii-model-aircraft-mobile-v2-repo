import localStorage from "@react-native-async-storage/async-storage";

export function initializeBrandSearchData() {
  const searchData = {
    manufacturer_fullname: "",
    years_active: "",
    country_of_origin: "",
    aircraft_name: "",
    primary_group_id: 0,
    media_id: 0,
    scale_id: 0,
    related_brands_logos: "",
    kitmolds: "",
  };

  setLocalStorage("@brand_search_data", searchData);
}

export function initializeAircraftSearchData() {
  const searchData = {
    aircraft_name: "",
    year_of_manufacture: 0,
    country_of_manufacturer: "",
    manufacturer_id: 0,
    primary_group_id: 0,
    media_id: 0,
    scale_id: 0,
    kit_mold: "",
    kit_no: "",
  };

  setLocalStorage("@aircraft_search_data", searchData);
}

async function setLocalStorage(name, searchData) {
  try {
    const jsonValue = JSON.stringify(searchData);
    await localStorage.setItem(name, jsonValue);
  } catch (e) {
    this.logError(e);
  }
}
