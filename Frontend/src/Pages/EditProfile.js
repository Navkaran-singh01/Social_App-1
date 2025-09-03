import React ,{useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useUserDataStore } from '../Store/userData';
import { axiosInstance } from '../lib/axios';

const EditProfile = () => {
    const {userData} = useUserDataStore();
    const [file, setFile] = useState(null);
    const [changesProfile,setChangesProfile] = useState({
        username:userData.username,
        bio:userData.bio
    })
    const [previewURL, setPreviewURL] = useState(userData.profilePicture);
    const [uploadingError,setUploadingError] = useState();
    const navigate = useNavigate();
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

    const changeHanler = (e) => {
        console.log("The data is --> ",changesProfile)
        setChangesProfile((prev)=>({
            ...prev,
            [e.target.name] : e.target.value
        }))
    }

    async function updateProfile(formData) {
        try{
            const response = await axiosInstance.put("/update/updateProfile",formData,{
                headers:{
                    "Content-Type" : "multipart/form-data"
                }
            })
            console.log("This is the response of updated Profile : ",response);
            if(response) navigate("/Profile");
        }
        catch(err){
            setUploadingError(err.response.data.message);
            console.error("The Updating Profile Error : ",err.response.data.message);
            console.error("The Updating Profile Error : ",err.response.data);
        }
    }

    const uploadHandler = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("profilePic",file);
        formData.append("username",changesProfile.username);
        formData.append("bio",changesProfile.bio);
        updateProfile(formData);
        
    }

  return (
    <div className="flex items-center justify-center w-[700px] min-h-screen bg-white rounded-lg shadow-lg">
        <div className='flex flex-col items-center space-y-4 p-4'>
        <div className="flex items-center space-y-4 space-x-10 p-4">
            <input type="file" accept="image/*" onChange={handleFileChange} 
            style={{ display: "none" }} ref={fileInputRef}   />

            {previewURL && 
            (
                <div >
                    <img src={previewURL} alt="Preview" className="w-32 h-32 rounded-full" />
                </div>
            )
            }

            {
                (
                    <button 
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    onClick={triggerFileSelect}
                    >
                        Edit Profile Image
                    </button>
                )
            }


        </div>
        <div className='flex flex-col items-center space-y-4 p-4'>

        <div className="flex flex-col space-y-2 w-full max-w-md p-4 rounded-xl bg-white shadow-md">
            <label htmlFor='username' className="text-gray-700 font-semibold text-sm">Username</label>
            <input type='text' id='username' name='username' value={changesProfile.username} onChange={changeHanler}
            placeholder="Write something memorable..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            ></input>
        </div>
        
        <div className="flex flex-col space-y-2 w-full max-w-md p-4 rounded-xl bg-white shadow-md">
            <label htmlFor='bio' className="text-gray-700 font-semibold text-sm">bio</label>
            <textarea type='text' id='bio' name='bio' value={changesProfile.bio} onChange={changeHanler}
            placeholder="Write something memorable..."
            className="px-4 py-2 border border-gray-300  rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            ></textarea>
        </div>

        <button 
        onClick={uploadHandler}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
        >
            Upload
        </button>
        </div>
        {
            uploadingError &&
            <p className='text-red-500 text-sm'>{uploadingError}</p>
        }
        </div>
    </div>
  )
}

export default EditProfile