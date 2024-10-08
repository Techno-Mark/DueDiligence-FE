import CustomTextField from "@/@core/components/mui/TextField";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import { BrandEditDataType } from "@/types/apps/brandListType";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  fetchAreaRequired,
  fetchCities,
  fetchCountries,
  fetchFile,
  fetchFranchiseDuration,
  fetchHeadquarter,
  fetchIndustry,
  fetchInvestmentRange,
  fetchOutlet,
  fetchPaybackPeriod,
  fetchSalesAndRevenueModel,
  fetchService,
  fetchStates,
  fetchSubCategory,
  fetchSupportProvided,
} from "./dropdownAPIService";
import AppReactDatepicker from "@/libs/styles/AppReactDatepicker";
import CustomChip from "@/@core/components/mui/Chip";
import ConfirmationDialog from "./ConfirmationDialog";
import { toast } from "react-toastify";
// Icon Imports
import { useDropzone } from "react-dropzone";
import { post, postFormData } from "@/services/apiService";
import { brandList } from "@/services/endpoint/brandList";

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

type pageProps = {
  editData: BrandEditDataType;
  handleClose: Function;
};

type dropdownValueType = [{ id: number; name: string }];
type InvestmentRangeType = [{ id: number; range: string }];

type FileProp = {
  name: string;
  type: string;
  size: number;
  preview?: string;
};

const fileListsType = {
  brochure: false,
  logo: false,
  brandImages: false,
  video: false,
  franchiseAggrementFile: false,
};

const maxBrandImages = 5;

const initialErrorData = {
  fullName: "",
  email: "",
  countryCode: "",
  phoneNumber: "",
  pincode: "",
  userState: "",
  userCity: "",
  kylasLeadId: "",
  companyName: "",
  websiteURL: "",
  brandName: "",
  industry: "",
  subCategory: "",
  headquartersLocation: "",
  service: "",
  businessCommencedYear: "",
  franchiseCommencedYear: "",
  numberOfLocations: "",
  brandDescription: "",
  usp: "",
  country: "",
  state: "",
  city: "",
  areaRequired: "",
  investmentRange: "",
  franchiseFee: "",
  salesRevenueModel: "",
  roi: "",
  paybackPeriod: "",
  tenurePeriod: "",
  supportProvided: "",
  otherApplicable: "",
  isOperatingManuals: "",
  isAssistanceAvailable: "",
  isExpertGuidance: "",
  isITSystemIncluded: "",
  trainingLocation: "",
  brochure: "",
  logo: "",
  brandImages: "",
  video: "",
  franchiseAggrementFile: "",
  franchiseAgreement: "",
  franchiseDuration: "",
  isRenewable: "",
  active: "",
  approved: "",
  deletedAt: "",
  createdAt: "",
  updatedAt: "",
};

