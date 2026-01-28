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
    const checkUser = async () => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const response = await fetchMeApi();
        setUser(response.user);
        if(response){
            setIslogin(true);
        }


         const data = await response.json();
         console.log("User data from API:", data);


        if (token && userData) {
            setUser(JSON.parse(userData));
            setIslogin(true);
        } else {
            setUser({
                name :'',
                email : '',
                accountType : '',
                isblock:false
            });
            setIslogin(false);
        }   
    };
    console.log("User state in ApiProvider:", user);

    useEffect(() => {
        checkUser();
    }, []);


    const value = {
        user,
        setUser,
        islogin,
        setIslogin,
        
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