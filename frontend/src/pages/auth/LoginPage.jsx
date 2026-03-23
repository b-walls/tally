import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
function LoginPage() {
  const { login } = useAuth()
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const email = formData.get("email")
      const password = formData.get("password")
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h1>LoginPage</h1>
      <form className="" onSubmit={handleSubmit}>
        <label htmlFor="email-input">email</label>
        <input type="text" name="email" id="email-input"/>
        <label htmlFor="password">password</label>
        <input type="password" name="password" id="password-input"/>
        <button type="submit">Sign in</button>
      </form>  
    </div>
  )
}

export default LoginPage