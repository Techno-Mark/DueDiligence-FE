import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Typography,
  Divider,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import CustomTextField from "@core/components/mui/TextField";

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

interface IFormValues {
  rolename: string;
  username: string;
  email: string;
  role: string;
  status: string;
}

const initialPermissions: IPermission[] = [
  {
    moduleId: 1,
    moduleName: "Dashboard",
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    moduleId: 2,
    moduleName: "Document Management",
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    moduleId: 3,
    moduleName: "Company Management",
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
  {
    moduleId: 4,
    moduleName: "User Management",
    view: false,
    create: false,
    edit: false,
    delete: false,
  },
];

type Props = {
  open: boolean;
  handleClose: () => void;
  userData?: UsersType[];
  setData: (data: UsersType[]) => void;
};

const AddRoleDrawer = ({ open, handleClose, userData, setData }: Props) => {
  const [permissions, setPermissions] =
    useState<IPermission[]>(initialPermissions);
  console.log("🚀 ~ AddRoleDrawer ~ permissions:", permissions);
  const [permissionError, setPermissionError] = useState<string>("");

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      rolename: "",
      username: "",
      email: "",
      role: "",
      status: "",
    },
  });

  // Update state when checkbox changes
  const handleChangePermission = (updatedModule: IPermission) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((module) =>
        module.moduleId === updatedModule.moduleId ? updatedModule : module
      )
    );
    // Clear error when any permission is selected
    if (Object.values(updatedModule).slice(2).some(Boolean)) {
      setPermissionError("");
    }
  };

  // Handle 'Select All' checkbox logic
  const handleSelectAll = (moduleId: number, isChecked: boolean) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((module) =>
        module.moduleId === moduleId
          ? {
              ...module,
              view: isChecked,
              create: isChecked,
              edit: isChecked,
              delete: isChecked,
            }
          : module
      )
    );
    // Clear error when any permission is selected
    if (isChecked) {
      setPermissionError("");
    }
  };

  const validatePermissions = () => {
    let hasAtLeastOnePermission = false;
    let allModulesValid = true;

    permissions.forEach((module) => {
      const hasPermission = [
        module.view,
        module.create,
        module.edit,
        module.delete,
      ].some(Boolean);
      if (hasPermission) {
        hasAtLeastOnePermission = true;
      } else {
        allModulesValid = false;
      }
    });

    if (!hasAtLeastOnePermission) {
      setPermissionError(
        "Please select at least one permission across all modules."
      );
      return false;
    }

    if (!allModulesValid) {

      setPermissionError("All permissions must be selected for each module.");
      return false;
    }

    console.log("Hello1");
    setPermissionError("");
    return true;
  };

  const onSubmit = (data: IFormValues) => {
    console.log("Alvish", validatePermissions);

    if (!validatePermissions) {
      return;
    }

    const newRole: UsersType = {
      id: (userData?.length && userData.length + 1) || 1,
      role: data.rolename,
      status: data.status,
      modules: permissions.map((module) => ({
        moduleId: module.moduleId,
        moduleName: module.moduleName,
        view: module.view,
        create: module.create,
        edit: module.edit,
        delete: module.delete,
      })),
    };

    setData([...(userData ?? []), newRole]);
    handleClose();
    resetForm();
    setPermissions(initialPermissions);
    setPermissionError("");
  };

  const handleReset = () => {
    handleClose();
    resetForm();
    setPermissions(initialPermissions);
    setPermissionError("");
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 350, sm: 450 } } }}
    >
      <div className="flex items-center justify-between plb-5 pli-6">
        <Typography variant="h5">Add New Role</Typography>
        <IconButton size="small" onClick={handleReset}>
          <i className="tabler-x text-2xl text-textPrimary" />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 p-6"
        >
          <Controller
            name="rolename"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label="Role Name*"
                placeholder="Role Name"
                {...(errors.rolename && {
                  error: true,
                  helperText: "This field is required.",
                })}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                label="Select Status*"
                placeholder="Select Status"
                {...field}
                {...(errors.status && {
                  error: true,
                  helperText: "This field is required.",
                })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </CustomTextField>
            )}
          />
          {/* Permissions Table */}
          <div className="text-[12px] flex flex-col pb-5 -ml-2">
            <table className="min-w-[90%] divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-2 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Module
                  </th>
                  <th className="pr-2">All</th>
                  <th className="pr-2">View</th>
                  <th className="pr-2">Create</th>
                  <th className="pr-2">Edit</th>
                  <th className="pr-2">Delete</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {permissions.map((item) => (
                  <tr key={item.moduleId}>
                    <td className="whitespace-nowrap w-1/4">
                      <div className="flex items-start">
                        <div className="ml-2">
                          <div className="text-[13px] font-medium text-gray-900">
                            {item.moduleName}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Select All Checkbox */}
                    <td className="pr-2">
                      <Checkbox
                        checked={
                          item.view && item.create && item.edit && item.delete
                        }
                        onChange={(e) =>
                          handleSelectAll(item.moduleId, e.target.checked)
                        }
                      />
                    </td>
                    {/* Individual Checkboxes */}
                    <td className="pr-2">
                      <Checkbox
                        checked={item.view}
                        onChange={(e) =>
                          handleChangePermission({
                            ...item,
                            view: e.target.checked,
                          })
                        }
                      />
                    </td>
                    <td className="pr-2">
                      <Checkbox
                        checked={item.create}
                        onChange={(e) =>
                          handleChangePermission({
                            ...item,
                            create: e.target.checked,
                          })
                        }
                      />
                    </td>
                    <td className="pr-2">
                      <Checkbox
                        checked={item.edit}
                        onChange={(e) =>
                          handleChangePermission({
                            ...item,
                            edit: e.target.checked,
                          })
                        }
                      />
                    </td>
                    <td className="pr-2">
                      <Checkbox
                        checked={item.delete}
                        onChange={(e) =>
                          handleChangePermission({
                            ...item,
                            delete: e.target.checked,
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {permissionError && (
              <FormHelperText error>{permissionError}</FormHelperText>
            )}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="contained" type="submit">
              Submit
            </Button>
            <Button
              variant="tonal"
              color="error"
              type="reset"
              onClick={handleReset}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default AddRoleDrawer;
