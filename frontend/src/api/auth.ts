import api from '@/api/client'

/* Very simple: Checks with the Django backend if the current session is valid.
 * Returns true if valid, and false if not
 */

const isAuthenticated = async (): Promise<boolean> => {
    try {
        await api.get('/accounts/user/')
        return true
    } catch (error) {
        console.error("User not authenticated:", error)
        return false
    }
}

export default isAuthenticated