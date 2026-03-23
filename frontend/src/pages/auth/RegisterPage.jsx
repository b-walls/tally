import { useAuth } from "../../contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { TbTextScan2, TbGraph, TbMoneybag } from "react-icons/tb"
import icon from '../../assets/icon.svg'
import { register } from "../../api/auth"

const FEATURES = [
  {
    icon: TbTextScan2,
    title: "Scan any receipt instantly",
    description: "point your camera and Tally extracts every detail automatically",
  },
  {
    icon: TbGraph,
    title: "Your money, at a glance",
    description: "instant summaries of what you've spent, saved, and where to cut back",
  },
  {
    icon: TbMoneybag,
    title: "Manage your finances",
    description: "set budgets, track goals, and export reports in one tap",
  },
]

function FeatureItem({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-row gap-5 items-center">
      <div className="shrink-0 p-2 bg-surface-raised border border-border text-primary rounded-md flex items-center justify-center">
        <Icon className="w-[clamp(1.5rem,3.5vw,3rem)] h-[clamp(1.5rem,3.5vw,3rem)]" />
      </div>
      <p className="text-[clamp(0.85rem,1.3vw,1.25rem)] text-text-muted">
        <span className="font-bold text-text">{title}</span> — {description}
      </p>
    </div>
  )
}

function RegisterPage() {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.target)
      await register(formData.get("email"), formData.get("password"), formData.get("firstName"), formData.get("lastName"))
      navigate('/login')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">

      {/* Marketing panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between basis-3/5 bg-surface p-[clamp(2rem,6vw,4rem)] overflow-hidden">
        <div className="flex flex-row gap-3 items-center">
          <img className="w-[clamp(4rem,8vw,7rem)] bg-surface-raised border border-border rounded-md" src={icon} alt="Tally logo" />
          <div className="flex flex-col justify-center">
            <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold">Tally</h1>
            <p className="text-[clamp(0.65rem,1vw,0.875rem)] uppercase tracking-widest text-text-muted">Budget & Expense Tracking</p>
          </div>
        </div>

        <div>
          <h2 className="text-[clamp(1.5rem,3vw,2.25rem)]/[1] font-bold font-">Start tracking<br/> expenses for free.</h2>
          <p className="text-[clamp(0.9rem,1.5vw,1.25rem)] text-text-muted mt-2">No credit card required. Up and running in under a minute.</p>
        </div>

        <div className="flex flex-col gap-[clamp(0.75rem,2vh,1.25rem)]">
          {FEATURES.map((feature) => (
            <FeatureItem key={feature.title} {...feature} />
          ))}
        </div>
      </div>

      {/* Register form panel */}
      <div className="flex-1 lg:basis-2/5 bg-surface-raised p-8 sm:p-12 lg:p-24 flex flex-col justify-center lg:border-l border-border">

        {/* Mobile logo */}
        <div className="flex flex-col lg:hidden items-center justify-center mb-8 gap-1">
          <div className="flex flex-row items-center gap-3">
            <img className="w-10 h-10 rounded-lg" src={icon} alt="Tally logo" />
            <h1 className="text-3xl font-extrabold tracking-tight">Tally</h1>
          </div>
          <p className="text-xs uppercase tracking-widest text-text-muted font-medium">Budget & Expense Tracking</p>
        </div>

        <div className="mb-6 text-center lg:text-start">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-text-muted text-sm mt-1">Sign up to get started</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex flex-col gap-1 grow max-h-[78px]">
              <label className="text-text-muted text-md" htmlFor="first-name-input">First name</label>
              <input className="border border-border rounded-md p-3 bg-surface focus:border-primary" type="text" name="firstName" id="first-name-input" />  
            </div>
            <div className="flex flex-col gap-1 grow max-h-[78px]">
              <label className="text-text-muted text-md" htmlFor="last-name-input">Last name</label>
              <input className="border border-border rounded-md p-3 bg-surface focus:border-primary" type="text" name="lastName" id="last-name-input" />  
            </div>
          </div>
          <div className="flex flex-col gap-1 max-h-[78px]">
            <label className="text-text-muted text-md" htmlFor="email-input">Email Address</label>
            <input className="border border-border rounded-md p-3 bg-surface focus:border-primary" type="email" name="email" id="email-input" />
          </div>
          <div className="flex flex-col gap-1 max-h-[78px]">
            <label className="text-text-muted text-md" htmlFor="password-input">Password</label>
            <input className="border border-border rounded-md p-3 bg-surface focus:border-primary" type="password" name="password" id="password-input" />
          </div>
          <div className="flex flex-col gap-1 max-h-[78px]">
            <label className="text-text-muted text-md" htmlFor="confirm-password-input">Confirm Password</label>
            <input className="border border-border rounded-md p-3 bg-surface focus:border-primary" type="password" name="confirmPassword" id="confirm-password-input" />
          </div>
          <button className="bg-primary hover:bg-primary-hover text-background font-semibold px-5 py-2 rounded-lg text-sm transition-colors cursor-pointer mt-3" type="submit">
            Create account
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-text-muted text-sm">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button className="hover:bg-border text-text border w-full border-border px-5 py-2 rounded-lg text-sm transition-colors cursor-pointer">
          Sign up with Google
        </button>

        <p className="text-text-muted text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>

    </div>
  )
}

export default RegisterPage
