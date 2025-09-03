import React, { memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Story from './Story';
import { useUserDataStore } from '../Store/userData';
import { Plus } from 'lucide-react';

const Stories = ({stories}) => {
    const navigate = useNavigate();
    const {userData} = useUserDataStore();
    const [story,setStory] = useState(null);
    console.log("These are the stories --> ",stories);
    const myStory = stories.filter(story => story.userid._id === userData._id);
    console.log("My story is --> ",myStory)
    const otherStories = stories.filter(story => story.userid._id !== userData._id);
    console.log(otherStories);
    const otherUserStories = (otherStories || []).reduce((acc,story)=>{
        let userGroup = acc.find(u => u.user._id === story.userid._id);
        if (!userGroup) {
            userGroup = { user: story.userid, stories: [] };
            acc.push(userGroup);
        }
        userGroup.stories.push(story);
        return acc;
    }, []);
    console.log(otherUserStories);


    const handleCreateStory = () => {
        navigate("/CreateStory");
    }

  return (
    <div className='mt-2 flex items-center w-full p-4 gap-4 border-b-2'>
        <div className='w-[100px] h-[100px] rounded-full relative'>
            <button className={`w-full h-full rounded-full overflow-hidden flex-shrink-0 ${myStory.length > 0 ? 'border-red-500 border-4' : 'border-gray-300 border-4'}  p-1 `} 
            onClick={()=>setStory(myStory.length > 0 ? myStory : null)}>
                <img src = {userData.profilePicture} className="w-full h-full object-cover block rounded-full "/>
            </button>
            <button className='w-[30px] h-[30px] bg-black border-white border-2 rounded-full flex items-center justify-center absolute bottom-0 right-0' onClick={handleCreateStory} >
                <Plus className='w-6 h-6 text-white'/>
            </button>
        </div>
        <div className='w-[100px] h-[100px] gap-4 rounded-full'>
            {
                otherUserStories.map((story)=>(
                    <button key = {story.user._id} className='w-full h-full rounded-full overflow-hidden flex-shrink-0 border-red-500 border-4 p-1' onClick={()=>setStory(story)}>
                        <img src={story.user.profilePicture} className='w-full h-full object-cover block rounded-full'></img>
                    </button>
                ))
            }
        </div>
        {
            story && 
            <Story story={story} setStory={setStory}/>
        }
    </div>
  )
}

export default memo(Stories)