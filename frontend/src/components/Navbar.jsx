import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext"
import { House, Landmark, Wallet, BarChart3, Settings, LayoutDashboard } from 'lucide-react'


function NavLinkCol({ to, text, selected, icon: Icon }) {
    return selected ? (
        <Link to={to} className="text-primary bg-primary/30 rounded-lg flex flex-row gap-4 pl-3 py-3">
            <Icon/>
            <div className='hidden lg:block'>{text}</div>
        </Link>
    ) : (
        <Link to={to} className="rounded-lg flex flex-row gap-4 pl-3 py-3 hover:bg-primary-muted hover:text-primary">
            <Icon/>
            <div className='hidden lg:block'>{text}</div>
        </Link>
    )
}

function NavLinkRow({ to, text, selected, icon: Icon }) {
    return selected ? (
        <Link to={to} className="flex text-primary text-[clamp(0.5rem, 3rem, 1rem)]rounded-lg flex-1 flex-col justify-center items-center p-3">
            <Icon/>
            <p className="hidden sm:block">{text}</p>
        </Link>
    ) : (
        <Link to={to} className="flex rounded-lg flex-1 flex-col justify-center items-center p-3">
            <Icon/>
            <p className="hidden sm:block">{text}</p>
        </Link>
    )
}

function Navbar() {
    const currSelected = useLocation().pathname;
    const navigate = useNavigate();
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login');
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <>
        <div className="flex-col bg-background px-4 pt-10 pb-5 border-r border-border h-screen hidden md:flex max-w-20 lg:max-w-100 justify-between">
            <div>
                <div className='flex flex-row items-center'>
                    {/* <img src={tally_icon_32} alt="Tally logo" /> */}
                    <h1 className="text-[clamp(1.5rem,3vw,1.5rem)] font-extrabold tracking-tight">
                        Tally
                    </h1>
                </div>
                <p className='text-[clamp(0.75rem,3vw,0.75rem)] text-text-muted uppercase mt-1 tracking-tight hidden lg:block'>Budget & Expense Tracking</p>

                <div className="flex flex-col mt-10 gap-1">
                    <NavLinkCol to="/dashboard" text="Dashboard" icon={LayoutDashboard} selected={currSelected === '/'}/>
                    <NavLinkCol to="/expenses" text="Expenses" icon={Landmark} selected={currSelected.startsWith("/expenses")}/>
                    <NavLinkCol to="/budget" text="Budget" icon={Wallet} selected={currSelected.startsWith("/budget")}/>
                    <NavLinkCol to="/reports" text="Reports" icon={BarChart3} selected={currSelected.startsWith("/reports")}/>
                </div>
            </div>

            <div>
                <hr className='text-border'/>
                <Link to="/settings" className='lg:px-4 pt-5 flex flex-row gap-4' onClick={handleLogout}>
                    <div className='rounded-full bg-surface-raised w-10 h-10 p-2 flex justify-center items-center'>
                        { user.first_name && user.last_name ? <>{user.first_name[0]}{user.last_name[0]}</> : <>G</>}
                        
                    </div>
                    <div className='hidden lg:block'>
                        <h2>
                            { user.first_name && user.last_name ? <>{user.first_name} {user.last_name[0]}.</> : <>Guest</>}
                        </h2>
                        <div className="flex flex-row items-center gap-1">
                            <Settings size={16} className='text-text-muted'/> <p className='text-text-muted'>Settings</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
        <div className="md:hidden bg-background flex flex-row justify-evenly py-1 gap-4 pb-4">
            <NavLinkRow to="/dashboard" text="Dashboard" icon={House} selected={currSelected === '/'}/>
            <NavLinkRow to="/expenses" text="Expenses" icon={Landmark} selected={currSelected.startsWith("/expenses")}/>
            <NavLinkRow to="/budget" text="Budget" icon={Wallet} selected={currSelected.startsWith("/budget")}/>
            <NavLinkRow to="/reports" text="Reports" icon={BarChart3} selected={currSelected.startsWith("/reports")}/>
        </div>
        </>
    )
}

export default Navbar