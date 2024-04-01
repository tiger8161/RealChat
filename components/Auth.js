import { useEffect, useState } from "react";

const Auth = ({ supabase, token, setToken }) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const checkUserInfo = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('userName', username)

        if (data) {
            if (password === data[0].password) {
                setToken(true);
                localStorage.setItem('userName', username);
            }
        }
    };
    return (
        <section className="vh-100">
            <div className="container py-5 h-100">
                <div className="row d-flex align-items-center justify-content-center h-100">
                    <div className="col-md-8 col-lg-7 col-xl-6">
                        <img 
                            src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg"
                            className="img-fluid" 
                            alt="Phone image" 
                        />
                    </div>
                    <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                        <div className="form-outline mb-4">
                            <input type="text" id="usernameInput" className="form-control form-control-lg" onChange={(e) => setUsername(e.target.value)} />
                            <label className="form-label">Username</label>
                        </div>

                        <div className="form-outline mb-4">
                            <input type="password" id="passwordInput" className="form-control form-control-lg" onChange={(e) => setPassword(e.target.value)} />
                            <label className="form-label">Password</label>
                        </div>

                        <button onClick={() => checkUserInfo()} className="btn btn-primary btn-lg btn-block">Sign in</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Auth;
