import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { investorList } from "@/services/endpoint/investorList";
import { toast } from "react-toastify";
import { post } from "@/services/apiService";
import CustomTextField from "@/@core/components/mui/TextField";
import { MenuItem } from "@mui/material";
import { useState } from "react";
import { boolean } from "valibot";

type ConfirmationDialogProps = {
  statusUpdatingId: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  setStatusUpdatingId: React.Dispatch<React.SetStateAction<number>>;
  statusValue: boolean;
};

const ConfirmUpdateStatus = ({
  statusUpdatingId,
  open,
  setOpen,
  setStatusUpdatingId,
  statusValue,
}: ConfirmationDialogProps) => {
  const [status, setStatus] = useState("true");

  const deleteContentBlock = async () => {
    try {
      const result = await post(investorList.updateStatus, {
        investorId: statusUpdatingId,
        status: !statusValue,
      });
      if (result.ResponseStatus === "success") {
        toast.success(result.Message);
      } else {
        toast.error(result.Message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setStatusUpdatingId(-1);
      setOpen(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={() => setOpen(false)}>
      <DialogContent className="flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16">
        <Typography variant="h5" className="py-4">
          Are you sure you want to{" "}
          <b>{`${statusValue ? "Inactive" : "Active"}`}</b> this Investor ?
        </Typography>
      </DialogContent>
      <DialogActions className="justify-center pbs-0 sm:pbe-16 sm:pli-16">
        <Button variant="contained" onClick={deleteContentBlock}>
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

export default ConfirmUpdateStatus;
