import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import SettingsInputSvideoRoundedIcon from "@mui/icons-material/SettingsInputSvideoRounded";
import GitHubIcon from "@mui/icons-material/GitHub";


export const sidebarLinks = [
  {
    id: 1,
    title: "Home",
    route: "/feed",
    icon: "HomeRoundedIcon",
  },
  {
    id: 2,
    title: "Communities",
    route: "/communities",
    icon: "GroupsRoundedIcon",
  },
  {
    id: 3,
    title: "Trending",
    route: "/trending",
    icon: "WhatshotRoundedIcon",
  },
  {
    id: 4,
    title: "Messages",
    route: "/messages",
    icon: "EmailRoundedIcon",
  },
  {
    id: 5,
    title: "Notifications",
    route: "/notifications",
    icon: "NotificationsRoundedIcon",
  },
];

export const sidebarSubLinks = [
  {
    id: 1,
    title: "Profile",
    route: "/profile",
    icon: "Person2RoundedIcon",
  },
  {
    id: 2,
    title: "Settings",
    route: "/settings",
    icon: "SettingsInputSvideoRoundedIcon",
  },
  {
    id: 3,
    title: "Contribute",
    route: "https://github.com/realemmanuel/clutch",
    icon: "GitHubIcon",
  },
];

type IconType = React.ElementType;

export const iconComponents: { [key: string]: IconType } = {
  HomeRoundedIcon,
  GroupsRoundedIcon,
  WhatshotRoundedIcon,
  EmailRoundedIcon,
  NotificationsRoundedIcon,
};

export const subIconComponents: { [key: string]: IconType } = {
  Person2RoundedIcon,
  SettingsInputSvideoRoundedIcon,
  GitHubIcon,
};