
import {Editor} from "@tinymce/tinymce-react";
import {Controller} from "react-hook-form";


export default function RTE({name, control, label, placeholder, defaultValue="<p>Default value</p>", ...props}) {

    return(
        <div className="w-full">
            {label && <label className="inline-block mb-1 pl-1">{label}</label>}

            <Controller
                name={name || "content"}
                control={control} 
                rules={{required: `${name || "content"} is required`}}
                render={({field: {onChange}}) => (
                    <Editor
                    apiKey="cvdkv46y951la5sy11kjj0qwo1j6lpfxhq23f96mtl9vrbrj"
                    initialValue={defaultValue}
                    placeholder={placeholder}
                    init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                            "image",
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                            "anchor",
                        ],
                        toolbar:
                        "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                        content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                    }}
                    onEditorChange={onChange}
                    />
                )}
            />

        </div>
    )
}