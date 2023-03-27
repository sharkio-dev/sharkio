import { CacheProvider, EmotionCache } from "@emotion/react";
import { Menu } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import createEmotionCache from "../config/createEmotionCache";
import theme from "../config/theme";
import styles from "./document.module.scss";
import "../styles/globals.css";
import { SideBar } from "@/components/sidebar";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={styles.appContainer}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => {
                  setDrawerOpen((prev) => !prev);
                }}
              >
                <Menu />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Tartigraid
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={styles.sideBarContainer}>
            {drawerOpen && <SideBar />}
            <div className={styles.contentContainer}>
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
