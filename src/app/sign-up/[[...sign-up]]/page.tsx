import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
      <SignUp />
    </div>
  )
}
