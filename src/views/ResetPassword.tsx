"use client";

// React Imports
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// Next Imports
import Link from "next/link";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

// Component Imports
import DirectionalIcon from "@components/DirectionalIcon";
import Logo from "@components/layout/shared/Logo";
import CustomTextField from "@core/components/mui/TextField";

// Styled Component Imports
import AuthIllustrationWrapper from "@/libs/AuthIllustrationWrapper";

// FormData Type for Form Inputs
type FormData = {
  newPassword: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  // States for toggling password visibility
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  // Password Visibility Handlers
  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setIsConfirmPasswordShown((show) => !show);

  // Password Validation
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Password data:", data);
  };

  const newPassword = watch("newPassword");

  return (
    <>
      <div className="flex flex-col justify-center items-center min-bs-[100dvh] p-6">
        <AuthIllustrationWrapper>
          <Card className="flex flex-col sm:is-[450px]">
            <CardContent className="sm:!p-12">
              <Link href={"/"} className="flex justify-center mbe-6">
                <Logo />
              </Link>
              <div className="flex flex-col gap-1 mbe-6">
                <Typography variant="h4">Reset Password 🔒</Typography>
                <Typography>
                  Your new password must be different from previously used
                  passwords
                </Typography>
              </div>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                {/* New Password Field */}
                <CustomTextField
                  autoFocus
                  fullWidth
                  label="New Password"
                  placeholder="············"
                  type={isPasswordShown ? "text" : "password"}
                  error={!!errors.newPassword}
                  helperText={
                    errors.newPassword ? errors.newPassword.message : ""
                  }
                  {...register("newPassword", {
                    required: "This field is required",
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <i
                            className={
                              isPasswordShown ? "tabler-eye-off" : "tabler-eye"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Confirm Password Field */}
                <CustomTextField
                  fullWidth
                  label="Confirm Password"
                  placeholder="············"
                  type={isConfirmPasswordShown ? "text" : "password"}
                  error={!!errors.confirmPassword}
                  helperText={
                    errors.confirmPassword ? errors.confirmPassword.message : ""
                  }
                  {...register("confirmPassword", {
                    required: "This field is required",
                    validate: (value) =>
                      value === newPassword ||
                      "Confirm password does not match the new password",
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowConfirmPassword}
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
                />

                <Button fullWidth variant="contained" type="submit">
                  Set New Password
                </Button>
                <Typography
                  className="flex justify-center items-center"
                  color="primary"
                >
                  <Link href={"/login"} className="flex items-center gap-1.5">
                    <DirectionalIcon
                      ltrIconClass="tabler-chevron-left"
                      rtlIconClass="tabler-chevron-right"
                      className="text-xl"
                    />
                    <span>Back to login</span>
                  </Link>
                </Typography>
              </form>
            </CardContent>
          </Card>
        </AuthIllustrationWrapper>
      </div>
    </>
  );
};

export default ResetPassword;
