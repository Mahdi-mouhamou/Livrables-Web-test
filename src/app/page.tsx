"use client";

import { useEffect, useState } from "react";
import api from "@/utils/axios";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ProductFilter from "@/components/ProductFilter";
import { Product } from "./products/page";


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        if (response.status === 200) {
          setProducts(response.data);
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


  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        🛍️ Product Store
      </Typography>

      <ProductFilter
        categories={category}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
          mt: 4,
        }}
      >
        {filteredProducts.map((product) => (
          <Card key={product.id} sx={{ width: 250 }}>
            <CardMedia
              component="img"
              height="180"
              image={product.image}
              alt={product.title}
              sx={{ objectFit: "contain", padding: 2 }}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div" noWrap>
                {product.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {product.description}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                ${product.price}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => router.push(`/products/${product.id}/show`)}
              >
                Details
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
