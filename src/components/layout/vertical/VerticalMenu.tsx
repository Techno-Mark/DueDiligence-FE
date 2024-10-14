"use client";

import { useSession } from "next-auth/react"; // Import useSession

// MUI Imports
import { useTheme } from "@mui/material/styles";

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// Type Imports
import type { VerticalMenuContextProps } from "@menu/components/vertical-menu/Menu";

// Component Imports
import { Menu, MenuItem, SubMenu } from "@menu/vertical-menu";

// Hook Imports
import { useSettings } from "@core/hooks/useSettings";
import useVerticalNav from "@menu/hooks/useVerticalNav";

// Styled Component Imports
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon";

// Style Imports
import menuItemStyles from "@core/styles/vertical/menuItemStyles";
import menuSectionStyles from "@core/styles/vertical/menuSectionStyles";

type RenderExpandIconProps = {
  open?: boolean;
  transitionDuration?: VerticalMenuContextProps["transitionDuration"];
};

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void;
};

const RenderExpandIcon = ({
  open,
  transitionDuration,
}: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon
    open={open}
    transitionDuration={transitionDuration}
  >
    <i className="tabler-chevron-right" />
  </StyledVerticalNavExpandIcon>
);

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme();
  const verticalNavOptions = useVerticalNav();
  const { settings } = useSettings();
  const { isBreakpointReached } = useVerticalNav();

  // Get session data
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  // Vars
  const { transitionDuration } = verticalNavOptions;

  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar;

  return (
    // eslint-disable-next-line lines-around-comment
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: "bs-full overflow-y-auto overflow-x-hidden",
            onScroll: (container) => scrollMenu(container, false),
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container) => scrollMenu(container, true),
          })}
    >
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon
            open={open}
            transitionDuration={transitionDuration}
          />
        )}
        renderExpandedMenuItemIcon={{
          icon: <i className="tabler-circle text-xs" />,
        }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem
          href="/dashboard"
          icon={<i className="tabler-clipboard-data" />}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          href="/document"
          icon={<i className="tabler-clipboard-data" />}
        >
          Document Management
        </MenuItem>
        <MenuItem
          href="/company"
          icon={<i className="tabler-clipboard-data" />}
        >
          Company Management
        </MenuItem>
        <MenuItem
          href="/user"
          icon={<i className="tabler-clipboard-data" />}
        >
          User Management
        </MenuItem>
        {userRole !== "client" && (
          <MenuItem
            href={`/apps/settings`}
            icon={<i className="tabler-user-cog"></i>}
          >
            Settings
          </MenuItem>
        )}
      </Menu>
    </ScrollWrapper>
  );
};

export default VerticalMenu;
