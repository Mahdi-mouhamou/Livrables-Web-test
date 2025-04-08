"use client"; 

import { useLoginContext } from "@/contexts/LoginContext"; 
import { useEffect, useState } from "react"; 
import { redirect } from "next/navigation"; 
import api from "@/utils/axios";

// Composants MUI (Material UI)
import {
  Box,
  Button,
  Typography,
  TextField,
} from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import ProductFilter from "@/components/ProductFilter";

export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
  description: string;
  rating: {
    rate: number;
    count: number;
  };
}

export default function Products() {
  const { isLoggedIn } = useLoginContext(); // Accès à l’état de connexion

  //  Rediriger vers le login si l'utilisateur n'est pas connecté
  if (!isLoggedIn) {
    redirect("/login");
  }

  //  Déclaration des états locaux
  const [products, setProducts] = useState<Product[]>([]); // Tous les produits
  const [category, setCategory] = useState<string[]>([]); // Catégories extraites
  const [selectedCategory, setSelectedCategory] = useState<string>("all"); // Catégorie filtrée
  const [searchQuery, setSearchQuery] = useState<string>(""); // 🔍 Recherche utilisateur

  const router = useRouter();

  //  Chargement initial des produits depuis l’API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        if (response.status === 200) {
          setProducts(response.data); // Stocker les produits
          
          // Extraire et stocker les catégories uniques
          const ArrayCategory = Array.from(
            new Set(response.data.map((p: { category: string }) => p.category))
          ) as string[];
          setCategory(ArrayCategory);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      }
    };

    fetchProducts(); 
  }, []);

  //  Filtrage combiné par catégorie ET par mot-clé dans le titre
  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase()); // recherche insensible à la casse
    return matchCategory && matchSearch;
  });

  // Définition des colonnes pour le tableau DataGrid
  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="product"
          width={50}
          height={50}
          style={{ objectFit: "contain" }} 
        />
      ),
    },
    { field: "title", headerName: "Titre", flex: 1 },
    { field: "category", headerName: "Catégorie", width: 150 },
    { field: "price", headerName: "Prix ($)", width: 120 },
    {
      field: "details",
      headerName: "Détails",
      width: 170,
      renderCell: (params) => (
        <Box>
          {/*  Bouton pour afficher les détails du produit */}
          <Button
            variant="contained"
            size="small"
            onClick={() => router.push(`/products/${params.row.id}`)}
          >
            Show
          </Button>

          {/*  Bouton de suppression */}
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // 🗑️ Fonction de suppression d’un produit
  const handleDelete = async (id: number) => {
    const confirm = window.confirm(
      "Voulez-vous vraiment supprimer ce produit ?"
    );
    if (!confirm) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id)); // Mise à jour locale
      enqueueSnackbar("Produit supprimé avec succès", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Erreur lors de la suppression", { variant: "error" });
    }
  };

  
  return (
    <SnackbarProvider autoHideDuration={3000}> {/* Fournit le contexte des notifications */}
      <Box sx={{ padding: 4 }}>

        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          🧾 List of Products
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <TextField
            label="Rechercher un produit"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: "50%" }}
          />
        </Box>

        <ProductFilter
          categories={category}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <Box
          sx={{
            height: 600,
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 2,
            marginTop: 2,
          }}
        >
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </Box>
      </Box>
    </SnackbarProvider>
  );
}
