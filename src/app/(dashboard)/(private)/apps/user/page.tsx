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
    email: string;
    role: string;
    status: string;
  }

  // Vars
  const data: UsersType[] = [
    {
      id: 1,
      fullName: "Super Admin",
      phoneNumber: "9185487532",
      email: "superAdmin@gmail.com",
      role: "superAdmin",
      status: "active",
    },
    {
      id: 2,
      fullName: "Dummy User",
      phoneNumber: "7894523157",
      email: "dummyuser@gmail.com",
      role: "user",
      status: "active",
    },
    {
      id: 3,
      fullName: "New User",
      phoneNumber: "8224654523",
      email: "newUser@gmail.com",
      role: "admin",
      status: "active",
    },
    {
      id: 4,
      fullName: "John Doe",
      phoneNumber: "9589562310",
      email: "john.doe@gmail.com",
      role: "viewer",
      status: "inactive",
    },
    {
      id: 5,
      fullName: "Alice Smith",
      phoneNumber: "7234598741",
      email: "alice.smith@gmail.com",
      role: "editor",
      status: "active",
    },
    {
      id: 6,
      fullName: "Bob Williams",
      phoneNumber: "8123654789",
      email: "bob.williams@gmail.com",
      role: "moderator",
      status: "active",
    },
    {
      id: 7,
      fullName: "Clara Johnson",
      phoneNumber: "9021568745",
      email: "clara.johnson@gmail.com",
      role: "user",
      status: "inactive",
    },
    {
      id: 8,
      fullName: "David Brown",
      phoneNumber: "7152489635",
      email: "david.brown@gmail.com",
      role: "admin",
      status: "active",
    },
    {
      id: 9,
      fullName: "Emily Davis",
      phoneNumber: "6543217890",
      email: "emily.davis@gmail.com",
      role: "superAdmin",
      status: "active",
    },
    {
      id: 10,
      fullName: "Frank Harris",
      phoneNumber: "9845621370",
      email: "frank.harris@gmail.com",
      role: "viewer",
      status: "inactive",
    },
    {
      id: 11,
      fullName: "Grace Wilson",
      phoneNumber: "7152489874",
      email: "grace.wilson@gmail.com",
      role: "user",
      status: "active",
    },
    {
      id: 12,
      fullName: "Henry Miller",
      phoneNumber: "8965231478",
      email: "henry.miller@gmail.com",
      role: "admin",
      status: "inactive",
    },
  ];

  return (
    <Grid item xs={12} spacing={6}>
      <Grid item xs={12}>
        <RoleListTable tableData={data} />
      </Grid>
    </Grid>
  );
};

export default UserApp;
