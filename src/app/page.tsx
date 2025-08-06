'use client'
import { useEffect, useRef, useState } from "react";
import { CourseType } from "../../types";
import { finished } from "stream";
import { toast } from "react-toast";
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css'; 

export default function Home() {
  const [course, setCourse] = useState<CourseType | null>(null); // Using 'any' for simplicity, replace with CourseType if defined
  const [loading, setLoading] = useState<boolean>(false);
  const [no, setNo] = useState<number | null>(null);
  const audioRef = useRef<AudioPlayer | null>(null)

  const serverUrl = "https://www.ilmfelagi.com/api/v1/courses/byNumber"

  useEffect(() => {
    refreshCourse()
  },[])

  const refreshCourse = async () => {
    setCourse(null)
    fetch("/api/courses/count").then((res) => res.json()).then((data) => {
      const n : number =  Number(data.count) + 1 // Debugging line to check course count
      setNo(n)
      console.log("Course count:", n); // Debugging line to check course count
      if(Number.isNaN(n)){
        toast.error("Refresh Again!!")
        return;
      }
      fetch(`${serverUrl}/${n}`).then((res) => res.json()).then((data) => {
        console.log("Fetched course:", data); // Debugging line to check fetched course
        setCourse(data);
      })
    }).catch((error) => {
      console.error("Error fetching course:", error); 
      // setCourse(null);
    });
  }

  const getLastAudioUrl = () => {
    if(course === null) return
   
    return course?.courseIds.split(",")[course.courseIds?.split(",").length - 1];
  }

  const saveToSupa = async (finished: boolean) => {
    if(loading) return;
    setLoading(true);
    const isoString = course!.dateTime.replace(' ', 'T').substring(0, 26);
    console.log("isoString", isoString);
    const date = new Date(isoString);
    const { _id, __v, ...courseWithOutId } = course!;
    let urls: string[] = []
    courseWithOutId.courseIds.split(",").forEach((id: string) => {
      if(id.trim() !== "") {
        urls.push(id.trim())
      }
    });
    console.log("Course data to save:", {
      // ...courseWithOutId,
      // isCompleted: finished ? 1 : 0,
      // dateTime: date,
      courseIds: urls,
    }); // Debugging line to check data being sent
    const payload = JSON.stringify({
      ...courseWithOutId,
      isCompleted: finished ? 1 : 0,
      dateTime: date,
      courseIds: urls,
    })
    console.log("Payload to send:", payload); // Debugging line to check payload
    await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload
    })
    setLoading(false);
    refreshCourse()
  }

  const _10sec = (forward : Boolean) => {
    const audio = audioRef.current?.audio?.current;
    if (audio) {
      if(forward){
        audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
      }else{
        audio.currentTime = Math.min(audio.currentTime - 10, audio.duration);
      }
    }
  };

  if(course === null || no === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-3 pt-24 pr-5 pl-5">
      <p className="text-3xl"><strong>{no} {course.title}</strong></p>
      <p className="text-2xl">{course.ustaz}</p>
      <p className="text-2xl">No of audio {course.courseIds.split(",").length}</p>
      <div className="w-full shadow-md bg-bg1-light dark:bg-bg1-dark ">

      <div className=" max-w-screen-2xl m-auto z-50 bg-bg1-light dark:bg-bg1-dark ">
        {/* Time display */}
        {/* <div className="flex justify-between text-xs px-4 pt-2 text-gray-600 dark:text-gray-300">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div> */}

        {/* Audio player */}
        <AudioPlayer
            ref={audioRef}
            src={getLastAudioUrl()}
            autoPlay
            showSkipControls
            onClickNext={()=> _10sec(true)}
            onClickPrevious={()=> _10sec(false)}
            onEnded={()=>{}}
            header={`${course.title} በ${course.ustaz}`}
            style={
              {
                border: "0",
                boxShadow: "none",
                color: "inherit"
              }
            }
            className="rounded-none border-none shadow-none m-auto"
          />
      </div>
    </div>
      {
        course.pdfId && course.pdfId.trim().length > 0 ?
      <div className="flex flex-col items-center gap-3 pt-6">
        <a className="pt-2 pb-2 pr-4 pl-4 cursor-pointer bg-blue-600 rounded-2xl" target="_blank" href={course.pdfId.split(",")[course.pdfId.split(",").length - 1]}>Show the pdf</a>
        <div className="flex items-center gap-5 pt-6">
          <button onClick={()=>saveToSupa(true)} className="pt-2 pb-2 pr-4 pl-4 cursor-pointer bg-blue-600 rounded-2xl"> { loading ? "Loading..." : "Finished" }</button>
          <button onClick={()=>saveToSupa(false)} className="pt-2 pb-2 pr-4 pl-4  cursor-pointer bg-blue-600 rounded-2xl">{ loading ? "Loading..." : "Not Finished" }</button>
        </div>
      </div>
      :
      <button onClick={()=>saveToSupa(true)} className="pt-2 pb-2 pr-4 pl-4 cursor-pointer bg-blue-600 rounded-2xl"> { loading ? "Loading..." : "Continue" }</button>
      }
      
    </div>
  );
}
