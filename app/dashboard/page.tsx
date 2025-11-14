import { prisma } from "@/lib/prima"
import Sidebar from "../components/sidebar"
import { getCurrentUser } from "@/lib/auth"


async function DashboardPage () {
    
    const user = await getCurrentUser()
    const userId = user.id

    const totalProducts = await prisma.product.count({ where: { userId} })
    const lowStock = await prisma.product.count({
        where: {
            userId,
        }
    })
    const recent = await prisma.product.findMany({
        where : { userId},
        orderBy : {createAt: 'desc'},
        take: 5
    })

    console.log(recent)

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/dashboard" />
            <main className="ml-64 p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-shadow-gray-900">
                                Dashboard
                            </h1>
                            <p className="text-sm text-gray-500">
                                Welcome back!  Here is an overview of your inventory. 
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default DashboardPage