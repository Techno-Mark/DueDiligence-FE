"use client";

// React Imports
import { useEffect, useState } from "react";

// Next Imports
import { useRouter } from "next/navigation";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// Third-party Imports
import { OTPInput } from "input-otp";
import type { SlotProps } from "input-otp";
import classnames from "classnames";

// Component Imports
import Link from "@components/Link";
import Logo from "@components/layout/shared/Logo";

// Styled Component Imports
import AuthIllustrationWrapper from "@/libs/AuthIllustrationWrapper";

// Style Imports
import styles from "@/libs/styles/inputOtp.module.css";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

// Extend SlotProps to include hasError
type ExtendedSlotProps = SlotProps & {
  hasError?: boolean;
};

const Slot = (props: ExtendedSlotProps) => {
  return (
    <div
      className={classnames(styles.slot, {
        [styles.slotActive]: props.isActive,
        [styles.errorSlot]: props.hasError, // Apply red border if there is an error
      })}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
};

const FakeCaret = () => {
  return (
    <div className={styles.fakeCaret}>
      <div className="w-px h-5 bg-textPrimary" />
    </div>
  );
};

// Define FormData type with otp field
type FormData = {
  otp: string;
};

const TwoSteps = () => {
  // States
  const [otp, setOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError, // To set validation errors manually
    clearErrors, // Clear errors when the OTP becomes valid
  } = useForm<FormData>();

  useEffect(() => {
    const tempEmail = sessionStorage.getItem("tempEmail");
    if (!tempEmail) {
      toast.error("No email found. Please login again.");
      router.push("/login");
    } else {
      setEmail(tempEmail);
    }
  }, [router]);

  function maskEmail(email: string) {
    const [localPart, domainPart] = email.split("@");
    const maskedLocalPart =
      localPart.length > 1
        ? `${"*".repeat(localPart.length - 1)}${localPart[localPart.length - 1]}`
        : "*";
    return `${maskedLocalPart}@${domainPart}`;
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!otp || otp.length < 6) {
      // Manually set an error for OTP field if it's empty or incomplete
      setError("otp", {
        type: "manual",
        message: "Please enter a valid 6-digit code",
      });
      return;
    }

    setLoading(true);
    try {
      const email = sessionStorage.getItem("tempEmail"); // Retrieve the email from sessionStorage
      if (!email) {
        throw new Error("Email not found. Please try logging in again.");
      }

      const res = await signIn("credentials", {
        email: email,
        otp: otp,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else if (res?.ok) {
        sessionStorage.removeItem("tempEmail"); // Clear the temporary email
        toast.success("Login successful");
        router.push("/home");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      clearErrors("otp"); // Clear error when a valid OTP is entered
    }
  };

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
                <Typography variant="h4">Two Step Verification 💬</Typography>
                <Typography>
                  We sent a verification code to your mobile. Enter the code
                  from the mobile in the field below.
                </Typography>
                <Typography className="font-medium" color="text.primary">
                  {maskEmail(email)}
                </Typography>
              </div>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <Typography>Type your 6 digit security code</Typography>
                  <OTPInput
                    onChange={handleOtpChange}
                    value={otp ?? ""}
                    maxLength={6}
                    containerClassName="flex items-center"
                    render={({ slots }) => (
                      <div className="flex items-center justify-between w-full gap-4">
                        {slots.slice(0, 6).map((slot, idx) => (
                          <Slot key={idx} {...slot} hasError={!!errors.otp} />
                        ))}
                      </div>
                    )}
                  />
                  {errors.otp && (
                    <Typography color="error">{errors.otp.message}</Typography> // Show error message
                  )}
                </div>
                <Button fullWidth variant="contained" type="submit">
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <div className="flex justify-center items-center flex-wrap gap-2">
                  <Typography>Didn&#39;t get the code?</Typography>
                  <Typography
                    color="primary"
                    component={Link}
                    href="/"
                    onClick={(e) => e.preventDefault()}
                  >
                    Resend
                  </Typography>
                </div>
              </form>
            </CardContent>
          </Card>
        </AuthIllustrationWrapper>
      </div>
    </>
  );
};

export default TwoSteps;