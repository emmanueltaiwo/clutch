import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import SettingsInputSvideoRoundedIcon from "@mui/icons-material/SettingsInputSvideoRounded";
import GitHubIcon from "@mui/icons-material/GitHub";

const PROJECT_NAME = "Clutch";
const DOMAIN_NAME = "https://clutchapp.vercel.app";
const BASE_WEBSITE_URL = "https://clutch.com.ng/";
const BASE_GITHUB_URL = "https://github.com/realemmanuel";
const BASE_GITHUB_PROJECT_URL = BASE_GITHUB_URL + "/clutch";

const FEATURES = [
  {
    id: 1,
    title: "Robust Community Building",
    description:
      "Foster vibrant communities by easily creating and joining groups based on shared interests, hobbies, or goals.",
  },
  {
    id: 2,
    title: "Quality Connections",
    description:
      "Emphasize meaningful interactions as our platform prioritizes quality connections over quantity, ensuring a positive and engaging experience.",
  },
  {
    id: 3,
    title: "Real-time Updates",
    description:
      "Stay in the loop with our real-time update system, providing instant notifications and dynamic content for an up-to-the-minute social experience.",
  },
  {
    id: 4,
    title: "Personalized User Profiles",
    description:
      "Express yourself and connect with others through customizable user profiles, showcasing your interests, achievements, and contributions.",
  },
  {
    id: 5,
    title: "Seamless Multimedia Sharing",
    description:
      "Share your experiences effortlessly with our multimedia features, including photo and video uploads, making your content visually engaging.",
  },
  {
    id: 6,
    title: "Secure and Accessible",
    description:
      "Enjoy peace of mind with our robust security measures while ensuring accessibility for all users, creating an inclusive online environment.",
  },
];

const GENDER = [
  {
    id: 1,
    name: "Male",
  },
  {
    id: 2,
    name: "Female",
  },
  {
    id: 3,
    name: "Others",
  },
];

const COUNTRIES = [
  {
    id: 1,
    name: "Nigeria",
  },
  {
    id: 2,
    name: "United States",
  },
  {
    id: 3,
    name: "United Kingdom",
  },
  {
    id: 4,
    name: "Canada",
  },
  {
    id: 5,
    name: "India",
  },
  {
    id: 6,
    name: "Australia",
  },
  {
    id: 7,
    name: "Brazil",
  },
  {
    id: 8,
    name: "China",
  },
  {
    id: 9,
    name: "South Africa",
  },
  {
    id: 10,
    name: "France",
  },
  // Add more countries as needed
];

const INTERESTS = [
  {
    id: 1,
    name: "Tech",
  },
  {
    id: 2,
    name: "Travel",
  },
  {
    id: 3,
    name: "Food",
  },
  {
    id: 4,
    name: "Sports",
  },
  {
    id: 5,
    name: "Music",
  },
  {
    id: 6,
    name: "Art",
  },
  {
    id: 7,
    name: "Reading",
  },
  {
    id: 8,
    name: "Fitness",
  },
  {
    id: 9,
    name: "Gaming",
  },
  {
    id: 10,
    name: "Photography",
  },
  // Add more interests as needed
];

const SIDEBAR_LINKS = [
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

const SIDEBAR_SUB_LINKS = [
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

const iconComponents: { [key: string]: IconType } = {
  HomeRoundedIcon,
  GroupsRoundedIcon,
  WhatshotRoundedIcon,
  EmailRoundedIcon,
  NotificationsRoundedIcon,
};

const subIconComponents: { [key: string]: IconType } = {
  Person2RoundedIcon,
  SettingsInputSvideoRoundedIcon,
  GitHubIcon,
};

const COMMUNITY_TYPES = [
  {
    id: 1,
    name: "Technology",
    value: "technology",
  },
  {
    id: 2,
    name: "Art",
    value: "art",
  },
  {
    id: 3,
    name: "Science",
    value: "science",
  },
  {
    id: 4,
    name: "Music",
    value: "music",
  },
  {
    id: 5,
    name: "Health",
    value: "health",
  },
  {
    id: 6,
    name: "Sports",
    value: "sports",
  },
  {
    id: 7,
    name: "Fashion",
    value: "fashion",
  },
  {
    id: 8,
    name: "Food",
    value: "food",
  },
  {
    id: 9,
    name: "Travel",
    value: "travel",
  },
  {
    id: 10,
    name: "Photography",
    value: "photography",
  },
];


export {
  FEATURES,
  GENDER,
  COUNTRIES,
  INTERESTS,
  SIDEBAR_LINKS,
  SIDEBAR_SUB_LINKS,
  subIconComponents,
  iconComponents,
  PROJECT_NAME,
  DOMAIN_NAME,
  BASE_WEBSITE_URL,
  BASE_GITHUB_URL,
  BASE_GITHUB_PROJECT_URL,
  COMMUNITY_TYPES
};
