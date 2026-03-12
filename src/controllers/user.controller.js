import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        user.save({
            validateBeforeSave: false
        });

        return {
            accessToken,
            refreshToken
        }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Tokens.");
    }
}

const registerUser = asyncHandler(async (req, res, next) => {
    const {fullName, username, email, password} = req.body;

    if (
        [fullName, username, email, password].some(
            (field) => field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All Fields are Required !!!");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists.");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) throw new ApiError(400, "Avatar is required. Local Path error");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverLocalPath);

    if (!avatar) {
        console.log("Avatar response from cloudinary ::", avatar);
        throw new ApiError(400, "Avatar is required. Error at Cloudinary" );
    }

    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user.");
    }
    
    
    return res.status(201).json(
        new ApiResponse(200, "User Registered Successfully.", createdUser)
    );
});

const loginUser = asyncHandler(async (req, res, next) => {
    // take email and password from form
    // find user  -> check if user exists
    // check if email-password pair is correct
    // generate an access token and a refresh token
    // send cookies

    const {username: login, password} = req.body;

    if (!login) {
        throw new ApiError(400, "Username or Email is required.");
    }

    const foundUser = await User.findOne({
        $or: [{email: login}, {username: login}]
    });

    if (!foundUser) {
        throw new ApiError(404, "User does not exist.");
    }

    const isPasswordValid = await foundUser.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials.");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(foundUser._id);

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    const loggedInUser = User.findById(foundUser._id)
    .select("-password -refreshToken");

    // or u can also do:
    // const loggedInUser = foundUser.toObject();
    // delete loggedInUser.password;
    // delete loggedInUser.refreshToken;


    return res.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(200, "User logged in successfully", {
            user: loggedInUser,
            accessToken,
            refreshToken
        })
    );


});

const logoutUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user?._id, 
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookies("accessToken", cookieOptions)
    .clearCookies("refreshToken", cookieOptions)
    .json(
        new ApiResponse(200, "User Logged out.")
    )
})

export { registerUser, loginUser, logoutUser };
