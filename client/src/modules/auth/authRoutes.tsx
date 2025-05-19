import { AuthLayout } from './layouts/AuthLayout'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'

export const authRoutes = {
    path: 'auth',
    children: [
        {
            element: <AuthLayout />,
            children: [
                {
                    path: 'login',
                    element: <LoginPage />
                },
                {
                    path: 'signup',
                    element: <SignupPage />
                },
            ]
        }
    ],
}