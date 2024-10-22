import { Grid, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import RoleListTable from "./RolesTable";

const RolesApp = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/not-found");
    return null;
  }

  interface IPermission {
    moduleId: number;
    moduleName: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  }

  interface UsersType {
    id: number;
    role: string;
    status: string;
    modules: IPermission[];
  }

  // Vars
  const data: UsersType[] = [
    {
      id: 1,
      role: "Super Admin",
      status: "active",
      modules: [
        {
          moduleId: 1,
          moduleName: "Dashboard",
          view: true,
          create: true,
          edit: true,
          delete: true,
        },
        {
          moduleId: 2,
          moduleName: "Document Management",
          view: true,
          create: true,
          edit: true,
          delete: true,
        },
        {
          moduleId: 3,
          moduleName: "Company Management",
          view: true,
          create: true,
          edit: true,
          delete: true,
        },
        {
          moduleId: 4,
          moduleName: "User Management",
          view: true,
          create: true,
          edit: true,
          delete: true,
        },
      ],
    },
    {
      id: 2,
      role: "user",
      status: "active",
      modules: [
        {
          moduleId: 1,
          moduleName: "Dashboard",
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        {
          moduleId: 2,
          moduleName: "Document Management",
          view: true,
          create: false,
          edit: true,
          delete: false,
        },
        {
          moduleId: 3,
          moduleName: "Company Management",
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        {
          moduleId: 4,
          moduleName: "User Management",
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
      ],
    },
    {
      id: 3,
      role: "Admin",
      status: "active",
      modules: [
        {
          moduleId: 1,
          moduleName: "Dashboard",
          view: true,
          create: true,
          edit: true,
          delete: true,
        },
        {
          moduleId: 2,
          moduleName: "Document Management",
          view: true,
          create: false,
          edit: true,
          delete: false,
        },
        {
          moduleId: 3,
          moduleName: "Company Management",
          view: false,
          create: true,
          edit: false,
          delete: false,
        },
        {
          moduleId: 4,
          moduleName: "User Management",
          view: true,
          create: true,
          edit: true,
          delete: true,
        },
      ],
    },
    {
      id: 4,
      role: "Viewer",
      status: "inactive",
      modules: [
        {
          moduleId: 1,
          moduleName: "Dashboard",
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        {
          moduleId: 2,
          moduleName: "Document Management",
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        {
          moduleId: 3,
          moduleName: "Company Management",
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        {
          moduleId: 4,
          moduleName: "User Management",
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
      
      ],
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

export default RolesApp;
