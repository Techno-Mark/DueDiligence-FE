import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { toast } from "react-toastify";

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
  status: string;
  permissions: IPermission[];
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
  userData?: UsersType | null;
  setData: Dispatch<SetStateAction<UsersType[]>>;
};

const validationSchema = Yup.object({
  rolename: Yup.string().required("Role name is required"),
  status: Yup.string().required("Status is required"),
  permissions: Yup.array().test(
    "at-least-one-permission",
    "Please select at least one permission across all modules",
    (permissions) => {
      if (!permissions) return false;
      return permissions.some((module) =>
        Object.entries(module)
          .filter(([key]) => ["view", "create", "edit", "delete"].includes(key))
          .some(([, value]) => value === true)
      );
    }
  ),
});

const AddRoleDrawer = ({ open, handleClose, userData, setData }: Props) => {
  // Initialize form values
  const formik = useFormik<IFormValues>({
    initialValues: {
      rolename: "",
      status: "active", // Set default status to active
      permissions: initialPermissions,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      const newRole: UsersType = {
        id: userData?.id || new Date().getTime(),
        role: values.rolename,
        status: values.status,
        modules: values.permissions,
      };

      if (userData) {
        toast.success("Access Group has been updated successfully");
      } else {
        toast.success("Access Group has been created successfully");
      }

      setData((prevData: UsersType[]) => {
        if (userData) {
          return prevData.map((role) =>
            role.id === userData.id ? newRole : role
          );
        }
        return [...prevData, newRole];
      });
      handleReset();
      handleClose();
    },
  });

  // Use useEffect to update form values when userData changes
  useEffect(() => {
    if (open && userData) {
      // If editing existing role
      formik.setValues({
        rolename: userData.role,
        status: userData.status,
        permissions: userData.modules,
      });
    } else if (open && !userData) {
      // If adding new role
      formik.setValues({
        rolename: "",
        status: "active", // Set default status to active for new roles
        permissions: initialPermissions,
      });
    }
  }, [open, userData]);

  const getPermissionsError = () => {
    if (formik.touched.permissions && formik.errors.permissions) {
      return typeof formik.errors.permissions === "string"
        ? formik.errors.permissions
        : "Please check the permissions";
    }
    return "";
  };

  const handleChangePermission = (
    moduleId: number,
    field: string,
    value: boolean
  ) => {
    const newPermissions = formik.values.permissions.map((module) =>
      module.moduleId === moduleId ? { ...module, [field]: value } : module
    );
    formik.setFieldValue("permissions", newPermissions);
  };

  const handleSelectAll = (moduleId: number, isChecked: boolean) => {
    const newPermissions = formik.values.permissions.map((module) =>
      module.moduleId === moduleId
        ? {
            ...module,
            view: isChecked,
            create: isChecked,
            edit: isChecked,
            delete: isChecked,
          }
        : module
    );
    formik.setFieldValue("permissions", newPermissions);
  };

  const handleReset = () => {
    formik.resetForm();
    handleClose();
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
        <Typography variant="h5">
          {userData ? "Edit Access Group" : "Add Access Group"}
        </Typography>
        <IconButton size="small" onClick={handleReset}>
          <i className="tabler-x text-2xl text-textPrimary" />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-6 p-6"
        >
          <CustomTextField
            fullWidth
            id="rolename"
            name="rolename"
            label="Access Group Name*"
            placeholder="Access Group Name"
            value={formik.values.rolename}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.rolename && Boolean(formik.errors.rolename)}
            helperText={formik.touched.rolename && formik.errors.rolename}
          />

          {/* Only show status dropdown when editing */}
          {userData && (
            <CustomTextField
              select
              fullWidth
              id="status"
              name="status"
              label="Select Status*"
              placeholder="Select Status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </CustomTextField>
          )}

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
                {formik.values.permissions.map((item) => (
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
                    <td className="pr-2">
                      <Checkbox
                        checked={item.view}
                        onChange={(e) =>
                          handleChangePermission(
                            item.moduleId,
                            "view",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td className="pr-2">
                      <Checkbox
                        checked={item.create}
                        onChange={(e) =>
                          handleChangePermission(
                            item.moduleId,
                            "create",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td className="pr-2">
                      <Checkbox
                        checked={item.edit}
                        onChange={(e) =>
                          handleChangePermission(
                            item.moduleId,
                            "edit",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td className="pr-2">
                      <Checkbox
                        checked={item.delete}
                        onChange={(e) =>
                          handleChangePermission(
                            item.moduleId,
                            "delete",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {getPermissionsError() && (
              <FormHelperText error>{getPermissionsError()}</FormHelperText>
            )}
          </div>

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
