"use client";
import { useLoginContext } from "@/contexts/LoginContext";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography
} from "@mui/material";
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { Product } from "../../page";

//  Composant pour afficher les détails d’un produit à partir de son ID
export default function Page({ params }: { params: { id: string } }) {
  const { isLoggedIn } = useLoginContext();
  const [product, setProduct] = useState<Product | null>(null); 
  const router = useRouter();

  //  Récupération des données du produit à l'affichage du composant
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${params.id}`);
        if (response.status === 200) {
          setProduct(response.data); // 
        }
      } catch {
        enqueueSnackbar("Erreur de chargement du produit", { variant: "error" });
      }
    };
    fetchProduct();
  }, [params.id]);

  return (
    <SnackbarProvider autoHideDuration={3000}>
      <Box sx={{ padding: 4 }}>
        {product && (
          <Card sx={{ display: "flex", maxWidth: 900, margin: "auto", p: 3 }}>
            
            <CardMedia
              component="img"
              image={product.image}
              alt="Product"
              sx={{ width: 300, objectFit: "contain" }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                {product.title}
              </Typography>

              <Typography variant="body1" color="textSecondary" paragraph>
                <strong>Category:</strong> {product.category}
              </Typography>

              <Typography variant="body1" color="textSecondary" paragraph>
                <strong>Price:</strong> ${product.price}
              </Typography>

              <Typography variant="body1" color="textSecondary" paragraph>
                <strong>Description:</strong> {product.description}
              </Typography>

              <Typography variant="body1" color="textSecondary">
                <strong>⭐ Rating:</strong> {product.rating.rate} ({product.rating.count} Review)
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
                <Button variant="contained" onClick={() => router.push("/")}>
                  ← Back
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        <Divider sx={{ marginY: 2 }} />
      </Box>
    </SnackbarProvider>
  );
}
