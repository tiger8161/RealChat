import { useEffect, useRef, useState } from 'react';

import styles from '../styles/Chat.module.css';

const UserList = ({ supabase, setToUser }) => {
    const username = localStorage.getItem('userName');
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [userList, setUserList] = useState([]);

    const getUsers = async () => {
        let { data, error } = await supabase
            .from('users')
            .select('*')
            .neq('userName', username)
        setUsers(data);
        setUserList(data);
    };

    useEffect(async () => {
        await getUsers();
    }, []);
    
    useEffect (() => {
        const filtered = users.filter(user => user.userName.toLowerCase().search(filter.toLowerCase()) !== -1);
        setUserList(filtered);
    }, [filter]);
    
    const changeToUser = async (user) => {
        setToUser(user);
    };
    
    return (
        <div className="col-md-6 col-lg-5 col-xl-5 mb-4 mb-md-0">
            <div className={`card ${styles.mask}`}>
                <div className="card-body">
                    <div className="input-group rounded">
                        <input 
                            type="search" 
                            className="form-control rounded border-0 bg-transparent mb-3" 
                            placeholder="Search" 
                            onChange={(e) => setFilter(e.target.value)}
                            aria-label="Search" 
                            aria-describedby="search-addon" 
                        />
                        <span 
                            className="input-group-text border-0 bg-transparent mb-3" 
                            id="search-addon"
                        >
                            <i className="fas fa-search"></i>
                        </span>
                    </div>
                    <div className="list-unstyled mb-0">
                        {
                            userList?.map((user, index) =>
                                <div className={`p-2 border-bottom ${styles.userCard}`} style={{ 'borderBottom': '1px solid rgba(255,255,255,.3)' }} key={index} onClick={() => changeToUser(user)}>
                                    <div className="d-flex justify-content-between link-light">
                                        <div className="d-flex flex-row">
                                            <img
                                                src={user.avatar}
                                                alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                                width="60"
                                            />
                                            <div className="pt-1">
                                                <p className="fw-bold mb-0">{user.userName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;