import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import CustomTextField from "@core/components/mui/TextField";
import { toast } from "react-toastify";

interface UsersType {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
  status: string;
}

interface IFormValues {
  fullName: string;
  role: string;
  phoneNumber: string;
  email: string;
  status: string;
}

type Props = {
  open: boolean;
  handleClose: () => void;
  userData?: UsersType | null;
  setData: Dispatch<SetStateAction<UsersType[]>>;
};

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .required("Email is required")
    .matches(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please enter a valid email address"
    ),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits")
    .required("Phone Number is required"),
  status: Yup.string().required("Status is required"),
  role: Yup.string().required("Role is required"),
});

const AddUserDrawer = ({ open, handleClose, userData, setData }: Props) => {
  const formik = useFormik<IFormValues>({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      role: "",
      email: "",
      status: "active", // Set default status to active
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      const newRole: UsersType = {
        id: userData?.id || new Date().getTime(),
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        role: values.role,
        status: userData ? values.status : "active", // Use active for new users, submitted value for edits
      };
      if (userData) {
        toast.success("User profile has been updated successfully");
      } else {
        toast.success("User profile has been created successfully");
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
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        email: userData.email,
        status: userData.status,
      });
    } else if (open && !userData) {
      // If adding new role
      formik.setValues({
        fullName: "",
        phoneNumber: "",
        role: "",
        email: "",
        status: "active", // Reset to active for new users
      });
    }
  }, [open, userData]);

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
          {userData ? "Edit User" : "Add New User"}
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
            id="fullName"
            name="fullName"
            label="Full Name*"
            placeholder="Full Name"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />
          <CustomTextField
            fullWidth
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number*"
            placeholder="Enter 10-digit Phone Number"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            inputProps={{ maxLength: 10 }}
          />

          <CustomTextField
            fullWidth
            id="email"
            name="email"
            label="Email*"
            placeholder="abc@gmail.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <CustomTextField
            select
            fullWidth
            id="role"
            name="role"
            label="Select Role*"
            placeholder="Select Role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
          >
            <MenuItem value="superAdmin">Super Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="viewer">Viewer</MenuItem>
          </CustomTextField>

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

export default AddUserDrawer;
