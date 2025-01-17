import {
  Anchor,
  Box,
  Button,
  ColorScheme,
  ColorSchemeProvider,
  createStyles,
  Group,
  MantineProvider
} from "@mantine/core";
import { useColorScheme, useHotkeys, useLocalStorage } from "@mantine/hooks";
import { Menu, Divider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import {
  ExitIcon,
  PersonIcon,
  HamburgerMenuIcon,
  GearIcon,
  MixIcon,
  EnterIcon,
  PlusIcon,
  FaceIcon,
  HomeIcon
} from "@radix-ui/react-icons";
import { FunctionComponent, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { LoginPage } from "./components/pages/LoginPage";
import { MainPage } from "./components/pages/MainPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { RegistrationPage } from "./components/pages/RegistrationPage";
import useAuthentication from "./hooks/UseAuthentication";
import "./config";
import { FriendPage } from "./components/pages/FriendPage";
import { ExtensionsPage } from "./components/pages/ExtensionsPage";
import ThemeToggle from "./components/ThemeToggle";
import { NotFoundPage } from "./components/NotFoundPage";
import { Footer } from "./components/Footer";
import { LeaderboardsPage } from "./components/pages/LeaderboardsPage";
import { ModalsProvider } from "@mantine/modals";
import { BarChart2 } from "react-feather";

const useStyles = createStyles(theme => ({
  container: {
    maxWidth: "calc(800px + 10%)",
    width: "100%",
    minHeight: "100%",
    alignContent: "flex-start",
    paddingBottom: 100
  },
  innerContainer: {
    minHeight: "100%",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%"
  },
  testaustimeTitle: {
    paddingTop: 4,
    fontFamily: "Poppins, sans-serif",
    background: "linear-gradient(51deg, rgba(60,112,157,1) 0%, rgba(34,65,108,1) 100%)",
    fontSize: "2.5rem",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
    textDecoration: "none",
    "@media (max-width: 450px)": {
      width: "60%",
      fontSize: "8vw"
    }
  },
  profileButton: {
    display: "flex"
  },
  navigation: {
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      display: "none"
    }
  },
  smallNavigation: {
    display: "none",
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      display: "flex"
    },
    "@media (max-width: 450px)": {
      width: "39%"
    }
  },
  spacer: {
    width: "10px",
    height: "1px",
    backgroundColor: theme.colorScheme === "dark" ? "#bbb" : "#333"
  },
  menu: {
    border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.gray[1]}`
  }
}));

const PrivateRoute: FunctionComponent = ({ children }) => {
  const { isLoggedOut } = useAuthentication();
  if (isLoggedOut) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppSetup = () => {
  const { logOut, refetchUsername } = useAuthentication();
  const navigate = useNavigate();

  // Save colorScheme to localStorage and the default value is the preferred colorScheme
  const preferredColorScheme = useColorScheme();

  const [savedColorScheme, setColorScheme] = useLocalStorage<
    ColorScheme | "none"
  >({
    key: "testaustime-color-scheme",
    defaultValue: "none"
  });

  const colorScheme =
    savedColorScheme === "none" ? preferredColorScheme : savedColorScheme;

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  useEffect(() => {
    refetchUsername().catch(e => console.error(e));
  }, []);

  const logOutAndRedirect = () => {
    logOut();
    navigate("/");
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        theme={{
          colorScheme: colorScheme,
          fontFamily: "Ubuntu, sans-serif",
          white: "#eee",
          black: "#121212",
          colors: {
            blue: [
              "#1D357F",
              "#28408A",
              "#667bc4",
              "#3D55A0",
              "#5084cc",
              "#536AB7",
              "#5E74C2",
              "#667bc4",
              "#6275bc",
              "#7E94E3"
            ]
          },
          headings: {
            fontFamily: "Poppins, sans-serif",
            fontWeight: 800,
            sizes: {
              h1: { fontSize: "1.9rem" },
              h2: { fontSize: "1.65rem" },
              h3: { fontSize: "1.4rem" }
            }
          },
          breakpoints: {
            md: 860
          }
        }}
      >
        <NotificationsProvider>
          <ModalsProvider>
            <App
              logOutAndRedirect={logOutAndRedirect}
              toggleColorScheme={toggleColorScheme}
            />
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

interface AppProps {
  logOutAndRedirect: () => void,
  toggleColorScheme: (value?: ColorScheme) => void
}

const App = ({ logOutAndRedirect, toggleColorScheme }: AppProps) => {
  const { isLoggedIn, username } = useAuthentication();
  const { classes } = useStyles();

  return <Group position="center" mt={40} sx={{ overflow: "hidden" }} className={classes.container}>
    <div className={classes.innerContainer}>
      <Group position="apart" mb={50}>
        <Link to="/" className={classes.testaustimeTitle}>
          Testaustime
        </Link>
        <Group>
          <Group spacing={15} align="center" className={classes.navigation}>
            <Group>
              {isLoggedIn ? <>
                <Anchor component={Link} to="/">Dashboard</Anchor>
                <Anchor component={Link} to="/friends">Friends</Anchor>
                <Anchor component={Link} to="/leaderboards">Leaderboards</Anchor>
                <Menu
                  trigger="hover"
                  control={<Button
                    variant="outline"
                    size="xs"
                    leftIcon={<PersonIcon style={{ marginRight: "5px" }} />}
                  >
                    {username}
                  </Button>}
                >
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item component={Link} to="/profile" icon={<GearIcon />}>Settings</Menu.Item>
                  <Divider />
                  <Menu.Item component={Link} to="/extensions" icon={<MixIcon />}>Extensions</Menu.Item>
                  <Divider />
                  <Menu.Item
                    color="blue"
                    icon={<ExitIcon />}
                    onClick={logOutAndRedirect}>
                    Log out
                  </Menu.Item>
                </Menu>
              </> : <>
                <Anchor component={Link} to="/extensions">Extensions</Anchor>
                <Box className={classes.spacer} />
                <Anchor component={Link} to="/login">Login</Anchor>
                <Button component={Link} to="/register">Register</Button>
              </>}
            </Group>
            <ThemeToggle label={false} />
          </Group>
          <Group className={classes.smallNavigation}>
            <Menu
              trigger="hover"
              control={<Button variant="outline" size="lg">
                <HamburgerMenuIcon markerHeight={27} />
              </Button>}
            >
              <div
                style={{ padding: "10px" }}
                onClick={() => { toggleColorScheme(); }}>
                <ThemeToggle label={true} />
              </div>
              {isLoggedIn ?
                <>
                  <Divider />
                  <Menu.Item component={Link} to="/" icon={<HomeIcon />}>Dashboard</Menu.Item>
                  <Menu.Item component={Link} to="/friends" icon={<FaceIcon />}>Friends</Menu.Item>
                  <Menu.Item component={Link} to="/leaderboards" icon={<BarChart2 size={18} />}>Leaderboards</Menu.Item>
                  <Divider />
                  <Menu.Label>Account - {username}</Menu.Label>
                  <Menu.Item component={Link} to="/profile" icon={<GearIcon />}>Settings</Menu.Item>
                  <Divider />
                  <Menu.Item component={Link} to="/extensions" icon={<MixIcon />}>Extensions</Menu.Item>
                  <Divider />
                  <Menu.Item
                    color="blue"
                    icon={<ExitIcon />}
                    onClick={logOutAndRedirect}>
                    Log out
                  </Menu.Item>
                </>
                :
                <>
                  <Divider />
                  <Menu.Item component={Link} to="/profile" icon={<EnterIcon />}>Login</Menu.Item>
                  <Menu.Item color="blue" component={Link} to="/settings" icon={<PlusIcon />}>Register</Menu.Item>
                  <Divider />
                  <Menu.Item component={Link} to="/extensions" icon={<MixIcon />}>Extensions</Menu.Item>
                </>}
            </Menu>
          </Group>
        </Group>
      </Group>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/profile"
          element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route
          path="/friends"
          element={<PrivateRoute><FriendPage /></PrivateRoute>} />
        <Route
          path="/leaderboards"
          element={<PrivateRoute><LeaderboardsPage /></PrivateRoute>} />
        <Route path="/extensions" element={<ExtensionsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  </Group>;
};
