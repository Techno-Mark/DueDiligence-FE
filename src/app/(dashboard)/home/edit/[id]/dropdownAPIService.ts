import { get, post } from "@/services/apiService";
import { dropdownAPIs } from "@/types/apps/dropdownAPI";

export const fetchCountries = async () => {
  const data = await get(dropdownAPIs.country);
  if (data.ResponseStatus !== "success") {
    throw new Error("Error While Finding Countries");
  }
  return data?.ResponseData;
};

export const fetchStates = async () => {
  const data = await get(dropdownAPIs.states);
  if (data.ResponseStatus !== "success") {
    throw new Error("Error While Finding States");
  }
  return data?.ResponseData;
};

export const fetchCities = async (id: Array<number>) => {
  const data = await post(dropdownAPIs.cities, { stateId: id });
  if (data.ResponseStatus !== "success") {
    throw new Error("Error While Finding Cities");
  }
  return data?.ResponseData;
};

export const fetchIndustry = async () => {
  const data = await get(dropdownAPIs.industry);
  if (data.ResponseStatus !== "success") {
    throw new Error("Error While Finding Industry");
  }
  return data?.ResponseData;
};

export const fetchSubCategory = async (industryId: number) => {
  const data = await post(dropdownAPIs.subCategory, { industryId });
  // if (data.ResponseStatus !== "success") {
  //   throw new Error("Error While Finding sub category");
  // }
  return data?.ResponseData;
};

export const fetchService = async (sectorId: number) => {
  const data = await post(dropdownAPIs.service, { sectorId });
  // if (data.ResponseStatus !== "success") {
  //   throw new Error("Error While Finding service");
  // }
  return data?.ResponseData;
};

export const fetchHeadquarter = async () => {
  const data = await get(dropdownAPIs.headquarter);
  if (data.ResponseStatus !== "success") {
    throw new Error("Error While Finding headquarter");
  }
  return data?.ResponseData;
};

export const fetchOutlet = async () => {
  const data = await get(dropdownAPIs.outlet);
  if (data.ResponseStatus !== "success") {
    throw new Error("Error While Finding outlet");
  }
  return data?.ResponseData;
};

export const fetchAreaRequired = async () => {
  const data = await get(dropdownAPIs.areaRequired);
  if (data.ResponseStatus !== "success") {
    throw new Error("Error While Finding Area Required");
  }
  return data?.ResponseData;
};

export const fetchInvestmentRange = async () => {
  const data = await get(dropdownAPIs.investmentRange);
  if (data.ResponseStatus !== "success") {
    throw new Error("Error While Finding Investment Range");
  }
  return data?.ResponseData;
};

export const fetchSalesAndRevenueModel = async () => {
  const data = await get(dropdownAPIs.salesAndRevenueModel);
  if (data.ResponseStatus !== "success") {
    throw new Error("Error While Finding Sales and RevenueModel");
  }
  return data?.ResponseData;
};

export const fetchPaybackPeriod = async () => {
  const data = await get(dropdownAPIs.paybackPeriod);
  if (data.ResponseStatus !== "success") {
    throw new Error("Error While Finding Payback Period");
  }
  return data?.ResponseData;
};

export const fetchSupportProvided = async () => {
  const data = await get(dropdownAPIs.supportProvided);
  if (data.ResponseStatus !== "success") {
    throw new Error("Error While Finding Support Provided");
  }
  return data?.ResponseData;
};

export const fetchFranchiseDuration = async () => {
  const data = await get(dropdownAPIs.franchiseDuration);
  if (data.ResponseStatus !== "success") {
    throw new Error("Error While Finding Franchise Duration");
  }
  return data?.ResponseData;
};



export const fetchFile = async(fileName:string) => {
  const apiURL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const data = await fetch(`${apiURL}/${fileName}`)
  if(!data.ok){
    throw new Error("Error Occur while Fetching Resources File")
  }
  const blob = await data.blob();
  return blob;
}