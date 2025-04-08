"use client";

import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLoginContext } from "@/contexts/LoginContext";
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { redirect } from "next/navigation";

function CustomLogin() {
  const { isLoggedIn } = useLoginContext();

  if (isLoggedIn) {
    redirect("/products");
  }
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Ajout d'un état d'erreur
  const { login ,loginError } = useLoginContext();

  const handleLogin = () => {
    if (!username || !password) {
      setError("All fields must be filled! !");
      return; // Arrêter l'exécution si les champs sont vides
    }
    // Si les champs sont remplis, réinitialiser l'erreur et tenter de se connecter
    setError(null);
    login(username, password);
    
  };

  return (
    <SnackbarProvider>
      <Box
        sx={{
          display: "flex",
          width: "auto",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Typography variant="h5">Sign in</Typography>

          {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}  
          {loginError && (
          <Typography color="error" variant="body2">
            {loginError}
          </Typography>
        )}


        <TextField
          required
          id="outlined-required"
          label="Username"
          value={username}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUsername(event.target.value);
          }}
        />
        <TextField
          required
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
          }}
        />
        <Divider sx={{ width: "100%" }} />
        <Button variant="contained" onClick={handleLogin}>
          Sign in
        </Button>
      </Box>
    </SnackbarProvider>
  );
}

export default CustomLogin;
