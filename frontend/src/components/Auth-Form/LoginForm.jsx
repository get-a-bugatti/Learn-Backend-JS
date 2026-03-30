import {useForm} from "react-hook-form"
import { Link } from "react-router-dom";
import {Input, Button} from "../index.js";
import { useState } from "react";
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { login as loginUser } from "../../store/authSlice";
import axios from "axios";

// LEFT HERE : TODO : implement dispatch with login()
// ALSO figure out structure of backend after signup and Login.
export default function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const {register, handleSubmit} = useForm();
    const [error, setError] = useState("");

    const login = async (data) => {
        
        const params = new URLSearchParams();
        params.append("login", data.login);
        params.append("password", data.password)

        try {
            const response = await axios.post("/api/v1/users/login", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            console.log(response);

            // dispatch userData to store.
            dispatch(loginUser(response.data.data.user));

            navigate("/");
        } catch (error) {

            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError(error.message);
            }
        }
    };

    return (
        <div className="flex -items-center justify-center w-full">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {
                    error 
                    && 
                    <p className="text-red-600 mt-8 text-center">
                        {error}
                    </p>
                }

                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <div className="space-y-5">
                        <Input 
                        label='Login: ' 
                        placeholder="Enter your username or email..."
                        type="text"
                        autoComplete="email"
                        {...register("login", {
                            required: true,
                            // validate: {
                            //     matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address."
                            // }
                        })}
                        />
                        <Input 
                        label="Password: "
                        placeholder="Enter your password..."
                        type="password"
                        autoComplete="current-password"
                        {...register("password", {
                            required: true,
                            validate: {
                                minLength: (value) => value.length >=8 || "Password must be at least 8 characters.",
                                maxLength: (value) => value.length <=20 || "Password must be at most 20 characters."
                            }
                        })}
                        />
                        <Button type="submit" className="w-full rounded-lg">Sign In</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}