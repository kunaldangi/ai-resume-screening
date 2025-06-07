import './style.css';

export default function Login() {
    return (<>
        <div className="login">
            <div className="login__content">
                <div className="login__title">Login</div>
                <div className="login__form">
                    <input id='id-username' type="text" placeholder="Email" />
                    <input id='id-password' type="password" placeholder="Password" />
                    <button>Login</button>
                </div>
            </div>
        </div>
    </>);
}