import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import {Input, RTE, Button} from "../index.js"
import axios from "axios";


export default function VideoForm({
    video
}) {

    const {handleSubmit, register, watch, control, setValue, getValues, formState: {errors}} = useForm({
        defaultValues: {
            title: video?.title || '',
            description: video?.description || '',
        }
    });
    const [publishStatus, setPublishStatus] = useState("Publish Video");
    const navigate = useNavigate();

    const submit = async (data) => {
       const formData = new FormData();

       formData.append("title", data.title);
       formData.append("description", data.description);
       formData.append("thumbnail", data.thumbnail[0]);
       formData.append("videoFile", data.videoFile[0]);

       setPublishStatus("Publishing ...");

       const response = await axios.post("/api/v1/videos/publish", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
       });
       
       alert("Published Video successfully.");

       navigate("/your-videos");
    }

    return (    
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap gap-10 mr-8">
            <div className="flex-2 space-y-5">
                <Input 
                label='Title: ' 
                placeholder="Enter video title..."
                type="text"
                defaultValue={getValues("title")}
                {...register("title", {
                    required: true,
                })}
                />

                {
                    errors.title && 
                    (
                    <p className="text-red-600 mt-8 text-center">
                        {errors.title}
                    </p>
                    )
                }

                <RTE 
                    label="Description: "
                    placeholder="Enter video description..."
                    name="description"
                    control={control}
                    defaultValue={getValues("description")}
                />
            </div>

            <div className="flex-1 space-y-5">

                <Input label="Upload thumbnail: " type="file" accept=".png, .jpg, .webp" {
                    ...register("thumbnail", {
                        required: true
                    })
                }></Input>

                {
                    errors.thumbnail && 
                    (
                    <p className="text-red-600 mt-8 text-center">
                        {errors.thumbnail}
                    </p>
                    )
                }

                
                <Input label="Upload video: " type="file" accept=".mp4" {
                    ...register("videoFile", {
                        required: true
                    })
                }></Input>

                {
                    errors.videoFile && 
                    (
                    <p className="text-red-600 mt-8 text-center">
                        {errors.videoFile}
                    </p>
                    )
                }
            
            <Button type="submit" className="w-full rounded-xl">{publishStatus}</Button>
            </div>

        </form>
    )
}