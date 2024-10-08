"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import { post } from "@/services/apiService";
import { brandList } from "@/services/endpoint/brandList";
import BrandDetail from "./BrandDetail";

const Page = ({ params }: { params: { id: string } }) => {
  const [brandDetail, setBrandDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await post(brandList.getById, {
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
  }, [params.id]);
  return (
    <>
      <LoadingBackdrop isLoading={loading} />
      {!loading && brandDetail && <BrandDetail brandDetails={brandDetail} />}
    </>
  );
};

export default Page;
