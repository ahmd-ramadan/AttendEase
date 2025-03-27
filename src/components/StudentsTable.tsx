import { IUser, ITokenPayload } from "@/interfaces";

interface IStudentsTableProps {
    students: IUser[],
    userData: ITokenPayload | null;
}

const StudentsTable = ({ userData, students }: IStudentsTableProps) => {
    if (userData && userData.role === 'Doctor') {
        return (
            <div className="w-full flex flex-col gap-4 p-2 border-b-2 border-[var(--color-secondary)] rounded-md">
                <h3 className="text-xl font-bold text-[var(--color-secondary)]">الطلاب المشتركين</h3>
            
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    إسم الطالب
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    الإيميل
                                </th>
                                {/* <th scope="col" className="px-6 py-3">
                                    عدد 
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Price
                                </th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {  students.length > 0 ? (
                                    students.map(({ name, email }, idx) => (
                                        <tr
                                            key={idx}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                        >
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {name}
                                            </th>
                                            <td className="px-6 py-4">{email}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-4 text-center">
                                            <p className="text-gray-500 text-lg font-bold">لا يوجد أي حضور حتى الأن</p>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    } else return null;
}

export default StudentsTable;