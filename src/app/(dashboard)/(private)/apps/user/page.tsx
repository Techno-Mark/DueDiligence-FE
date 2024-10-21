import { Grid, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import RoleListTable from "./UserTable";

const UserApp = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/not-found");
    return null;
  }

  interface UsersType {
    id: number;
    fullName: string;
    phoneNumber: string;
    email:string;
    role: string;
    status: string;
  }

  // Vars
  const data: UsersType[] = [
    {
      id: 1,
      fullName:"Super Admin",
      phoneNumber: "9185487532",
      email:"superAdmin@gmail.com",
      role: "Super Admin",
      status: "active",
      
    },
    {
      id: 2,
      fullName:"dummy user",
      phoneNumber: "7894523157",
      email:"dummyuser@gmail.com",
      role: "user",
      status: "active",
      
    },
    {
      id: 3,
      fullName:"New User",
      phoneNumber: "8224654523",
      email:"newUser@gmail.com",
      role: "Admin",
      status: "active",
    },
    {
      id: 4,
      fullName:"Jhon",
      phoneNumber: "9589562310",
      email:"jhon@gmail.com",
      role: "Viewer",
      status: "inactive",
    },
  ];

  return (
    <Grid item xs={12} spacing={6}>
      <Typography variant="h4" className="mbe-1 pb-5">
        User List
      </Typography>
      <Grid item xs={12}>
        <RoleListTable tableData={data} />
      </Grid>
    </Grid>
  );
};

export default UserApp;
