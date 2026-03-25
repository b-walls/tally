import zxcvbn from 'zxcvbn';

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { TbTextScan2, TbGraph, TbMoneybag } from "react-icons/tb"

import tally_icon_64 from '../../assets/tally_icon_64.svg'
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

// Static class maps are required — Tailwind uses static analysis to build its
// stylesheet. Dynamically concatenated strings like "bg-" + color are never
// seen by the analyser and get purged from production builds, breaking styles.
const BAR_COLOR = {
  surface: "bg-surface",
  danger:  "bg-danger",
  warning: "bg-warning",
  success: "bg-success",
}

const TEXT_COLOR = {
  "":      "text-text",
  danger:  "text-danger",
  warning: "text-warning",
  success: "text-success",
}

function PasswordStrengthIndicator({ strength, feedback }) {
  let colors = [];
  let message = null;
  let feedbackColor = "";

  switch (strength) {
    case -1:
      colors = ["surface", "surface", "surface"];
      break;
    case 0:
      colors = ["danger", "surface", "surface"];
      feedbackColor = "danger";
      message = feedback.length > 0 ? feedback : "Very weak";
      break;
    case 1:
      colors = ["warning", "surface", "surface"];
      feedbackColor = "warning";
      message = feedback.length > 0 ? feedback : "Weak";
      break;
    case 2:
      colors = ["warning", "warning", "surface"];
      feedbackColor = "warning";
      message = feedback.length > 0 ? feedback : "Weak";
      break;
    case 3:
      colors = ["success", "success", "surface"];
      feedbackColor = "success";
      message = "Strong";
      break;
    case 4:
      colors = ["success", "success", "success"];
      feedbackColor = "success";
      message = "Very strong";
      break;
  }

  return (
    <div>
      <div className="flex items-center gap-3 py-1 px-1">
        <div className={`flex-1 h-1 rounded-md ${BAR_COLOR[colors[0]]}`} />
        <div className={`flex-1 h-1 rounded-md ${BAR_COLOR[colors[1]]}`} />
        <div className={`flex-1 h-1 rounded-md ${BAR_COLOR[colors[2]]}`} />
      </div>
      <p className={TEXT_COLOR[feedbackColor]}>{message ?? "\u00A0"}</p>
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(-1);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  function verifyPassword(confirmPassword) {
    if (password !== confirmPassword) {
      return false;
    }
  }

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

  const updatePassword = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length == 0) {
      setPasswordStrength(-1);
      return;
    }

    const result = zxcvbn(value);
    if (result.score <= 2 && result.feedback.warning) {
      setPasswordFeedback(result.feedback.warning);
    } else {
      setPasswordFeedback("");
    }

    setPasswordStrength(result.score);
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">

      {/* Marketing panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between basis-3/5 bg-surface p-[clamp(2rem,6vw,4rem)] overflow-hidden">
        <div className="flex flex-row items-center">
          <img src={tally_icon_64} alt="Tally logo" />
          <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold tracking-tight">Tally</h1>
        </div>

        <div>
          <h2 className="text-[clamp(1.5rem,3vw,2.25rem)]/[1] font-bold">Start tracking<br/> expenses for free.</h2>
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

        {/* Branding — visible only when the left panel is hidden */}
        <div className="flex flex-col items-center gap-2 mb-10 lg:hidden">
          <img src={tally_icon_64} alt="Tally logo" />
          <h1 className="text-2xl font-extrabold tracking-tight">Tally</h1>
          <p className="text-xs uppercase tracking-widest text-text-muted">Budget & Expense Tracking</p>
        </div>

        <div className="mb-6 text-center lg:text-start">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-text-muted text-sm mt-1">Sign up to get started</p>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex flex-col gap-1 grow max-h-19.5">
              <label className="text-text-muted text-md" htmlFor="first-name-input">First name</label>
              <input className="border border-border rounded-md p-3 bg-surface focus:border-primary" type="text" name="firstName" id="first-name-input" />  
            </div>
            <div className="flex flex-col gap-1 grow max-h-19.5">
              <label className="text-text-muted text-md" htmlFor="last-name-input">Last name</label>
              <input className="border border-border rounded-md p-3 bg-surface focus:border-primary" type="text" name="lastName" id="last-name-input" />  
            </div>
          </div>
          <div className="flex flex-col gap-1 max-h-19.5 mb-3">
            <label className="text-text-muted text-md" htmlFor="email-input">Email Address</label>
            <input className="border border-border rounded-md p-3 bg-surface focus:border-primary" type="email" name="email" id="email-input" />
          </div>
          <div className="flex flex-col gap-1 mb-1">
            <label className="text-text-muted text-md" htmlFor="password-input">Password</label>
            <input className="border border-border rounded-md p-3 bg-surface focus:border-primary grow" type="password" name="password" id="password-input" autoComplete="new-password" value={password} onChange={updatePassword}/>
            <PasswordStrengthIndicator strength={passwordStrength} feedback={passwordFeedback}/>
          </div>
          <div className="flex flex-col gap-1  max-h-19.5">
            <label className="text-text-muted text-md" htmlFor="confirm-password-input">Confirm Password</label>
            <input className="border border-border rounded-md p-3 bg-surface focus:border-primary" type="password" name="confirmPassword" id="confirm-password-input" autoComplete="new-password"/>
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
