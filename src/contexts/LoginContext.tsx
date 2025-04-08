"use client" 

import api from "@/utils/axios"; 
import { createContext, ReactNode, useContext, useEffect, useState } from "react"; 
import jwt from "jsonwebtoken"; 
import { redirect } from "next/navigation"; 

export interface User {
    username: string ;
}

// Interface définissant les propriétés fournies par le contexte d'authentification
interface ContextProps {
    isLoggedIn: boolean; // Indique si l'utilisateur est connecté
    user: User | undefined; // Données de l'utilisateur
    logout: Function; // Fonction pour déconnecter l'utilisateur
    login: Function; // Fonction pour connecter l'utilisateur
    loginError: string | null; // Message d'erreur lors de la connexion
    setLoginerror: Function; // Fonction pour mettre à jour l'erreur de connexion
}

const LoginContext = createContext<ContextProps | undefined>(undefined);

// Hook personnalisé pour accéder plus facilement au contexte
export const useLoginContext = () => {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error("LoginContext must be used within a LoginProvider"); 
    }
    return context;
};

export const LoginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    
    // Initialise l'état de connexion à partir du localStorage
    const [isLoggedIn, setIsLoggedin] = useState<boolean>(
        localStorage.getItem("isLoggedIn") ? true : false
    );

    // Récupère les infos de l'utilisateur depuis le localStorage si disponibles
    const tmp = localStorage.getItem("username")
        ? { username: localStorage.getItem("username") || "" }
        : undefined;
    const [user, setUser] = useState<User | undefined>(tmp);

    const [loginError, setLoginerror] = useState<string | null>(null); 

    const toggleLoggedIn = (value: boolean) => {
        setIsLoggedin(value);
    }

    const updateUser = (user: User) => {
        setUser(user);
    }

    // Déconnecte l'utilisateur et efface les données du localStorage
    const logout = () => {
        setIsLoggedin(false);
        setUser(undefined);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
    }

    // Fonction pour connecter l'utilisateur via l'API
    const login = async (username: string, password: string) => {
        try {
            const body = { username, password };
            const response = await api.post("/auth/login", body); // Envoie la requête de connexion à l'API

            if (response.status === 200) {
                toggleLoggedIn(true); 
                const token = response.data.token;

                // Décode le token JWT pour extraire les infos utilisateur
                const decodedToken = jwt.decode(token) as { user: string };

                // Création de l'objet utilisateur à partir du token ou du nom d'utilisateur fourni
                const user: User = {
                    username: decodedToken?.user || username,
                };

                updateUser(user); // Mise à jour du state
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("username", user.username);
                setLoginerror(null); // Réinitialise les erreurs
                redirect("/products"); // Redirige vers la page des produits après connexion
            }
        } catch (error: any) {
            // En cas d'erreur, affiche un message
            console.error("Erreur lors de la connexion :", error);
            setLoginerror("Nom d'utilisateur ou mot de passe incorrect");
        }
    };

    // Fournit le contexte à tous les composants enfants
    return (
        <LoginContext.Provider value={{ isLoggedIn, user, logout, login, setLoginerror, loginError }}>
            {children}
        </LoginContext.Provider>
    );
};
