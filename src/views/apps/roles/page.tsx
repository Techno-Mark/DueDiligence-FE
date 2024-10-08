// MUI Imports
import { Grid, Typography } from "@mui/material";

// Type Imports
import { UsersType } from "@/types/apps/userTypes";
import RolesTable from "./RolesTable";
import RoleCards from "./RoleCards";

// Component Imports

const Roles = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid item xs={12}>
      <Typography variant="h4" className="mbe-1">
        Roles List
      </Typography>
      <Typography>
        A role provided access to predefined menus and features so that
        depending on assigned role an administrator can have access to what he
        need
      </Typography>
      <Grid item xs={12}>
        <RolesTable tableData={userData} />
      </Grid>
    </Grid>
  );
};

export default Roles;
