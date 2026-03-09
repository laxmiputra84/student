"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "guest" | "student" | "admin" | "dual";

interface User {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
}

interface AuthContextType {
    role: Role;
    user: User | null;
    login: (role: Role, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<Role>("guest");
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        // Basic persistence
        const savedRole = localStorage.getItem("aura_role") as Role;
        const savedUser = localStorage.getItem("aura_user");
        if (savedRole && savedUser) {
            setRole(savedRole);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (newRole: Role, newUser: any) => {
        setRole(newRole);
        setUser(newUser);
        localStorage.setItem("aura_role", newRole);
        localStorage.setItem("aura_user", JSON.stringify(newUser));
    };

    const logout = () => {
        setRole("guest");
        setUser(null);
        localStorage.removeItem("aura_role");
        localStorage.removeItem("aura_user");
    };

    return (
        <AuthContext.Provider value={{ role, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
