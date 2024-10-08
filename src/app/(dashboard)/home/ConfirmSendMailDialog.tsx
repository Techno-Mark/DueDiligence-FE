import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { post } from "@/services/apiService";
import { brandList } from "@/services/endpoint/brandList";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import { useState } from "react";

type ConfirmationDialogProps = {
  sendingBrandId: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  setsendingBrandId: React.Dispatch<React.SetStateAction<number>>;
};

const ConfirmSendMailDialog = ({
  sendingBrandId,
  open,
  setOpen,
  setsendingBrandId,
}: ConfirmationDialogProps) => {
  const [loading, setLoading] = useState(false);
  const sendVerificationMail = async () => {
    try {
      setLoading(true);
      const result = await post(brandList.sendVerificationEmail, {
        brandId: sendingBrandId,
      });
      if (result.ResponseStatus === "success") {
        toast.success(result.Message);
      } else {
        toast.error(result.Message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setsendingBrandId(-1);
      setOpen(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={() => setOpen(false)}>
      <LoadingBackdrop isLoading={loading} />
      <DialogContent className="flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16">
        <i className="tabler-alert-circle text-[88px] mbe-6 text-warning" />
        <Typography variant="h5">
          Are you sure you want to send Verification email ?
        </Typography>
      </DialogContent>
      <DialogActions className="justify-center pbs-0 sm:pbe-16 sm:pli-16">
        <Button
          variant="contained"
          onClick={() => {
            sendVerificationMail();
          }}
        >
          Yes
        </Button>
        <Button
          variant="tonal"
          color="secondary"
          onClick={() => {
            setOpen(false);
          }}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmSendMailDialog;
