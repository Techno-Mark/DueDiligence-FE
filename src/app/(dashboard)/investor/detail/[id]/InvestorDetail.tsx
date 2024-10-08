import { Card, Typography, Grid, Button, Box } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useRouter } from "next/navigation";
import React from "react";

type pageProps = {
  investorDetail: any;
};

function InvestorDetail({ investorDetail: data }: pageProps) {
  const router = useRouter();
  return (
    <Grid container spacing={6} alignItems={"flex-start"}>
      <Grid
        item
        xs={12}
        sm={8}
        display={"flex"}
        flexDirection={"column"}
        rowGap={6}
      >
        <Grid item xs={6} sm={11}>
          <Card className="p-2">
            <Typography variant="h5" className="underline">
              {" "}
              User Details:{" "}
            </Typography>

            <div className="p-2 flex flex-col space-y-2 my-2">
              <div className="flex items-center space-x-2">
                <Typography variant="h6" className="w-32">
                  {" "}
                  Full Name:{" "}
                </Typography>
                <Typography>{data.fullName || "NA"} </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Typography variant="h6" className="w-32">
                  {" "}
                  Email:{" "}
                </Typography>
                <Typography>{data.email || "NA"} </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Typography variant="h6" className="w-32">
                  {" "}
                  Phone Number:{" "}
                </Typography>
                <Typography>
                  {data.countryCode + " " + data.phoneNumber}{" "}
                </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Typography variant="h6" className="w-32">
                  {" "}
                  Address:{" "}
                </Typography>
                <Typography>{data.address || "NA"} </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Typography variant="h6" className="w-32">
                  {" "}
                  State:{" "}
                </Typography>
                <Typography>{data.stateAssociation?.name || "NA"} </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Typography variant="h6" className="w-32">
                  {" "}
                  City:{" "}
                </Typography>
                <Typography>{data.cityAssociation?.name || "NA"} </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Typography variant="h6" className="w-32">
                  {" "}
                  Pincode:{" "}
                </Typography>
                <Typography>{data.pincode || "NA"} </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Typography variant="h6" className="w-32">
                  {" "}
                  Education Qualification:{" "}
                </Typography>
                <Typography>
                  {data.educationQualificationAssociation?.name || "NA"}{" "}
                </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Typography variant="h6" className="w-32">
                  {" "}
                  Occupation:{" "}
                </Typography>
                <Typography>{data.occupationAssociation?.name} </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Typography variant="h6" className="w-32">
                  {" "}
                  Accept Terms:{" "}
                </Typography>
                <Typography>{data.acceptTerms?.toString() || "NA"} </Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Typography variant="h6" className="w-32">
                  {" "}
                  Submit Info:{" "}
                </Typography>
                <Typography>{data.submitInfo?.toString() || "NA"} </Typography>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={11}>
          <Card className="p-2">
            <Typography variant="h5" className="underline">
              {" "}
              Investor Details:{" "}
            </Typography>
            <table className="p-2">
              <tr>
                <td>
                  <Typography variant="h6" className="w-40">
                    Industry Type:{" "}
                  </Typography>
                </td>
                <td>
                  <Typography>
                    {data.industryAssociation?.name || "NA"}{" "}
                  </Typography>
                </td>
              </tr>
              <tr>
                <td>
                  <Typography variant="h6" className="w-40">
                    Investment Range:{" "}
                  </Typography>
                </td>
                <td>
                  <Typography>
                    {data.investmentRangeAssociation?.range || "NA"}{" "}
                  </Typography>
                </td>
              </tr>
              <tr>
                <td>
                  <Typography variant="h6" className="w-40">
                    Available Capital:{" "}
                  </Typography>
                </td>
                <td>
                  <Typography>
                    {data.availableCapital?.name || "NA"}{" "}
                  </Typography>
                </td>
              </tr>
              <tr>
                <td>
                  <Typography variant="h6"> Need for Loan: </Typography>
                </td>
                <td>
                  <Typography>
                    {data.needForLoan?.toString() || "NA"}
                  </Typography>
                </td>
              </tr>
              <tr>
                <td>
                  <Typography variant="h6" className="w-40">
                    {" "}
                    Like to Invest:{" "}
                  </Typography>
                </td>
                <td>
                  <Typography>
                    {data.likeToInvestAssociation?.name || "NA"}
                  </Typography>
                </td>
              </tr>
              <tr>
                <td>
                  <Typography variant="h6" className="w-40">
                    {" "}
                    Looking For:{" "}
                  </Typography>
                </td>
                <td>
                  <Typography>
                    {data.lookingForAssociation?.name || "NA"}{" "}
                  </Typography>
                </td>
              </tr>
              <tr>
                <td>
                  <Typography variant="h6"> Own Property: </Typography>
                </td>
                <td>
                  <Typography>
                    {data.ownProperty?.toString() || "NA"}
                  </Typography>
                </td>
              </tr>
            </table>
          </Card>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sm={4}
        display={"flex"}
        flexDirection={"column"}
        rowGap={6}
      >
        <Grid item xs={12} sm={10}>
          <Card className="p-2">
            <Typography variant="h5" className="underline">
              {" "}
              Looking for State:{" "}
            </Typography>
            {data.lookingForState?.length &&
            Array.isArray(data.lookingForState) &&
            data.lookingForState.length > 0
              ? data.lookingForState.map((name: string) => (
                  <ListItem>
                    <ListItemText primary={`${name}`} />
                  </ListItem>
                ))
              : "NA"}
          </Card>
        </Grid>
        <Grid item xs={12} sm={10}>
          <Card className="p-2">
            <Typography variant="h5" className="underline">
              {" "}
              Looking for City:{" "}
            </Typography>
            {data.lookingForCity?.length &&
            Array.isArray(data.lookingForCity) &&
            data.lookingForCity.length > 0
              ? data.lookingForCity?.map((name: string) => (
                  <ListItem>
                    <ListItemText primary={`${name}`} />
                  </ListItem>
                ))
              : "NA"}
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ position: "sticky", bottom: 0, zIndex: 10 }}>
        <Box
          p={2}
          display="flex"
          gap={2}
          justifyContent="end"
          bgcolor="background.paper"
        >
          <button
            className="bg-[#17498a] text-white font-semibold py-2 px-4 mx-2 cursor-pointer rounded-lg shadow-md hover:bg-[#1d4981] transition-colors duration-300"
            onClick={() => router.push("/investor")}
          >
            Back
          </button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default InvestorDetail;
