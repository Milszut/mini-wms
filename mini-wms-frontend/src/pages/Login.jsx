import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/login";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { user, loading, refresh } = useAuth();
    const [touched, setTouched] = useState({ username: false, password: false });

    if (loading) {
        return (
            <div className="flex items-center justify-center w-screen h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/list" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(username, password);
            await refresh();
        }
        catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-row gap-6 h-screen justify-center items-center bg-[url('/background.png')]">
            <div className="flex flex-col max-[321px]:w-full w-4/5 md:w-2/4 2xl:w-1/4 px-4 py-4 md:px-5 md:py-10  md:p-10 gap-4 backdrop-blur-md bg-[#18202D]/85 rounded-lg shadow-xl">
                <img src="/Mini-WMS-by-Milosz-Cmoch.png" alt="Logo Mini WMS" className="w-48 md:w-80 mx-auto"/>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                    <input className="text-white text-md font-medium flex w-full border-3 border-gray-500 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:border-white"
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nazwa użytkownika"
                        onBlur={() => setTouched({...touched, username: true})}
                        required        
                    />
                    {touched.username && !username && (<p className="w-full mt-2 text-[#FF0719] text-sm font-medium">To pole jest wymagane</p>)}
                    <input className="text-white text-md font-medium flex w-full border-3 border-gray-500 rounded-md p-2 mt-4 placeholder-gray-500 focus:outline-none focus:border-white"
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Hasło"
                        onBlur={() => setTouched({...touched, password: true})}
                        required
                    />
                    {touched.password && !password && (<p className="w-full mt-2 text-[#FF0719] text-sm font-medium">To pole jest wymagane</p>)}
                    {error && (<p className="w-full mt-2 text-[#FF0719] text-sm font-medium">{error}</p>)}
                    <button type="submit" className="font-rubik flex justify-center items-center font-koulen text-xl md:text-2xl bg-blue-600 py-1.5 px-3 mt-4 rounded-xl pt-2 w-auto font-medium hover:bg-blue-950 cursor-pointer">Zaloguj Się</button>
                </form>
            </div>
        </div>
    );
}