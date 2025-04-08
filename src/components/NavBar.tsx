"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useLoginContext } from "@/contexts/LoginContext";
import { useRouter } from "next/navigation";
import ShopOutlinedIcon from '@mui/icons-material/ShopOutlined';

export default function NavBar() {
  const { isLoggedIn, user, logout } = useLoginContext();
  const router = useRouter();
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <ShopOutlinedIcon />
          </IconButton>

          {isLoggedIn ? (<Typography onClick={() => { router.push(`/products`) }} variant="h6" component="div" sx={{ flexGrow: 1,cursor:'pointer' }}>
            Product Store Management
          </Typography>) : (<Typography onClick={() => { router.push(`/`) }} variant="h6" component="div" sx={{ flexGrow: 1,cursor:'pointer' }}>
            Product Store
          </Typography>)}



          {isLoggedIn ? (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <AccountCircleOutlinedIcon />
                <Typography>
                  {user?.username}
                </Typography>
                <Button
                  color="inherit"
                  onClick={() => router.push(`/products/create`)}
                  sx={{ m: 1 }}
                >
                  ADD PRODUCT
                </Button>
                <Button color="inherit" onClick={() => logout()}>
                  Logout
                </Button>
              </Box>
            </Box>

          ) : (
            <Button
              color="inherit"
              onClick={() => router.push(`/login`)}
            >
              Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
