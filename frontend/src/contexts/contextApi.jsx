import { createContext, useContext, useState, useEffect } from "react";
import { fetchMeApi } from "../services/auth.service";

export const Api = createContext();

function ApiProvider({ children }) {

    const [user, setUser] = useState({
        id :'',

        name :'',
        email : '',
        accountType : '',
        isblock:false

    });
    

    const [islogin, setIslogin] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");

            // Try to fetch current user; if it fails, fall back to localStorage
            let response = null;
            try {
                response = await fetchMeApi();
            } catch (err) {
                response = null;
            }

            if (response && response.user) {
                setUser(response.user);
                setIslogin(true);
            } else if (token && userData) {
                setUser(JSON.parse(userData));
                setIslogin(true);
            } else {
                setUser({
                    id: '',
                    name :'',
                    email : '',
                    accountType : '',
                    isblock:false
                });
                setIslogin(false);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    console.log("User state in ApiProvider:", user);

    

    const value = {
        user,
        setUser,
        islogin,
        setIslogin,
        loading,
        setLoading
    };

    return <Api.Provider value={value}>{children}</Api.Provider>;
}

export const useApi = () => {
    const context = useContext(Api);
    if (!context) {
        throw new Error("useApi must be used within ApiProvider");
    }
    return context;
};

export { ApiProvider };