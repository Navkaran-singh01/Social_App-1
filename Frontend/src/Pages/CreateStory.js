import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCreateStore } from '../Store/create';

const CreateStory = () => {
    const [file, setFile] = useState(null);
        const [caption,setCaption] = useState(null);
        const [previewURL, setPreviewURL] = useState(null);
        const navigate = useNavigate();
        const {createStory} = useCreateStore();
        const fileInputRef = useRef(null);
    
        const handleFileChange = (e) => {
            const selected = e.target.files[0];
            if (selected) {
                setFile(selected);
                setPreviewURL(URL.createObjectURL(selected)); // create temporary preview URL
            }
        };
        
        const triggerFileSelect = () => {
            fileInputRef.current.click();
        }
    
        const captionHandler = (e) => {
            setCaption(e.target.value)
        }
    
        const uploadHandler = async(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("postFile",file);
            formData.append("caption",caption);
            if(file.type.startsWith("image/")){
                formData.append("contentType","image");
            }
            else formData.append("contentType","video");
            const res = await createStory(formData);
            if(res){
                navigate("/dashboard");
            }
            
        }
    // mr-[200px]
  return (
    <div className="flex items-center justify-center w-[700px] min-h-screen bg-white rounded-lg shadow-lg ">
        <div className='flex flex-col items-center space-y-4 p-4'>
        <div className="flex flex-col items-center space-y-4 p-4">
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} 
            style={{ display: "none" }} ref={fileInputRef}   />

            {
                !file && 
                (
                    <button 
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    onClick={triggerFileSelect}
                    >
                        Create !
                    </button>
                )
            }

            {previewURL && 
            (
                <div>
                {
                    file.type.startsWith("image/") ? (
                        <img src={previewURL} alt="Preview" className="w-64 h-auto rounded-lg" />
                    ) : file.type.startsWith("video/") ? (
                        <video controls className="w-64 rounded">
                            <source src={previewURL} type={file.type} />
                            Your browser does not support video preview.
                        </video>
                    ) : (
                        <p>Preview not supported</p>
                    )
                }
                </div>
            )
            }
        </div>
        {
        file &&
        <div className='flex flex-col items-center space-y-4 p-4'>
        <div className="flex flex-col space-y-2 w-full max-w-md p-4 rounded-xl bg-white shadow-md">
            <label htmlFor='caption' className="text-gray-700 font-semibold text-sm">Caption</label>
            <textarea type='text' id='caption' name='caption' value={caption} onChange={captionHandler}
            placeholder="Write something memorable..."
            className="px-4 py-2 border border-gray-300 h-[200px] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            ></textarea>
        </div>

        <button 
        onClick={uploadHandler}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
        >
            Upload
        </button>
        </div>
        }
        </div>
    </div>
  )
}

export default CreateStory