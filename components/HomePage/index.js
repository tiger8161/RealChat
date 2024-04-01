import { useEffect } from "react";

import Chat from "../Chat";
import Header from "../Header";

import style from "../../styles/HomePage.module.css";

const HomePage  = ({ supabase }) => {
    return (
        <div>
            {/* <div className={style.header}>
                <Header />
            </div> */}
            <Chat supabase={supabase} />
        </div>
    );
}

export default HomePage; 