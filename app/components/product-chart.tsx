interface ChargeData {
    week: string,
    products: number
}

const ProductCharge = ({ data } : { data : ChargeData[]}) => {
    console.log(data)
    return (
        <div>
        </div>
    )
}
export default ProductCharge