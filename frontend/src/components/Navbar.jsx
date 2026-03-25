import { useLocation, Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext"
import tally_icon_32 from "../assets/tally_icon_32.svg"
import { House, Landmark, Wallet, BarChart3, Settings } from 'lucide-react'

function NavLink({ to, text, selected, icon: Icon }) {
    return selected ? (
        <Link to={to} className="text-primary bg-primary-muted rounded-lg flex flex-row gap-4 pl-3 pr-20 py-3 ml-1">
            <Icon></Icon>{text}
        </Link>
    ) : (
        <Link to={to} className="rounded-lg flex flex-row gap-4 pl-3 pr-20 py-3 ml-1">
            <Icon></Icon>
            {text}
        </Link>
    )
}


function Navbar() {
    const currSelected = useLocation().pathname;
    const { user } = useAuth()

    return (
        <div className="flex flex-col bg-surface px-4 pt-10 pb-5 border-r border-border h-screen justify-between">
            <div>
                <div className='flex flex-row items-center'>
                    <img src={tally_icon_32} alt="Tally logo" />
                    <h1 className="text-[clamp(1.5rem,3vw,1.5rem)] font-extrabold tracking-tight">
                        Tally
                    </h1>
                </div>
                <p className='text-[clamp(0.75rem,3vw,0.75rem)] text-text-muted uppercase mt-1 ml-1 tracking-tight'>Budget & Expense Tracking</p>

                <div className="flex flex-col mt-10">
                    <NavLink to="/dashboard" text="Dashboard" icon={House} selected={currSelected === '/'}/>
                    <NavLink to="/expenses" text="Expenses" icon={Landmark} selected={currSelected.startsWith("/expenses")}/>
                    <NavLink to="/budget" text="Budget" icon={Wallet} selected={currSelected.startsWith("/budget")}/>
                    <NavLink to="/reports" text="Reports" icon={BarChart3} selected={currSelected.startsWith("/reports")}/>
                </div>
            </div>

            <div>
                <hr className='text-border'/>
                <Link to="/settings" className='px-4 pt-5 flex flex-row gap-4'>
                    <div className='rounded-full bg-surface-raised w-[40px] h-[40px] p-2 flex justify-center items-center'>
                        {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div>
                        <h2>{user.first_name} {user.last_name[0]}.</h2>
                        <div className="flex flex-row items-center gap-1">
                            <Settings size={16} className='text-text-muted'/> <p className='text-text-muted'>Settings</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Navbar