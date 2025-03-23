import CourseDetailsComponent from "@/components/CourseDetails";

interface ICourseDetailsProps {
    params: {
        courseId: string;
    }
}

const CourseDetailsPage = ({ params: { courseId } }: ICourseDetailsProps) => {

    return (
        <div className="m-2">
            <CourseDetailsComponent courseId={ courseId }/>
        </div>
    )
}

export default CourseDetailsPage;