import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
      <SignIn />
    </div>
  )
}
