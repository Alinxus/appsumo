import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
  openGraph: {
    title: "Register | My App",
    description: "Create a new account on My App",
  },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">AIsumo</h2>
          <h3 className="mt-6 text-2xl font-bold text-gray-900">
            Create your account
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <a
              href="/auth/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              sign in to your existing account
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
