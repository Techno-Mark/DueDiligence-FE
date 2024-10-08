"use client";

// React Imports
import { useRef, useState } from "react";
import type { MouseEvent } from "react";

// Next Imports
import { useParams, useRouter } from "next/navigation";

// MUI Imports
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

// Third-party Imports
import { signOut, useSession } from "next-auth/react";

// Hook Imports
import { useSettings } from "@core/hooks/useSettings";

// Styled component for badge content
const BadgeContentSpan = styled("span")({
  width: 8,
  height: 8,
  borderRadius: "50%",
  cursor: "pointer",
  backgroundColor: "var(--mui-palette-success-main)",
  boxShadow: "0 0 0 2px var(--mui-palette-background-paper)",
});

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false);

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null);

  // Hooks
  const router = useRouter();
  const { data: session } = useSession();
  const { settings } = useSettings();
  const { lang: locale } = useParams();

  const userName = session?.user?.name || "Admin";
  const userEmail = session?.user?.email || "Please wait";
  const avatarText = userName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false);
  };

  const handleDropdownClose = (
    event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent),
    url?: string
  ) => {
    if (url) {
      router.push(url);
    }

    if (
      anchorRef.current &&
      anchorRef.current.contains(event?.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleUserLogout = async () => {
    try {
      await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap="circular"
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        className="mis-2"
      >
        <div className="flex items-center pli-6" tabIndex={-1}>
          <div className="flex items-start flex-col">
            <Typography variant="caption">{userEmail}</Typography>
          </div>
        </div>
        <Avatar
          ref={anchorRef}
          alt={userName}
          onClick={handleDropdownOpen}
          className="cursor-pointer bs-[38px] is-[38px]"
        >
          {avatarText}
        </Avatar>
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement="bottom-end"
        anchorEl={anchorRef.current}
        className="min-is-[240px] !mbs-3 z-[1]"
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-end" ? "right top" : "left top",
            }}
          >
            <Paper
              className={
                settings.skin === "bordered"
                  ? "border shadow-none"
                  : "shadow-lg"
              }
            >
              <ClickAwayListener
                onClickAway={(e) =>
                  handleDropdownClose(e as MouseEvent | TouchEvent)
                }
              >
                <MenuList>
                  <div
                    className="flex items-center plb-2 pli-6 gap-2"
                    tabIndex={-1}
                  >
                    <Avatar
                      alt={session?.user?.name || ""}
                      src={session?.user?.image || ""}
                    />
                    <div className="flex items-start flex-col">
                      <Typography className="font-medium" color="text.primary">
                        {session?.user?.name || ""}
                      </Typography>
                      <Typography variant="caption">
                        {userName || ""}
                      </Typography>
                    </div>
                  </div>
                  <Divider className="mlb-1" />
                  <div className="flex items-center plb-2 pli-3">
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      size="small"
                      endIcon={<i className="tabler-logout" />}
                      onClick={handleUserLogout}
                      sx={{
                        "& .MuiButton-endIcon": { marginInlineStart: 1.5 },
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default UserDropdown;