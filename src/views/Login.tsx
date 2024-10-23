"use client";

// React Imports
import { useState } from "react";

// Next Imports
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// MUI Imports
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

// Third-party Imports
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import type { SubmitHandler } from "react-hook-form";
import classnames from "classnames";
import * as yup from "yup";

// Type Imports
import type { SystemMode } from "@core/types";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";

// Hook Imports
import { useImageVariant } from "@core/hooks/useImageVariant";
import { useSettings } from "@core/hooks/useSettings";
import { signIn } from "next-auth/react";

// Third-party Imports
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import type { CircularProgressProps } from "@mui/material/CircularProgress";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import CustomLogo from "@/@core/svg/CustomLogo";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";

// Styled Custom Components
const LoginIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  blockSize: "auto",
  maxBlockSize: 680,
  maxInlineSize: "100%",
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550,
  },
  [theme.breakpoints.down("lg")]: {
    maxBlockSize: 450,
  },
}));

const CircularProgressDeterminate = styled(
  CircularProgress
)<CircularProgressProps>({
  color: "var(--mui-palette-customColors-trackBg)",
});

const CircularProgressIndeterminate = styled(
  CircularProgress
)<CircularProgressProps>(({ theme }) => ({
  left: 0,
  position: "absolute",
  animationDuration: "440ms",
  color: theme.palette.mode === "light" ? "#ffffff" : "#30d41a",
}));

const MaskImg = styled("img")({
  blockSize: "auto",
  maxBlockSize: 355,
  inlineSize: "100%",
  position: "absolute",
  insetBlockEnd: 0,
  zIndex: -1,
});

type ErrorType = {
  message: string[];
};

type FormData = {
  email?: string;
  password: string;
  phoneNumber?: string;
  method: "email" | "phoneNumber";
};

const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  email: yup.string().when("method", {
    is: "email",
    then: (schema) =>
      schema.required("Email is required").email("Email is invalid"),
    otherwise: (schema) => schema.notRequired(),
  }),
  phoneNumber: yup.string().when("method", {
    is: "phoneNumber",
    then: (schema) =>
      schema
        .required("Phone number is required")
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    otherwise: (schema) => schema.notRequired(),
  }),
  password: yup.string().required("Password is required"),
  method: yup
    .string()
    .oneOf(["email", "phoneNumber"])
    .required("Method is required"), 
});

const Login = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [errorState, setErrorState] = useState<ErrorType | null>(null);

  const [loading, setLoading] = useState(false);

  // Vars
  const darkImg = "/images/pages/auth-mask-dark.png";
  const lightImg = "/images/pages/auth-mask-light.png";
  const darkIllustration = "/images/illustrations/auth/v2-login-dark.png";
  const lightIllustration = "/images/illustrations/auth/v2-login-light.svg";
  const borderedDarkIllustration =
    "/images/illustrations/auth/v2-login-dark-border.png";
  const borderedLightIllustration =
    "/images/illustrations/auth/v2-login-light-border.png";

  // Hooks
  const router = useRouter();
  const { settings } = useSettings();
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const authBackground = useImageVariant(mode, lightImg, darkImg);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      phoneNumber: "",
      method: "email",
    },
    mode: "onChange",
  });
  const method = watch("method");

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  );

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);

  // const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
  //   setLoading(true);
  //   const res = await signIn("credentials", {
  //     email: data.email,
  //     password: data.password,
  //     redirect: false,
  //   });

  //   if (res && res.ok && res.error === null) {
  //     const redirectURL = searchParams.get("redirectTo") ?? "/home";
  //     router.push(redirectURL);
  //     toast.success("Login Successfull");
  //     setLoading(false);
  //   } else {
  //     setLoading(false);
  //     if (res?.error) {
  //       let error;
  //       try {
  //         error = JSON.parse(res.error);
  //       } catch {
  //         error = { message: res.error };
  //       }
  //       if (error.status === "failure") {
  //         toast.error(error.message);
  //       } else {
  //         toast.error(error.message);
  //         setErrorState(error);
  //       }
  //     }
  //   }
  // };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      if (data.method === "email") {
        const email = data.email;
        const password = data.password;

        if (!email || !password) {
          toast.error("Email and Password are required");
          return;
        }

        const res = await signIn("credentials", {
          email: email,
          password: password,
          redirect: false,
        });

        if (res?.error) {
          toast.error(res.error);
        } else if (res?.ok) {
          toast.success("Login Successful");
          router.push("/home");
        }
      } else if (data.method === "phoneNumber") {
        const phoneNumber = data.phoneNumber;

        if (!phoneNumber) {
          toast.error("Phone number is required");
          return;
        }

        const res = await signIn("credentials", {
          phoneNumber: phoneNumber,
          password: data.password,
          redirect: false,
        });

        if (res?.error) {
          toast.error(res.error);
        } else if (res?.ok) {
          sessionStorage.setItem("tempPhoneNumber", phoneNumber);
          toast.success("OTP sent to your phone");
          router.push("/otp");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingBackdrop isLoading={loading} />
      <div className="flex bs-full justify-center">
        <div
          className={classnames(
            "flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden",
            {
              "border-ie": settings.skin === "bordered",
            }
          )}
        >
          <LoginIllustration
            src={characterIllustration}
            alt="character-illustration"
          />
          {!hidden && <MaskImg alt="mask" src={authBackground} />}
        </div>
        <div className="flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]">
          <div className="absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]">
            <CustomLogo collapsed={false} />
          </div>
          <div className="flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0">
            <div className="flex flex-col gap-1">
              <Typography variant="h4">{`Welcome to Due Diligence!`}</Typography>
              <Typography>Please sign-in to your account</Typography>
            </div>

            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <Controller
                name="method"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    row
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    aria-label="Login Method"
                    name="login-method"
                  >
                    <FormControlLabel
                      value="email"
                      control={<Radio />}
                      label="Email"
                    />
                    <FormControlLabel
                      value="phoneNumber"
                      control={<Radio />}
                      label="Phone Number"
                    />
                  </RadioGroup>
                )}
              />
              {method === "email" && (
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      autoFocus
                      fullWidth
                      type="email"
                      label="Email"
                      placeholder="Enter your email"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        errorState !== null && setErrorState(null);
                      }}
                    />
                  )}
                />
              )}

              {method === "phoneNumber" && (
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      type="tel"
                      inputProps={{ maxLength: 10 }}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        errorState !== null && setErrorState(null);
                      }}
                      {...(errors.phoneNumber && {
                        error: true,
                        helperText: errors.phoneNumber.message,
                      })}
                    />
                  )}
                />
              )}

              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Password"
                    placeholder="············"
                    id="login-password"
                    type={isPasswordShown ? "text" : "password"}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      errorState !== null && setErrorState(null);
                    }}
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
                                isPasswordShown
                                  ? "tabler-eye"
                                  : "tabler-eye-off"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    {...(errors.password && {
                      error: true,
                      helperText: errors.password.message,
                    })}
                  />
                )}
              />
              <div className="flex justify-between items-center gap-x-3 gap-y-1 flex-wrap">
                <Typography
                  className="text-end"
                  color="primary"
                  component={Link}
                  href={"/forgot-password"}
                >
                  Forgot password?
                </Typography>
              </div>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className=" relative mr-2 my-auto">
                      <div className="flex justify-center items-center">
                        <CircularProgressDeterminate
                          variant="determinate"
                          size={20}
                          thickness={4}
                          value={100}
                        />
                        <CircularProgressIndeterminate
                          variant="indeterminate"
                          disableShrink
                          size={20}
                          thickness={6}
                        />
                      </div>
                    </div>{" "}
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
