import React, { useEffect, useState } from 'react'
import { useDataStore } from '../Store/getData'
import Story from '../Components/Story';

const Archieve = () => {
    const {archievedStories,getArchievedStories} = useDataStore();

    const [story,setStory] = useState(null);

    useEffect(()=>{
        getArchievedStories();
    },[])
    console.log("These are the archieved Stories --> ",archievedStories);
  return (
    <div className="flex flex-col items-center w-[700px] min-h-screen bg-white rounded-lg shadow-lg ">
        <p className='pt-5 text-2xl text-gray-300 border-b-2'>Archieve...</p>
        <div className='p-10 w-full grid grid-cols-2 '>
            {
                archievedStories.length > 0 &&
                archievedStories.map((story)=>(
                    <div key={story._id} >
                        <button className='w-[300px] h-[500px] overflow-hidden flex-shrink-0' 
                        onClick={()=>setStory(story)}
                        >
                            {
                                story.contentType === 'image' ?
                                (
                                    <img src={story.content} className='w-full h-full object-cover block'/>
                                )
                                :
                                (
                                    <video src={story.content} autoPlay className='w-full h-full object-cover'></video>
                                )
                            }
                        </button>
                    </div>
                )
                )
            }
        </div>
        {
            story &&
            <Story story={[story]} setStory={setStory}/>
        }
    </div>
  )
}

export default Archieve