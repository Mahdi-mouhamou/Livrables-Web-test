"use client"; 
import { Button, Box } from "@mui/material";
import React from "react";

interface Props {
  categories: string[];              // Liste des catégories à afficher comme filtres
  selectedCategory: string;         // Catégorie actuellement sélectionnée
  onSelect: (category: string) => void; // Callback déclenché au clic sur une catégorie
}

//  Composant qui permet de filtrer les produits par catégorie
export default function ProductFilter({
  categories,
  selectedCategory,
  onSelect,
}: Props) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", mb: 3 }}>
      {/* Bouton pour afficher tous les produits */}
      <Button
        variant={selectedCategory === "all" ? "contained" : "outlined"}
        onClick={() => onSelect("all")}
        sx={{ m: 1 }}
      >
        All Products
      </Button>

      {/* Boutons générés dynamiquement pour chaque catégorie */}
      {categories.map((cat, index) => (
        <Button
          key={index}
          variant={selectedCategory === cat ? "contained" : "outlined"}
          onClick={() => onSelect(cat)}
          sx={{ m: 1 }}
        >
          {cat}
        </Button>
      ))}
    </Box>
  );
}
