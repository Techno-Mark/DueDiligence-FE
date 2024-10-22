"use client";

// React Imports
import { useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// React Hook Form & Yup Imports
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";

// Validation Schema using yup
const schema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "New password must be at least 8 characters long")
    .required("New password is required"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), ""], "Passwords must match") // Removed null
    .required("Confirm new password is required"),
});

const ChangePasswordCard = () => {
  // States for password visibility
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false);
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);

  const handleClickShowCurrentPassword = () => {
    setIsCurrentPasswordShown(!isCurrentPasswordShown);
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema), // Attach validation schema
  });

  // Submit handler
  const onSubmit = (data: any) => {
    console.log("Form Data", data);
    // Add your save logic here
  };

  return (
    <Card>
      <CardHeader title="Change Password" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Current Password"
                type={isCurrentPasswordShown ? "text" : "password"}
                placeholder="············"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleClickShowCurrentPassword}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <i
                          className={
                            isCurrentPasswordShown
                              ? "tabler-eye-off"
                              : "tabler-eye"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword?.message}
                {...register("currentPassword")}
              />
            </Grid>
          </Grid>
          <Grid container className="mbs-0" spacing={6}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="New Password"
                type={isNewPasswordShown ? "text" : "password"}
                placeholder="············"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() =>
                          setIsNewPasswordShown(!isNewPasswordShown)
                        }
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <i
                          className={
                            isNewPasswordShown ? "tabler-eye-off" : "tabler-eye"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                {...register("newPassword")} // Register field
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Confirm New Password"
                type={isConfirmPasswordShown ? "text" : "password"}
                placeholder="············"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() =>
                          setIsConfirmPasswordShown(!isConfirmPasswordShown)
                        }
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <i
                          className={
                            isConfirmPasswordShown
                              ? "tabler-eye-off"
                              : "tabler-eye"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.confirmNewPassword}
                helperText={errors.confirmNewPassword?.message}
                {...register("confirmNewPassword")} // Register field
              />
            </Grid>

            <Grid item xs={12} className="flex gap-4">
              <Button type="submit" variant="contained">Save Changes</Button>
              <Button
                variant="tonal"
                type="reset"
                color="secondary"
                onClick={() => reset()}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordCard;
