"use client"; 

import { Box, Button, Divider, TextField, Typography, Container } from "@mui/material";
import { enqueueSnackbar, SnackbarProvider } from "notistack"; 
import React, { useState } from "react";
import api from "@/utils/axios"; 
import { redirect, useRouter } from "next/navigation"; 
import { useLoginContext } from "@/contexts/LoginContext"; 

function CreateProduct() {
    const { isLoggedIn } = useLoginContext(); // Vérifie si l'utilisateur est connecté

    //  Redirige l'utilisateur vers la page de login s'il n'est pas connecté
    if (!isLoggedIn) {
        redirect("/login");
    }

    const router = useRouter();

    // États pour stocker les valeurs des champs du formulaire
    const [title, setTitle] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<number | string>("");
    const [image, setImage] = useState<string | undefined>("");

    //  Fonction appelée lors du clic sur "Ajouter le Produit"
    const handleAdd = async () => {
        //  Vérifie que tous les champs sont remplis
        if (!title || !category || !description || !price || !image) {
            enqueueSnackbar("Tous les champs doivent être remplis", { variant: "error" });
            return;
        }

        // Objet produit à envoyer à l’API
        const product = {
            title: title,
            category: category,
            description: description,
            price: parseFloat(price.toString()), 
            image: image,
        };

        try {
            const response = await api.post("/products", product); 

            if (response.status === 200) {
                enqueueSnackbar("Produit ajouté avec succès", { variant: "success" });
                
                // Réinitialisation des champs après ajout
                setTitle("");
                setCategory("");
                setDescription("");
                setPrice("");
                setImage("");

                // Redirection vers la page des produits
                router.replace("/products");
            } else {
                enqueueSnackbar("Erreur lors de l'ajout du produit", { variant: "error" });
            }
        } catch (error) {
            console.error("Erreur API : ", error);
            enqueueSnackbar("Erreur d'ajout de produit", { variant: "error" });
        }
    };

    return (
        <SnackbarProvider autoHideDuration={3000}> {/* Fournit le contexte pour les notifications */}
            <Container sx={{ maxWidth: "sm", paddingTop: 4 }}>
                {/*  Formulaire de création de produit */}
                <Box
                    sx={{
                        padding: 3,
                        boxShadow: 2,
                        borderRadius: 2,
                        backgroundColor: "white",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Typography variant="h5" gutterBottom align="center">
                        ADD NEW PRODUCT
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box>
                            <TextField
                                id="outlined-required"
                                label="Titre du produit"
                                fullWidth
                                value={title}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                                variant="outlined"
                                margin="normal"
                                required
                            />
                        </Box>

                        <Box>
                            <TextField
                                id="outlined-required"
                                label="Catégorie"
                                fullWidth
                                value={category}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCategory(event.target.value)}
                                variant="outlined"
                                margin="normal"
                                required
                            />
                        </Box>

                        <Box>
                            <TextField
                                id="outlined-required"
                                label="Prix"
                                type="number"
                                fullWidth
                                value={price}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPrice(event.target.value)}
                                variant="outlined"
                                margin="normal"
                                required
                            />
                        </Box>

                        <Box>
                            <TextField
                                id="outlined-required"
                                label="Description"
                                multiline
                                rows={4}
                                fullWidth
                                value={description}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}
                                variant="outlined"
                                margin="normal"
                                required
                            />
                        </Box>

                        <Box>
                            <TextField
                                id="outlined-required"
                                label="URL de l'image"
                                fullWidth
                                value={image}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setImage(event.target.value)}
                                variant="outlined"
                                margin="normal"
                                required
                            />
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Button variant="contained" onClick={handleAdd}>
                                Ajouter le Produit
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>

            <Divider sx={{ marginY: 2 }} />
        </SnackbarProvider>
    );
}

export default CreateProduct;