function BrandEditForm({ editData, handleClose }: pageProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(editData);
  const [formErrors, setFormErrors] = useState(initialErrorData);
  //Dropdown Data
  const [country, setCountry] = useState<dropdownValueType>();
  const [state, setState] = useState<dropdownValueType>();
  const [city, setCity] = useState<dropdownValueType>();
  const [allCity, setAllCity] = useState<dropdownValueType>();
  const [industry, setIndustry] = useState<dropdownValueType>();
  const [subCategory, setSubCategory] = useState<dropdownValueType>();
  const [service, setService] = useState<dropdownValueType>();
  const [headquarter, setHeadquarter] = useState<dropdownValueType>();
  const [outlet, setOutlet] = useState<dropdownValueType>();
  const [areaRequired, setAreaRequired] = useState<dropdownValueType>();
  const [investmentRange, setInvestmentRange] = useState<InvestmentRangeType>();
  const [salesRevenueModel, setSalesRevenueModel] =
    useState<dropdownValueType>();
  const [paybackPeriod, setPaybackPeriod] = useState<dropdownValueType>();
  const [supportProvided, setSupportProvided] = useState<dropdownValueType>();
  const [franchiseDuration, setFranchiseDuration] =
    useState<dropdownValueType>();

  //Modal State
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  //File upload
  const [brochure, setBrochure] = useState<FileProp | null>(null);
  const [logo, setLogo] = useState<FileProp | null>(null);
  const [brandImages, setBrandImages] = useState<FileProp[]>([]);
  const [video, setVideo] = useState<FileProp | null>(null);
  const [franchiseAggrementFile, setFranchiseAggrementFile] =
    useState<FileProp | null>(null);
  const [isFilesTouched, setIsFilesTouched] =
    useState<typeof fileListsType>(fileListsType);

  //Resources Dropzone
  // Brochure Dropzone
  const {
    getRootProps: getBrochureProps,
    getInputProps: getBrochureInputProps,
  } = useDropzone({
    maxFiles: 1,
    maxSize: 25000000, //25MB
    accept: {
      "application/pdf": [],
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
    },
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        setBrochure(
          Object.assign(acceptedFiles[0], {
            preview: URL.createObjectURL(acceptedFiles[0]),
          })
        );
        setFormErrors({ ...formErrors, brochure: "" });
        setIsFilesTouched({ ...isFilesTouched, brochure: true });
      }
    },
    onDropRejected: () => {
      toast.error(
        "Only pdf, png, jpeg & jpg files are allowed for brochure upload, and max size is 25 MB.",
        { autoClose: 3000 }
      );
    },
  });

  // Franchise Aggrement Dropzone
  const {
    getRootProps: getFranchiseAggrementProps,
    getInputProps: getFranchiseAggrementInputProps,
  } = useDropzone({
    maxFiles: 1,
    maxSize: 10000000,
    accept: {
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        setFranchiseAggrementFile(
          Object.assign(acceptedFiles[0], {
            preview: URL.createObjectURL(acceptedFiles[0]),
          })
        );
        setFormErrors({ ...formErrors, franchiseAggrementFile: "" });
        setIsFilesTouched({ ...isFilesTouched, franchiseAggrementFile: true });
      }
    },
    onDropRejected: () => {
      toast.error(
        "Only PDF & word files are allowed for brochure upload, and max size is 10 MB.",
        { autoClose: 3000 }
      );
    },
  });

  // Logo Dropzone
  const { getRootProps: getLogoProps, getInputProps: getLogoInputProps } =
    useDropzone({
      maxFiles: 1,
      maxSize: 5000000,
      accept: {
        "image/jpeg": [],
        "image/jpg": [],
        "image/png": [],
        "image/gif": [],
        "application/pdf": [],
      },
      onDrop: (acceptedFiles: File[]) => {
        if (acceptedFiles.length) {
          setLogo(
            Object.assign(acceptedFiles[0], {
              preview: URL.createObjectURL(acceptedFiles[0]),
            })
          );
        }
        setFormErrors({ ...formErrors, logo: "" });
        setIsFilesTouched({ ...isFilesTouched, logo: true });
      },
      onDropRejected: () => {
        toast.error(
          "Only jpeg, jpg, png, gif & pdf files are allowed for logo upload, and max size is 5 MB.",
          { autoClose: 3000 }
        );
      },
    });

  // Brand Images Dropzone
  const {
    getRootProps: getBrandImagesProps,
    getInputProps: getBrandImagesInputProps,
  } = useDropzone({
    maxFiles: 5,
    maxSize: 5000000,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/gif": [],
    },
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length + brandImages.length > 5) {
        toast.error(`You can upload up to ${maxBrandImages} brand images.`, {
          autoClose: 3000,
        });
        return;
      }
      setBrandImages([
        ...brandImages,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
      setFormErrors({ ...formErrors, brandImages: "" });
      setIsFilesTouched({ ...isFilesTouched, brandImages: true });
    },
    onDropRejected: () => {
      toast.error(
        "Only jpeg, jpg, png & gif files are allowed for brand images, and max size is 5 MB.",
        { autoClose: 3000 }
      );
    },
  });

  // Video Dropzone
  const { getRootProps: getVideoProps, getInputProps: getVideoInputProps } =
    useDropzone({
      maxFiles: 1,
      maxSize: 25000000,
      accept: { "video/*": [] },
      onDrop: (acceptedFiles: File[]) => {
        if (acceptedFiles.length) {
          setVideo(
            Object.assign(acceptedFiles[0], {
              preview: URL.createObjectURL(acceptedFiles[0]),
            })
          );
        }
        setFormErrors({ ...formErrors, video: "" });
        setIsFilesTouched({ ...isFilesTouched, video: true });
      },
      onDropRejected: () => {
        toast.error("Only video files are allowed, and max size is 25 MB.", {
          autoClose: 3000,
        });
      },
    });

  const handleRemoveBrandImage = (file: FileProp) => {
    setIsFilesTouched({ ...isFilesTouched, brandImages: true });
    if (brandImages?.length && brandImages.length == 1) {
      setFormErrors({ ...formErrors, brandImages: "" });
    }
    setBrandImages((prevFiles) => {
      const updatedFiles = prevFiles.filter((f) => f !== file);
      URL.revokeObjectURL(file.preview || "");
      return updatedFiles;
    });
  };

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith("image")) {
      return (
        <img width={100} height={100} alt={file.name} src={file.preview} />
      );
    } else if (file.type.startsWith("video")) {
      return <video width={150} height={100} controls src={file.preview} />;
    } else {
      return <i className="tabler-file-description w-[60px] h-[60px]" />;
    }
  };

  const handleRemoveFile = (
    file: FileProp,
    setter: (file: FileProp | null) => void
  ) => {
    setter(null);
    URL.revokeObjectURL(file.preview || "");
  };

  const handleRemoveAllBrandImages = () => {
    brandImages.forEach((file) => URL.revokeObjectURL(file.preview || ""));
    setBrandImages([]);
  };

  //Hooks
  useEffect(() => {
    async function checkInitialFormError() {
      const errors = { ...formErrors };
      if (!editData?.fullName || editData.fullName === null) {
        errors.fullName = "Please Enter Full Name";
      }
      if (!editData?.email || editData.email === null) {
        errors.email = "Please Enter Email";
      }
      if (!editData?.brandName || editData.brandName === null) {
        errors.brandName = "Please Enter Brand Name";
      }

      if (
        !editData?.country ||
        editData.country === 0 ||
        editData.country === null
      ) {
        errors.country = "Please Select Country";
      }

      if (
        !editData?.userState ||
        editData.userCity === 0 ||
        editData.userCity === null
      ) {
        errors.userState = "Please Select State";
      }
      if (
        !editData?.userCity ||
        editData.userCity === 0 ||
        editData.userCity === null
      ) {
        errors.userCity = "Please Select User City";
      }
      if (!editData?.pincode) {
        errors.pincode = "Please Enter Your Pincode";
      }
      setFormErrors(errors);
    }

    async function getData() {
      try {
        setLoading(true);
        const [
          countries,
          states,
          cities,
          industries,
          subCategories,
          services,
          headquarters,
          outlets,
          areas,
          investmentRanges,
          salesRevenueModels,
          paybackPeriods,
          supportProvided,
          durations,
          allCity,
        ] = await Promise.all([
          fetchCountries(),
          fetchStates(),
          fetchCities([editData.userState]),
          fetchIndustry(),
          fetchSubCategory(editData?.industry),
          fetchService(editData.subCategory),
          fetchHeadquarter(),
          fetchOutlet(),
          fetchAreaRequired(),
          fetchInvestmentRange(),
          fetchSalesAndRevenueModel(),
          fetchPaybackPeriod(),
          fetchSupportProvided(),
          fetchFranchiseDuration(),
          fetchCities([]),
        ]);
        setCountry(countries);
        setState(states);
        setCity(cities);
        setIndustry(industries);
        setSubCategory(subCategories);
        setService(services);
        setHeadquarter(headquarters);
        setOutlet(outlets);
        setAreaRequired(areas);
        setInvestmentRange(investmentRanges);
        setSalesRevenueModel(salesRevenueModels);
        setPaybackPeriod(paybackPeriods);
        setSupportProvided(supportProvided);
        setFranchiseDuration(durations);
        setAllCity(allCity);
        checkInitialFormError();
        await downloadAvailableResourceFiles();
        setLoading(false);
      } catch (error: any) {
        toast.error(error.message);
        setLoading(false);
      }
    }

    async function downloadAvailableResourceFiles() {
      try {
        let data = null;
        let fileObject = null;
        // Download Brochure File
        if (editData.brochure && editData.brochure.length > 5) {
          data = await fetchFile(editData.brochure);
          fileObject = new File(
            [data],
            editData.brochure.split("/")?.[2] || editData.brochure,
            { type: data.type }
          );
          setBrochure(
            Object.assign(fileObject, {
              preview: URL.createObjectURL(fileObject),
            })
          );
        }
        //Download Logo Image File
        if (editData.logo && editData.logo.length > 5) {
          data = await fetchFile(editData.logo);
          fileObject = new File(
            [data],
            editData.logo.split("/")?.[2] || editData.logo,
            { type: data.type }
          );
          setLogo(
            Object.assign(fileObject, {
              preview: URL.createObjectURL(fileObject),
            })
          );
        }
        //Download Franchise Aggrement File
        if (
          editData.franchiseAggrementFile &&
          editData.franchiseAggrementFile.length > 5
        ) {
          data = await fetchFile(editData.franchiseAggrementFile);
          fileObject = new File(
            [data],
            editData.franchiseAggrementFile.split("/")?.[2] ||
              editData.franchiseAggrementFile,
            {
              type: data.type,
            }
          );
          setFranchiseAggrementFile(
            Object.assign(fileObject, {
              preview: URL.createObjectURL(fileObject),
            })
          );
        }
        //Download Video File
        if (editData.video && editData.video.length > 5) {
          data = await fetchFile(editData.video);
          fileObject = new File(
            [data],
            editData.video.split("/")?.[2] || editData.video,
            {
              type: data.type,
            }
          );
          setVideo(
            Object.assign(fileObject, {
              preview: URL.createObjectURL(fileObject),
            })
          );
        }
        //Download All Brand Images
        if (
          editData.brandImages &&
          Array.isArray(editData.brandImages) &&
          editData.brandImages.length > 0
        ) {
          const AllBrandImages = [];
          for (let brandImage in editData.brandImages) {
            data = await fetchFile(editData.brandImages[brandImage]);
            const fileObject = new File(
              [data],
              editData.brandImages[brandImage].split("/")?.[2] ||
                editData.brandImages[brandImage],
              {
                type: data.type,
              }
            );
            AllBrandImages.push(fileObject);
          }
          setBrandImages([
            ...AllBrandImages.map((file) =>
              Object.assign(file, { preview: URL.createObjectURL(file) })
            ),
          ]);
        }
      } catch (error: any) {}
    }

    async function fakeMethod() {
      let data = await fetchStates();
      setState(data);
    }
    // fakeMethod();
    getData();
  }, []);

  const checkFormIsValid = (formErrors: any): boolean => {
    return !Object.keys(formErrors).some((key) => formErrors[key]);
  };

  const handleSubmit = async () => {
    if (checkFormIsValid(formErrors)) {
      setIsUpdate(false);

      try {
        const {
          active,
          approved,
          brandImages: oldBrandImages,
          brochure: oldBrochure,
          logo: oldLogo,
          video: oldVideo,
          countryCode,
          createdAt,
          deletedAt,
          franchiseAggrementFile: oldFranchiseAggrementFile,
          id,
          kylasLeadId,
          updatedAt,
          ...otherALLData
        } = formData;

        const formDataObject = new FormData();
        let hasAnyFile = false;
        if (brochure && isFilesTouched.brochure) {
          formDataObject.append("brochure", brochure as unknown as Blob);
          hasAnyFile = true;
        }
        if (logo && isFilesTouched.logo) {
          formDataObject.append("logo", logo as unknown as Blob);
          hasAnyFile = true;
        }
        if (video && isFilesTouched.video) {
          formDataObject.append("video", video as unknown as Blob);
          hasAnyFile = true;
        }
        if (franchiseAggrementFile && isFilesTouched.franchiseAggrementFile) {
          hasAnyFile = true;
          formDataObject.append(
            "franchiseAggrementFile",
            franchiseAggrementFile as unknown as Blob
          );
        }
        if (
          brandImages &&
          brandImages?.length > 0 &&
          isFilesTouched.brandImages
        ) {
          brandImages.forEach((file, index) =>
            formDataObject.append(`brandImages`, file as unknown as Blob)
          );
          hasAnyFile = true;
        }

        const removeResourceList: any = {};
        let anyRemovalResouce = false;
        if (isFilesTouched.brochure && !brochure) {
          removeResourceList.brochure = true;
          anyRemovalResouce = true;
        }
        if (isFilesTouched.logo && !logo) {
          removeResourceList.logo = true;
          anyRemovalResouce = true;
        }
        if (isFilesTouched.video && !video) {
          removeResourceList.video = true;
          anyRemovalResouce = true;
        }

        if (isFilesTouched.franchiseAggrementFile && !franchiseAggrementFile) {
          removeResourceList.franchiseAggrementFile = true;
          anyRemovalResouce = true;
        }
        if (isFilesTouched.brandImages && brandImages.length < 1) {
          removeResourceList.brandImages = true;
          anyRemovalResouce = true;
        }

        setLoading(true);
        const endpoint = brandList.edit;
        let response = await post(endpoint, { ...otherALLData, brandId: id });

        if (hasAnyFile) {
          formDataObject.append("brandId", id.toString());
          response = await postFormData(endpoint, formDataObject);
        }

        if (anyRemovalResouce) {
          response = await post(brandList.removeReource, {
            ...removeResourceList,
            brandId: id,
          });
        }

        if (response.ResponseStatus === "success") {
          toast.success(response.Message);
        } else {
          toast.error(response.Message);
        }
        setLoading(false);
        handleClose();
      } catch (error: any) {
        console.error("Error posting data:", error.message);
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <LoadingBackdrop isLoading={loading} />;
  }

  return (
    <>
      {/* <LoadingBackdrop isLoading={loading} /> */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className="h-10 flex items-center mb-2">
            <div>
              <Typography variant="h5" className={`capitalize`}>
                &nbsp; Brand Edit Page &nbsp;
              </Typography>
            </div>
          </div>
        </Grid>

        <Grid item xs={12}>
          <Card className="p-2">
            <Typography variant="h5" className="underline">
              {" "}
              User Details:{" "}
            </Typography>

            <Grid container spacing={2} className="mt-5">
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  error={!!formErrors?.fullName}
                  helperText={formErrors?.fullName}
                  label="Full Name *"
                  fullWidth
                  placeholder="Enter Full Name"
                  value={formData.fullName}
                  onChange={(e) => {
                    let val = e.target.value;
                    setFormData({ ...formData, fullName: val });
                    if (val.trim().length == 0) {
                      setFormErrors({
                        ...formErrors,
                        fullName: "Full Name is Required",
                      });
                    } else {
                      setFormErrors({
                        ...formErrors,
                        fullName: "",
                      });
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  disabled={true}
                  error={!!formErrors?.phoneNumber}
                  helperText={formErrors?.phoneNumber}
                  label="Phone Number"
                  fullWidth
                  placeholder="Enter Phone Number"
                  value={formData.countryCode + " " + formData.phoneNumber}
                  onChange={(e) => {
                    let val = e.target.value.toString();
                    setFormData({ ...formData, phoneNumber: val });
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} className="mt-4">
              <CustomTextField
                error={!!formErrors?.email}
                helperText={formErrors?.email}
                label="Email Address *"
                fullWidth
                placeholder="Enter Email"
                value={formData.email}
                onChange={(e) => {
                  let val = e.target.value;
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  setFormData({ ...formData, email: val });
                  if (val.trim().length == 0) {
                    setFormErrors({
                      ...formErrors,
                      email: "Email is Required",
                    });
                  } else if (!emailRegex.test(val)) {
                    setFormErrors({
                      ...formErrors,
                      email: "Invalid email address",
                    });
                  } else {
                    setFormErrors({
                      ...formErrors,
                      email: "",
                    });
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} className="mt-4">
              <CustomTextField
                error={!!formErrors?.brandName}
                helperText={formErrors?.brandName}
                label="Brand Name *"
                fullWidth
                placeholder="Enter Brand Name"
                value={formData.brandName}
                onChange={(e) => {
                  setFormData({ ...formData, brandName: e.target.value });
                  let val = e.target.value;
                  setFormData({ ...formData, brandName: val });
                  if (val.trim().length == 0) {
                    setFormErrors({
                      ...formErrors,
                      brandName: "Brand Name is Required",
                    });
                  } else {
                    setFormErrors({
                      ...formErrors,
                      brandName: "",
                    });
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} className="mt-4">
              <CustomTextField
                error={!!formErrors?.websiteURL}
                helperText={formErrors?.websiteURL}
                label="Website URL"
                fullWidth
                placeholder="Enter Website URL"
                value={formData.websiteURL}
                onChange={(e) =>
                  setFormData({ ...formData, websiteURL: e.target.value })
                }
              />
            </Grid>
            <Grid container columnSpacing={2} className="mt-4">
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  error={!!formErrors?.country}
                  helperText={formErrors?.country}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.country}
                  label="Select Country *"
                  id="custom-select"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      country: Number(e.target.value),
                    });
                    if (val === 0) {
                      setFormErrors({
                        ...formErrors,
                        country: "Please Select Country",
                      });
                    } else {
                      setFormErrors({
                        ...formErrors,
                        country: "",
                      });
                    }
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select Country</em>
                  </MenuItem>
                  {!loading &&
                    !!country?.length &&
                    country.map((c) => (
                      <MenuItem value={c.id} key={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  error={!!formErrors?.userState}
                  helperText={formErrors?.userState}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.userState}
                  label="Select State *"
                  id="custom-select"
                  onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      userState: val,
                    });
                    if (val === 0) {
                      setFormErrors({
                        ...formErrors,
                        userState: "Please Select State",
                      });
                    } else {
                      setFormErrors({
                        ...formErrors,
                        userState: "",
                      });
                    }
                    let data = await fetchCities([val]);
                    setCity(data);
                    setFormData((prevState) => ({
                      ...prevState,
                      userCity: 0,
                    }));
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select State</em>
                  </MenuItem>
                  {!loading &&
                    !!state?.length &&
                    state.map((c) => (
                      <MenuItem value={c.id} key={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
            </Grid>
            <Grid container columnSpacing={2} className="mt-4">
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  error={!!formErrors?.userCity}
                  helperText={formErrors?.userCity}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.userCity}
                  label="Select City *"
                  id="custom-select"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      userCity: val,
                    });
                    if (val === 0) {
                      setFormErrors({
                        ...formErrors,
                        userCity: "Please Select City",
                      });
                    } else {
                      setFormErrors({
                        ...formErrors,
                        userCity: "",
                      });
                    }
                  }}
                >
                  <MenuItem value={"0"}>
                    <em>Select City</em>
                  </MenuItem>
                  {!loading &&
                    !!city?.length &&
                    city.map((c) => (
                      <MenuItem value={c.id} key={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  error={!!formErrors?.pincode}
                  helperText={formErrors?.pincode}
                  label="Pincode *"
                  fullWidth
                  placeholder="Enter Pincode"
                  value={formData.pincode}
                  onChange={(e) => {
                    let val = e.target.value;
                    setFormData({ ...formData, pincode: val });
                    const pincodeRegex = /^[1-9][0-9]{5}$/;
                    if (val.trim().length === 0) {
                      setFormErrors({
                        ...formErrors,
                        pincode: "Pincode is Required",
                      });
                    } else if (!pincodeRegex.test(val)) {
                      setFormErrors({
                        ...formErrors,
                        pincode: "Enter Correct Pincode",
                      });
                    } else {
                      setFormErrors({
                        ...formErrors,
                        pincode: "",
                      });
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} className="mt-4">
              <Grid item xs={12} sm={6}>
                {/* <CustomAutocomplete
                  fullWidth
                  options={state}
                  value={formData.country}
                  id="autocomplete-custom"
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <CustomTextField
                      placeholder="Select City"
                      {...params}
                      label="City"
                    />
                  )}
                /> */}
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className="p-2">
            <Typography variant="h5" className="underline mb-4">
              {" "}
              Brand Details:{" "}
            </Typography>

            <Grid item xs={12} sm={12} className="mt-5">
              <CustomTextField
                error={!!formErrors?.companyName}
                helperText={formErrors?.companyName}
                label="Company Name"
                fullWidth
                placeholder="Enter Company Name"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
              />
            </Grid>
            <Grid container columnSpacing={2} className="mt-4">
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  error={!!formErrors?.industry}
                  helperText={formErrors?.industry}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.industry}
                  label="Industry  "
                  id="custom-select"
                  onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      industry: Number(e.target.value),
                      subCategory: 0,
                      service: 0,
                    });
                    let data = await fetchSubCategory(val);
                    setSubCategory(data);
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select industry</em>
                  </MenuItem>
                  {!loading &&
                    !!industry?.length &&
                    industry.map((c) => (
                      <MenuItem value={c.id} key={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  error={!!formErrors?.subCategory}
                  helperText={formErrors?.subCategory}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.subCategory}
                  label="Sub-Category  "
                  id="custom-select"
                  onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      subCategory: Number(e.target.value),
                      service: 0,
                    });
                    let data = await fetchService(val);
                    setService(data);
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select Sub-Category</em>
                  </MenuItem>
                  {!loading &&
                    !!subCategory?.length &&
                    subCategory.map((c) => (
                      <MenuItem value={c.id} key={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  error={!!formErrors?.service}
                  helperText={formErrors?.service}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.service}
                  label="Service/Product  "
                  id="custom-select"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      service: Number(e.target.value),
                    });
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select industry</em>
                  </MenuItem>
                  {!loading &&
                    !!service?.length &&
                    service.map((c) => (
                      <MenuItem value={c.id} key={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
            </Grid>
            <Grid container columnSpacing={2} className="mt-4">
              <Grid item xs={12} sm={6}>
                <AppReactDatepicker
                  showYearPicker
                  dateFormat="yyyy"
                  selected={
                    formData.businessCommencedYear
                      ? new Date(formData.businessCommencedYear)
                      : null
                  }
                  id="year-picker"
                  onChange={(date: Date) => {
                    const year = date.getFullYear().toString();
                    setFormData({ ...formData, businessCommencedYear: year });
                  }}
                  placeholderText="Business Commenced Year"
                  customInput={
                    <CustomTextField
                      label="Business Commenced Year"
                      fullWidth
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AppReactDatepicker
                  showYearPicker
                  dateFormat="yyyy"
                  selected={
                    formData.franchiseCommencedYear
                      ? new Date(formData.franchiseCommencedYear)
                      : null
                  }
                  id="year-picker"
                  onChange={(date: Date) => {
                    const year = date.getFullYear().toString();
                    setFormData({ ...formData, franchiseCommencedYear: year });
                  }}
                  placeholderText="Franchise Commenced On"
                  customInput={
                    <CustomTextField label="Franchise Commenced On" fullWidth />
                  }
                />
              </Grid>
            </Grid>
            <Grid container columnSpacing={2} className="mt-4">
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  error={!!formErrors?.headquartersLocation}
                  helperText={formErrors?.headquartersLocation}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.headquartersLocation}
                  label="Location of Headquarters  "
                  id="custom-select"
                  onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      headquartersLocation: Number(e.target.value),
                    });
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select Headquarters Location</em>
                  </MenuItem>
                  {!loading &&
                    !!headquarter?.length &&
                    headquarter.map((c) => (
                      <MenuItem value={c.id} key={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  error={!!formErrors?.numberOfLocations}
                  helperText={formErrors?.numberOfLocations}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.numberOfLocations}
                  label="Current Number of Locations/Outlets"
                  id="custom-select"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      numberOfLocations: Number(e.target.value),
                    });
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select Number of Locations</em>
                  </MenuItem>
                  {!loading &&
                    !!outlet?.length &&
                    outlet.map((c) => (
                      <MenuItem value={c.id} key={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} className="mt-4">
              <CustomTextField
                multiline
                maxRows={10}
                minRows={4}
                error={!!formErrors?.brandDescription}
                helperText={formErrors?.brandDescription}
                label="Description"
                fullWidth
                placeholder="Enter Brand Description"
                value={formData.brandDescription}
                onChange={(e) =>
                  setFormData({ ...formData, brandDescription: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} className="mt-4">
              <CustomTextField
                multiline
                maxRows={4}
                minRows={4}
                error={!!formErrors?.usp}
                helperText={formErrors?.usp}
                label="Unique Selling Proposition (USP)"
                fullWidth
                placeholder="Enter Unique Selling Proposition"
                value={formData.usp}
                onChange={(e) =>
                  setFormData({ ...formData, usp: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} className="mt-4">
              <CustomTextField
                select
                fullWidth
                label="States"
                value={Array.isArray(formData.state) ? formData.state : []}
                id="demo-multiple-checkbox"
                SelectProps={{
                  MenuProps,
                  multiple: true,
                  onChange: (event: SelectChangeEvent<unknown>) => {
                    let selectedIds = event.target.value as number[];
                    setFormData({ ...formData, state: selectedIds });
                  },
                  renderValue: (selected) => {
                    let selectedValue = selected as number[];
                    const selectedNames =
                      state &&
                      state.length &&
                      state
                        .filter((item) => selectedValue.includes(item.id))
                        .map((item) => (
                          <CustomChip
                            className="mr-2"
                            round="true"
                            label={item.name}
                            color="primary"
                          />
                        ));
                    return selectedNames;
                  },
                }}
              >
                {!loading &&
                  state &&
                  state?.length &&
                  state.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      <Checkbox
                        checked={
                          Array.isArray(formData.state)
                            ? formData.state?.includes(c.id)
                            : false
                        }
                      />
                      <ListItemText primary={c.name} />
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={12} className="mt-4">
              <CustomTextField
                select
                fullWidth
                label="Cities"
                value={Array.isArray(formData.city) ? formData.city : []}
                id="demo-multiple-checkbox"
                SelectProps={{
                  MenuProps,
                  multiple: true,
                  onChange: (event: SelectChangeEvent<unknown>) => {
                    let selectedIds = event.target.value as number[];
                    setFormData({ ...formData, city: selectedIds });
                  },
                  renderValue: (selected) => {
                    let selectedValue = selected as number[];
                    const selectedNames =
                      allCity &&
                      allCity.length &&
                      allCity
                        .filter((item) => selectedValue.includes(item.id))
                        .map((item) => (
                          <CustomChip
                            className="mr-2"
                            round="true"
                            label={item.name}
                            color="primary"
                          />
                        ));
                    return selectedNames;
                  },
                }}
              >
                {!loading &&
                  allCity &&
                  allCity?.length &&
                  allCity.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      <Checkbox
                        checked={
                          Array.isArray(formData.city)
                            ? formData.city?.includes(c.id)
                            : false
                        }
                      />
                      <ListItemText primary={c.name} />
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className="p-2">
            <Typography variant="h5" className="underline">
              {" "}
              Investment Details:{" "}
            </Typography>

            <Grid container spacing={2} className="mt-5">
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  error={!!formErrors?.areaRequired}
                  helperText={formErrors?.areaRequired}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.areaRequired}
                  label="Area Required( Sq.ft )"
                  id="custom-select"
                  onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      areaRequired: Number(e.target.value),
                    });
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select Area Required</em>
                  </MenuItem>
                  {!loading &&
                    !!areaRequired?.length &&
                    areaRequired.map((c) => (
                      <MenuItem value={c.id} key={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  error={!!formErrors?.investmentRange}
                  helperText={formErrors?.investmentRange}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.investmentRange}
                  label="Total Initial Investment Range"
                  id="custom-select"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      investmentRange: Number(e.target.value),
                    });
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select Total Initial Investment Range</em>
                  </MenuItem>
                  {!loading &&
                    !!investmentRange?.length &&
                    investmentRange.map((c) => (
                      <MenuItem value={c.id} key={c.range}>
                        {c.range}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={12} className="mt-3">
                <CustomTextField
                  type="text"
                  label="Franchise Fee(in INR)"
                  id="form-props-number"
                  fullWidth
                  error={!!formErrors.franchiseFee}
                  helperText={formErrors?.franchiseFee}
                  value={formData?.franchiseFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      franchiseFee: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} className="mt-3">
                <CustomTextField
                  select
                  fullWidth
                  label="Sales and Revenue Model"
                  value={
                    Array.isArray(formData.salesRevenueModel)
                      ? formData.salesRevenueModel
                      : []
                  }
                  id="demo-multiple-checkbox"
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    onChange: (event: SelectChangeEvent<unknown>) => {
                      let selectedIds = event.target.value as number[];
                      setFormData({
                        ...formData,
                        salesRevenueModel: selectedIds,
                      });
                    },
                    renderValue: (selected) => {
                      let selectedValue = selected as number[];
                      const selectedNames =
                        salesRevenueModel &&
                        salesRevenueModel.length &&
                        salesRevenueModel
                          .filter((item) => selectedValue.includes(item.id))
                          .map((item) => (
                            <CustomChip
                              className="mr-2"
                              round="true"
                              label={item.name}
                              color="primary"
                            />
                          ));
                      return selectedNames;
                    },
                  }}
                >
                  {!loading &&
                    salesRevenueModel &&
                    salesRevenueModel?.length &&
                    salesRevenueModel.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        <Checkbox
                          checked={
                            Array.isArray(formData.salesRevenueModel)
                              ? formData.salesRevenueModel?.includes(c.id)
                              : false
                          }
                        />
                        <ListItemText primary={c.name} />
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>

              <Grid item xs={12} sm={12} className="mt-3">
                <CustomTextField
                  select
                  fullWidth
                  label="Support Provided"
                  value={
                    Array.isArray(formData.supportProvided)
                      ? formData.supportProvided
                      : []
                  }
                  id="demo-multiple-checkbox"
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    onChange: (event: SelectChangeEvent<unknown>) => {
                      let selectedIds = event.target.value as number[];
                      setFormData({
                        ...formData,
                        supportProvided: selectedIds,
                      });
                    },
                    renderValue: (selected) => {
                      let selectedValue = selected as number[];
                      const selectedNames =
                        supportProvided &&
                        supportProvided.length &&
                        supportProvided
                          .filter((item) => selectedValue.includes(item.id))
                          .map((item) => (
                            <CustomChip
                              className="mr-2"
                              round="true"
                              label={item.name}
                              color="primary"
                            />
                          ));
                      return selectedNames;
                    },
                  }}
                >
                  {!loading &&
                    supportProvided &&
                    supportProvided?.length &&
                    supportProvided.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        <Checkbox
                          checked={
                            Array.isArray(formData.supportProvided)
                              ? formData.supportProvided?.includes(c.id)
                              : false
                          }
                        />
                        <ListItemText primary={c.name} />
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} className="mt-3">
                <CustomTextField
                  error={!!formErrors?.paybackPeriod}
                  helperText={formErrors?.paybackPeriod}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.paybackPeriod}
                  label="Likely Payback Period for a Unit Franchise"
                  id="custom-select"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      paybackPeriod: Number(e.target.value),
                    });
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select Likely Payback Period for a Unit Franchise</em>
                  </MenuItem>
                  {!loading &&
                    !!paybackPeriod?.length &&
                    paybackPeriod.map((c) => (
                      <MenuItem value={c.id} key={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} className="mt-3">
                <CustomTextField
                  error={!!formErrors?.tenurePeriod}
                  helperText={formErrors?.tenurePeriod}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.tenurePeriod}
                  label="Lock In Tenure period"
                  id="custom-select"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      tenurePeriod: Number(e.target.value),
                    });
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select Lock In Tenure period</em>
                  </MenuItem>
                  {!loading &&
                    !!paybackPeriod?.length &&
                    paybackPeriod.map((c) => (
                      <MenuItem value={c.id} key={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={12} className="mt-3">
                <CustomTextField
                  multiline
                  maxRows={4}
                  minRows={4}
                  error={!!formErrors?.otherApplicable}
                  helperText={formErrors?.otherApplicable}
                  label="Others if applicable"
                  fullWidth
                  placeholder="Your Message"
                  value={formData.otherApplicable}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otherApplicable: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} className="mt-3">
                <CustomTextField
                  error={!!formErrors?.franchiseDuration}
                  helperText={formErrors?.franchiseDuration}
                  select
                  fullWidth
                  defaultValue="0"
                  value={formData.franchiseDuration}
                  label="How long is the franchise for(in years)?"
                  id="custom-select"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      franchiseDuration: Number(e.target.value),
                    });
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select How long is the franchise for</em>
                  </MenuItem>
                  {!loading &&
                    !!franchiseDuration?.length &&
                    franchiseDuration.map((c) => (
                      <MenuItem value={c.id} key={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} className="mt-3">
                <CustomTextField
                  error={!!formErrors?.isRenewable}
                  helperText={formErrors?.isRenewable}
                  select
                  fullWidth
                  defaultValue="false"
                  value={formData.isRenewable}
                  label="Is the term renewable?"
                  id="custom-select"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let val = e.target.value;
                    setFormData({
                      ...formData,
                      isRenewable: val === "true" ? true : false,
                    });
                  }}
                >
                  <MenuItem value={"true"}>
                    <em>Yes</em>
                  </MenuItem>
                  <MenuItem value={"false"}>
                    <em>No</em>
                  </MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} className="mt-3">
                <Typography color="text.primary">
                  Detailed operating manuals for franchisees
                </Typography>
                <RadioGroup
                  row
                  aria-label="controlled"
                  name="controlled"
                  value={formData.isOperatingManuals}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isOperatingManuals:
                        e.target.value === "true" ? true : false,
                    })
                  }
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={6} className="mt-3">
                <Typography color="text.primary">
                  Franchisee training location
                </Typography>
                <RadioGroup
                  row
                  aria-label="controlled"
                  name="controlled"
                  value={formData.trainingLocation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trainingLocation:
                        e.target.value === "true" ? true : false,
                    })
                  }
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Head office"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Online/HQ"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={6} className="mt-3">
                <Typography color="text.primary">
                  Is field assistance available for franchisee?
                </Typography>
                <RadioGroup
                  row
                  aria-label="controlled"
                  name="controlled"
                  value={formData.isAssistanceAvailable}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isAssistanceAvailable:
                        e.target.value === "true" ? true : false,
                    })
                  }
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={6} className="mt-3">
                <Typography color="text.primary">
                  Current IT systems will be included in the franchise
                </Typography>
                <RadioGroup
                  row
                  aria-label="controlled"
                  name="controlled"
                  value={formData.isITSystemIncluded}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isITSystemIncluded:
                        e.target.value === "true" ? true : false,
                    })
                  }
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={12} className="mt-3">
                <Typography color="text.primary">
                  Expert guidance from Head Office to franchisee in opening the
                  franchise
                </Typography>
                <RadioGroup
                  row
                  aria-label="controlled"
                  name="controlled"
                  value={formData.isExpertGuidance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isExpertGuidance:
                        e.target.value === "true" ? true : false,
                    })
                  }
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className="p-2">
            <Typography variant="h5" className="underline">
              {" "}
              Visualize Brand Details:{" "}
            </Typography>
            <Grid container spacing={2} className="mt-5">
              <Grid item xs={12} sm={6} className="mt-3">
                {/* Brochure Upload */}
                {!brochure && (
                  <div {...getBrochureProps({ className: "dropzone" })}>
                    <input {...getBrochureInputProps()} />
                    <div className="flex items-center flex-col w-[450px] h-[200px] p-2 border-dashed border-2">
                      <Avatar variant="rounded" className="bs-12 is-12 mbe-9">
                        <i className="tabler-upload" />
                      </Avatar>
                      <Typography variant="h5" className="mbe-2.5">
                        Drop brochure here or click to upload.
                      </Typography>
                      <Typography>Allowed *.pdf & Image</Typography>
                      <Typography>Max size 25 MB</Typography>
                    </div>
                  </div>
                )}

                {brochure && (
                  <div>
                    <Typography variant="h5" className="">
                      Brochure
                    </Typography>
                    <div className="file-details flex justify-between items-center w-[450px]">
                      {renderFilePreview(brochure)}
                      <Typography className="file-name">
                        {brochure.name}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          setIsFilesTouched({
                            ...isFilesTouched,
                            brochure: true,
                          });
                          handleRemoveFile(brochure, setBrochure);
                          setFormErrors({ ...formErrors, brochure: "" });
                        }}
                      >
                        <i className="tabler-x text-xl" />
                      </IconButton>
                    </div>
                  </div>
                )}

                {formErrors.brochure && (
                  <Typography variant="h6" className="text-red-600 w-[400px]">
                    {formErrors.brochure}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6} className="mt-3">
                {/* Logo Dropzone */}
                {!logo && (
                  <div {...getLogoProps({ className: "dropzone" })}>
                    <input {...getLogoInputProps()} />
                    <div className="flex items-center flex-col w-[450px] h-[200px] p-2 border-dashed border-2">
                      <Avatar variant="rounded" className="bs-12 is-12 mbe-9">
                        <i className="tabler-upload" />
                      </Avatar>
                      <Typography variant="h5" className="mbe-2.5">
                        Drop logo here or click to upload.
                      </Typography>
                      <Typography>Allowed image files</Typography>
                      <Typography>Max size 5 MB</Typography>
                    </div>
                  </div>
                )}

                {logo && (
                  <div>
                    <Typography variant="h5" className="">
                      Logo
                    </Typography>
                    <div className="file-details flex justify-between items-center w-[450px]">
                      {renderFilePreview(logo)}
                      <Typography className="file-name">{logo.name}</Typography>
                      <IconButton
                        onClick={() => {
                          setIsFilesTouched({ ...isFilesTouched, logo: true });
                          handleRemoveFile(logo, setLogo);
                          setFormErrors({ ...formErrors, logo: "" });
                        }}
                      >
                        <i className="tabler-x text-xl" />
                      </IconButton>
                    </div>
                  </div>
                )}
              </Grid>

              <Grid item xs={12} sm={6} className="mt-3">
                <div {...getBrandImagesProps({ className: "dropzone" })}>
                  <input {...getBrandImagesInputProps()} />
                  <div className="flex items-center flex-col w-[450px] h-[200px] p-2 border-dashed border-2">
                    <Avatar variant="rounded" className="bs-12 is-12 mbe-9">
                      <i className="tabler-upload" />
                    </Avatar>
                    <Typography variant="h5" className="mbe-2.5">
                      Drop brand images here or click to upload.{" "}
                      <b>({brandImages.length}/5)</b>
                    </Typography>
                    <Typography>Allowed image files</Typography>
                    <Typography>Max size 5 MB</Typography>
                  </div>
                </div>
                <div className="brand-images-preview flex flex-col gap-y-2">
                  {brandImages.map((file) => (
                    <div
                      key={file.name}
                      className="file-details flex justify-between items-center w-[450px]"
                    >
                      {renderFilePreview(file)}
                      <Typography className="file-name">{file.name}</Typography>
                      <IconButton onClick={() => handleRemoveBrandImage(file)}>
                        <i className="tabler-x text-xl" />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </Grid>
              <Grid item xs={12} sm={6} className="mt-3">
                {/* Video Dropzone */}
                {!video && (
                  <div {...getVideoProps({ className: "dropzone" })}>
                    <input {...getVideoInputProps()} />
                    <div className="flex items-center flex-col w-[450px] h-[200px] p-2 border-dashed border-2">
                      <Avatar variant="rounded" className="bs-12 is-12 mbe-9">
                        <i className="tabler-upload" />
                      </Avatar>
                      <Typography variant="h5" className="mbe-2.5">
                        Drop video here or click to upload.
                      </Typography>
                      <Typography>Allowed video files</Typography>
                      <Typography>Max size 25 MB</Typography>
                    </div>
                  </div>
                )}

                {video && (
                  <div>
                    {" "}
                    <Typography variant="h5" className="">
                      Video
                    </Typography>
                    <div className="file-details flex justify-between items-center w-[450px]">
                      {renderFilePreview(video)}
                      <Typography className="file-name">
                        {video.name}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          setIsFilesTouched({ ...isFilesTouched, video: true });
                          handleRemoveFile(video, setVideo);
                          setFormErrors({ ...formErrors, video: "" });
                        }}
                      >
                        <i className="tabler-x text-xl" />
                      </IconButton>
                    </div>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sm={6} className="mt-3">
                {/* Franchise Aggrement Dropzone */}
                {!franchiseAggrementFile && (
                  <div
                    {...getFranchiseAggrementProps({ className: "dropzone" })}
                  >
                    <input {...getFranchiseAggrementInputProps()} />
                    <div className="flex items-center flex-col w-[450px] h-[200px] p-2 border-dashed border-2">
                      <Avatar variant="rounded" className="bs-12 is-12 mbe-9">
                        <i className="tabler-upload" />
                      </Avatar>
                      <Typography variant="h5" className="mbe-2.5">
                        Drop Franchise Agrement here or click to upload.
                      </Typography>
                      <Typography>Allowed pdf & word files</Typography>
                      <Typography>Max size 10 MB</Typography>
                    </div>
                  </div>
                )}

                {franchiseAggrementFile && (
                  <div>
                    <Typography variant="h5" className="">
                      Franchise Aggrement File
                    </Typography>
                    <div className="file-details flex justify-between items-center w-[450px]">
                      {renderFilePreview(franchiseAggrementFile)}
                      <Typography className="file-name">
                        {franchiseAggrementFile.name}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          setIsFilesTouched({
                            ...isFilesTouched,
                            franchiseAggrementFile: true,
                          });
                          handleRemoveFile(
                            franchiseAggrementFile,
                            setFranchiseAggrementFile
                          );
                          setFormErrors({
                            ...formErrors,
                            franchiseAggrementFile: "",
                          });
                        }}
                      >
                        <i className="tabler-x text-xl" />
                      </IconButton>
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          style={{ position: "sticky", bottom: 0, zIndex: 10 }}
        >
          <Box
            p={2}
            display="flex"
            gap={2}
            justifyContent="end"
            bgcolor="background.paper"
          >
            <Button
              variant="contained"
              color="error"
              type="reset"
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              onClick={() => {
                if (checkFormIsValid(formErrors)) {
                  setIsUpdate(true);
                }
              }}
            >
              Update
            </Button>
          </Box>
        </Grid>
        {isUpdate && (
          <ConfirmationDialog
            handleSubmit={handleSubmit}
            open={isUpdate}
            setOpen={(arg1: boolean) => setIsUpdate(arg1)}
          />
        )}
      </Grid>
    </>
  );
}

export default BrandEditForm;
