import { prisma } from "@/lib/prima"
import Sidebar from "../components/sidebar"
import { getCurrentUser } from "@/lib/auth"
import { TrendingUp } from "lucide-react"
import ProductCharge from "../components/product-chart"


async function DashboardPage () {
    
    const user = await getCurrentUser()
    const userId = user.id

    const [ totalProducts, lowStock, recent, allProduct] = await Promise.all([
        prisma.product.count({ where: { userId} }),
        prisma.product.count({
        where: {
            userId, 
            lowStockAt: {not:null},
            quantity: {lte: 5}
            }
        }),
        prisma.product.findMany({
        where : { userId},
        orderBy : {createAt: 'desc'},
        take: 5
        }),
        prisma.product.findMany({
        where: {userId},
        select: {price: true, quantity: true, createAt: true},
        }),

    ])

    // const totalProducts = await prisma.product.count({ where: { userId} })
    // const lowStock = await prisma.product.count({
    //     where: {
    //         userId, 
    //         lowStockAt: {not:null},
    //         quantity: {lte: 5}
    //     }
    // })
    // const recent = await prisma.product.findMany({
    //     where : { userId},
    //     orderBy : {createAt: 'desc'},
    //     take: 5
    // })

    // const allProduct = await prisma.product.findMany({
    //     where: {userId},
    //     select: {price: true, quantity: true, createAt: true},
    // })
    
    const weeklyProductsData = []
    const now = new Date()
   
    for (let i = 11; i>=0; i--) {
        const weekStart = new Date(now)
        weekStart.setDate(weekStart.getDate() - i * 7)
        weekStart.setHours(0,0,0,0)

        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        weekEnd.setHours(23,59,59,999)

        const weekLabel = `${String(weekStart.getMonth() + 1).padStart(2, '0')}/${String(weekStart.getDate() + 1).padStart(2, '0')}`

        const weekProducts = allProduct.filter((product) => {
            const productDate = new Date(product.createAt)
            return productDate >= weekStart && productDate <= weekEnd
        })

        weeklyProductsData.push({
        week: weekLabel,
        products: weekProducts.length,
        })
    }

    const totalValue = allProduct.reduce((sum, curr) => sum + Number(curr.price) * Number(curr.quantity), 0)

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
                {/* Key Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold test-gray-900 mb-6">
                            Key Metrics
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">{totalProducts}</div>
                                <div className="text-sm text-gray-600">Total Products</div>
                                <div className="flex items-center justify-center mt-1">
                                    <span className="text-xs text-green-600">+{totalProducts}</span>
                                    <TrendingUp className="w-3 h-3 text-green-600"/>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    ${Number(totalValue).toFixed(0)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Value
                                </div>
                                <div className="flex items-center justify-center mt-1">
                                    <span className="text-xs text-green-600">
                                        +${Number(totalValue).toFixed(0)}
                                    </span>
                                    <TrendingUp className="w-3 h-3 text-green-600"/>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {lowStock}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Low Stock
                                </div>
                                <div className="flex items-center justify-center mt-1">
                                    <span className="text-xs text-green-600">
                                        +{lowStock}
                                    </span>
                                    <TrendingUp className="w-3 h-3 text-green-600"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between. mb-6">
                            <h2>New products per week</h2>
                        </div>
                        <div className="h-48">
                            <ProductCharge data={ weeklyProductsData } />
                        </div>
                    </div>
                </div>


                {/* Stock Level */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-shadow-gray-900">
                                Stock Level
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {recent.map((product, key)=> {
                                const stockLevel = product.quantity === 0 
                                ? 0 :
                                product.quantity <= (product.lowStockAt || 5) ?
                                    1 : 2

                                const bgColors = [
                                    'bg-red-600',
                                    'bg-yellow-600',
                                    'bg-green-600'
                                ]

                                const textColors = [
                                    'text-red-600',
                                    'text-yellow-600',
                                    'text-green-600'
                                ]
                                return (
                                    <div key={key} 
                                    className='flex 
                                    items-center 
                                    justify-between 
                                    p-3 
                                    rounded-lg 
                                    bg-gray-50'>
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${bgColors[stockLevel]}`}></div>
                                            <span className="text-sm font-medium text-gray-900">
                                                    {product.name}
                                            </span>
                                        </div>
                                        <div className={`text-sm font-medium ${textColors[stockLevel]}`}>
                                            {product.quantity} units
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default DashboardPage