"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import { post } from "@/services/apiService";
import { brandList } from "@/services/endpoint/brandList";
import BrandEditForm from "./BrandEditForm";
import { BrandEditDataType } from "@/types/apps/brandListType";

const Page = ({ params }: { params: { id: string } }) => {
  const [brandDetail, setBrandDetail] = useState<BrandEditDataType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await post(brandList.getEditDataById, {
          brandId: params.id,
        });
        if (response.ResponseStatus !== "success") {
          throw new Error("Failed to fetch data");
        }
        const data = await response;
        setBrandDetail(data.ResponseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <LoadingBackdrop isLoading={loading} />
      {!loading && brandDetail && (
        <BrandEditForm
          editData={brandDetail}
          handleClose={() => router.push("/home")}
        />
      )}
    </>
  );
};

export default Page;
