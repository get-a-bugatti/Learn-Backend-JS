import {useForm} from "react-hook-form"
import { Link, } from "react-router-dom";
import {Input, Button} from "../index.js"
import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {

    const {handleSubmit, register, formState: {errors}} = useForm();
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const signup = async (data) => {

        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("username", data.username);
        formData.append("avatar", data.avatar[0]);
        if (data.cover?.[0]) {
            formData.append("cover", data.cover[0]);
        }
        formData.append("email", data.email);
        formData.append("password", data.password)

        try {
            const response = await axios.post("/api/v1/users/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            console.log(response.data);
            navigate("/");
        } catch (error) {

            if (error.response) {
                setError(error.response.data.message)
            } else {
                setError(error.message);
            }
        }
    }

    return (
        <div className="flex items-center justify-center w-full">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <h2 className="text-center text-2xl font-bold leading-tight">Create a new account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Login
                    </Link>
                </p>
                {
                    error 
                    && 
                    <p className="text-red-600 mt-8 text-center">
                        {error}
                    </p>
                }


                <form onSubmit={handleSubmit(signup)}>
                    <div className="w-full space-y-5">
                        <Input 
                        label="Full name: "
                        placeholder="Enter your fullname:"
                        type="text"
                        {...register("fullName", {
                            required: "Full name is required.",
                        
                            pattern: {
                              value: /^[A-Za-z\s]+$/,
                              message: "Only letters and spaces allowed",
                            },
                        
                            validate: {
                              hasTwoWords: (value) =>
                                value.trim().split(" ").length >= 2 ||
                                "Please enter first and last name",
                            },
                        })}
                        />
                        {
                            errors.fullName
                            && 
                            <p className="text-red-600 mt-8 text-center">
                                {errors.fullName.message}
                            </p>
                        }

                        <Input
                        label="Avatar Image: "
                        placeholder="Choose a file:"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        {...register("avatar", {
                            required: "Avatar is required."
                        })}
                        />

                        {
                            errors.avatar
                            && 
                            <p className="text-red-600 mt-8 text-center">
                                {errors.avatar.message}
                            </p>
                        }


                        <Input
                        label="Cover Image: "
                        placeholder="Choose a file:"
                        type="file"
                        accept="image/*"
                        {...register("cover")}
                        />

                    <Input 
                        label="Username: "
                        placeholder="Enter your username:"
                        type="text"
                        {...register("username", {
                        required: "Username is required.",

                        minLength: {
                            value: 3,
                            message: "Username must be at least 3 characters",
                        },

                        maxLength: {
                            value: 20,
                            message: "Username must be less than 20 characters",
                        },

                        pattern: {
                            // 🔥 only letters, numbers, underscore, dot
                            value: /^[a-zA-Z0-9._]+$/,
                            message: "Only letters, numbers, . and _ allowed",
                        },

                        validate: {
                            noSpaces: (value) =>
                            !/\s/.test(value) || "Username cannot contain spaces",

                            noStartEndDot: (value) =>
                            !/^[._]|[._]$/.test(value) ||
                            "Cannot start or end with . or _",

                            noConsecutiveDots: (value) =>
                            !/[._]{2,}/.test(value) ||
                            "Cannot contain consecutive dots or underscores",
                        },
                        })}
                    />

                    {errors.username && (
                        <p className="text-red-600 mt-8 text-center">
                        {errors.username.message}
                        </p>
                    )}

                        <Input
                        label="Email: "
                        placeholder="Enter your email: "
                        type="email"
                        {...register("email", {
                            required:  "Email is required.",
                            validate: {
                                matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address."
                            }
                        })}
                        />

                        {
                            errors.email
                            && 
                            <p className="text-red-600 mt-8 text-center">
                                {errors.email.message}
                            </p>
                        }


                        <Input
                        label="Password: "
                        placeholder="Enter your password: "
                        type="password"
                        {...register("password", {
                            required: "Password is required.",
                            validate: {
                                minLength: (value) => value.length >=8 || "Password must be at least 8 characters.",
                                maxLength: (value) => value.length <=20 || "Password must be at most 20 characters."
                            }
                        })}
                        />

                        {
                            errors.password
                            && 
                            <p className="text-red-600 mt-8 text-center">
                                {errors.password.message}
                            </p>
                        }

                        <Button type="submit" className="w-full rounded-lg">Register</Button>
                    </div>
                </form>


            </div>
        </div>
    );
    

}