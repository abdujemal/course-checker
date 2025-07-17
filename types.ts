import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

export type CourseType = {
  __v : any,
  _id   : any,        // Int      @id @default(autoincrement())
  courseId  : String,   // String?  // Optional field
  author   : String,  // String?  // Optional field
  category  : String,   // String?  // Optional field
  courseIds  : String,   // String?  // Optional field
  noOfRecord : Number,   // Int?     // Optional field
  pdfId  : String,       //String?  // Optional field
  title  : String,       //String?  // Optional field
  ustaz  : String,       //String?  // Optional field
  image   : String,      //String?  // Optional field
  totalDuration  : Number,//Int?     // Optional field
  audioSizes  : String,   //String?  // Optional field
  isCompleted  : Number,  //Int      @default(0)
  dateTime  : String,    //DateTime @db.Timestamp(0) // Corresponds to timestamp without time zone
  isDeleted  : Boolean,    //Boolean  @default(false)
  isBeginner  : Boolean   //Boolean  @default(false)
}