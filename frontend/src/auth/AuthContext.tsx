import { createContext, useContext, useState, type ReactNode } from "react";

type AuthContextType = {
    token:string | null;
    login: (token:string) => void;
    logout:() => void
}

const AuthContext = createContext<AuthContextType | null>(null);


export function AuthContextWrapper( {children}: {children: ReactNode} ){

    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem('token')
    );

    const login = (newToken:string) =>{
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }

    const logout = () =>{
        localStorage.removeItem('token');
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{token, login, logout}}>
            {children}
        </AuthContext.Provider>

    );
}

export function useAuth(){
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error('useAuth muse be used insde AuthProvider');
    return ctx;
}