'use client'
import { useEffect, useRef, useState } from "react";
import { CourseType } from "../../types";
import { finished } from "stream";

export default function Home() {
  const [course, setCourse] = useState<CourseType | null>(null); // Using 'any' for simplicity, replace with CourseType if defined
  const [loading, setLoading] = useState<boolean>(false);

  const serverUrl = "https://www.ilmfelagi.com/api/v1/courses/byNumber"

  useEffect(() => {
    refreshCourse()
  },[])

  const refreshCourse = async () => {
    setCourse(null)
    fetch("/api/courses/count").then((res) => res.json()).then((data) => {
      const n : Number =  Number(data.count) + 1 // Debugging line to check course count
      console.log("Course count:", n); // Debugging line to check course count
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
    const date = new Date(isoString);
    const { _id, __v, ...courseWithOutId } = course!;
    await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...courseWithOutId,
        isCompleted: finished ? 1 : 0,
        dateTime: date,
        
      })
    })
    setLoading(false);
    refreshCourse()
  }

  if(course === null){
    return (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-3 pt-24 pr-5 pl-5">
      <p className="text-3xl"><strong>{course.title}</strong></p>
      <p className="text-2xl">{course.ustaz}</p>
      <audio controls src={getLastAudioUrl()} />
      <div className="flex items-center gap-2">
        <button onClick={()=>saveToSupa(true)} className="pt-2 pb-2 pr-4 pl-4 cursor-pointer bg-blue-600 rounded-2xl"> { loading ? "Loading..." : "Finished" }</button>
        <button onClick={()=>saveToSupa(false)} className="pt-2 pb-2 pr-4 pl-4  cursor-pointer bg-blue-600 rounded-2xl">{ loading ? "Loading..." : "Not Finished" }</button>
      </div>
    </div>
  );
}
