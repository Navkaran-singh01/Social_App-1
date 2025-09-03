import React, { useEffect, useState } from 'react'
import { X,ChevronLeft,ChevronRight } from 'lucide-react';
const Story = ({story,setStory}) => {
    const [progress,setProgress] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const stories = story.user ? story.stories : story;
    console.log("These are the stories in the story component that used for the map",stories);
    const currentStory = stories[currentIndex];
    useEffect(()=>{
        setProgress(0);
        console.log("jfskdhfkjsdfsadjkfjhaskjfsad")

        const interval = setInterval(()=>{
            setProgress((prev)=>{
                if(prev >= 100){
                    clearInterval(interval);
                    if (currentIndex < stories.length - 1) {
                        setCurrentIndex((prev) => prev + 1);
                    } else {
                        setStory(null);
                    }
                }
                return prev+1;
            })
        },50)
        return (()=>clearInterval(interval));
    },[currentIndex])

  return (
    <div className='fixed inset-0 bg-zinc-900 flex  items-center justify-center z-50'>
        <h1 className="absolute top-5 left-5 text-[40px] text-white" style={{ fontFamily: 'Billabong, sans-serif' }}>
            SocialApp
        </h1>
            {
                stories.length > 1 && currentIndex > 0 ?
                (<button 
                onClick={()=>setCurrentIndex((prev)=>prev-1)}
                className='h-full text-white mr-10 flex items-center justify-center'>
                <ChevronLeft className='w-8 h-8' />
                </button>):
                (
                    <ChevronLeft className='text-slate-400 mr-10 w-8 h-8'/>
                )
            }
            <div className='relative h-full  flex justify-center items-center w-[400px] gap-1 p-2 py-3 rounded-lg overflow-hidden'>
                <div className='absolute top-6 w-10/12 flex gap-x-1 h-1  '>
                {
                    stories.map((_,index)=>(
                        <div                 
                        className="h-full flex-1 bg-gray-500 rounded-full "
                        style={{background : index < currentIndex ?
                            "white" :
                            index === currentIndex ?
                            `linear-gradient(to right, white ${progress}%, gray ${progress}%)`
                            : "gray",
                        }
                        }
                        >
                        </div>
                    ))
                }
                </div>


                {
                    currentStory.contentType === "image" ?
                    (
                        <img src={currentStory.content} alt='story'
                             className='h-full w-full rounded-lg object-cover '
                        ></img>
                    ) 
                    :
                    (
                        <video src={currentStory.content} alt='story'
                               className='h-full w-full rounded-lg object-cover'
                               autoPlay
                        ></video>
                    )
                }
            </div>
            {
                stories.length > 1 && currentIndex < stories.length-1 ?
                (<button 
                onClick={()=>setCurrentIndex((prev)=>prev+1)}
                className='h-full text-white ml-10 flex items-center justify-center'>
                <ChevronRight className='w-8 h-8' />
                </button>):
                (
                    <ChevronRight className='text-slate-400 ml-10 w-8 h-8'/>
                )
            }
            <button onClick={()=>setStory(null)}
                className="absolute top-4 right-4 text-white text-2xl">
                <X className='w-8 h-8'/>
            </button>
    </div>
  )
}

export default Story