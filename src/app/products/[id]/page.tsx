"use client"; 

import { useLoginContext } from "@/contexts/LoginContext";
import api from "@/utils/axios";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "../page"; 
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { SnackbarProvider, enqueueSnackbar } from 'notistack'; 

export default function Page({ params }: { params: { id: string } }) {
  const { isLoggedIn } = useLoginContext();

  // Redirection si l'utilisateur n'est pas connecté
  if (!isLoggedIn) {
    redirect("/login");
  }

  const router = useRouter();

  //  États pour stocker les infos du produit
  const [product, setProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [image, setImage] = useState<string | undefined>();
  const [changedImageUrl, setChangedImageUrl] = useState<string>(""); // URL modifiée par l'utilisateur

  //  Récupération des données du produit à l'ouverture de la page
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${params.id}`);
        if (response.status === 200) {
          setProduct(response.data); // On stocke les données récupérées
        }
      } catch {
        enqueueSnackbar("Erreur de chargement du produit", { variant: "error" });
      }
    };
    fetchProduct();
  }, [params.id]);

  //  Pré-remplissage du formulaire avec les données du produit
  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setCategory(product.category);
      setPrice(product.price);
      setImage(product.image);
      setDescription(product.description);
    }
  }, [product]);

  //  Mise à jour des informations du produit
  const handleUpdateProduct = async () => {
    const updatedProduct = {
      title,
      category,
      price,
      image: changedImageUrl || image, // On utilise l’image modifiée si elle existe
    };

    try {
      const response = await api.put(`/products/${params.id}`, updatedProduct);
      if (response.status === 200) {
        enqueueSnackbar("Produit mis à jour avec succès", { variant: "success" });
      }
    } catch {
      enqueueSnackbar("Erreur lors de la mise à jour du produit", { variant: "error" });
    }
  };

  return (
    <SnackbarProvider autoHideDuration={3000}>
      <Box sx={{ padding: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: 'center' }}>
          <Box sx={{ width: "50%" }}>
            <img src={image} alt="Product" style={{ height: "450px", objectFit: "contain" }} />
          </Box>

          <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 2, p: 3, justifyContent: "center" }}>
            
            <Box>
              <Typography variant="h6">Title</Typography>
              <TextField
                fullWidth
                value={title}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="h6">Category</Typography>
              <TextField
                fullWidth
                value={category}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCategory(event.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="h6">Price</Typography>
              <TextField
                type="number"
                fullWidth
                value={price}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPrice(Number(event.target.value))}
              />
            </Box>

            <Box>
              <Typography variant="h6">Description</Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="h6">Image URL</Typography>
              <TextField
                fullWidth
                value={changedImageUrl}
                onChange={(e) => setChangedImageUrl(e.target.value)}
                margin="normal"
              />
            </Box>

            <Box sx={{ display: "flex", width: "100%", flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button variant="contained" onClick={() => router.push("/products")}>
                ← Back
              </Button>
              <Button variant="contained" onClick={handleUpdateProduct}>
                UPDATE
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ marginY: 2 }} />
      </Box>
    </SnackbarProvider>
  );
}
