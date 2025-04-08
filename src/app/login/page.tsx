import CustomLogin from "@/components/Login";
import { Box, TextField } from "@mui/material";

export default async function Login() {    
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CustomLogin />
      </Box>
    </div>
  );
}
