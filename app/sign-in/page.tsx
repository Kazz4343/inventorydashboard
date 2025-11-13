import { SignIn } from "@stackframe/stack"
import Link from "next/link"


const SignInPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-purple-100">
            <div>
                <SignIn />
                <Link href={'/'}>
                    Go Back Home
                </Link>
            </div>
        </div>
    )
}

export default SignInPage