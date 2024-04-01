import { useEffect, useRef, useState } from 'react';

import UserList from './Userlist';

import styles from '../styles/Chat.module.css';

const Chat = ({ supabase }) => {
    const username = localStorage.getItem('userName');

    const [fromUser, setFromUser] = useState();
    const [toUser, setToUser] = useState();

    const [messages, setMessages] = useState([]);
    const [msgContent, setMsgContent] = useState();
    const [editMsgId, setEditMsgId] = useState();

    useEffect(async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('userName', username)
        setFromUser(data[0]);

        const setupMessagesSubscription = async () => {
            await supabase
                .from('contents')
                .on('INSERT', payload => {
                    setMessages(previous => [].concat(previous, payload.new))
                })
                .subscribe()
        };
        await setupMessagesSubscription();
    }, []);
    useEffect(async () => {
        await getMessages();
    }, [toUser]);

    const sendMessage = async (e) => {
        // e.preventDefault()

        const data = {
            from: fromUser.id,
            to: toUser.id,
            content: msgContent
        }
        await supabase
            .from('contents')
            .insert(data)

        setMsgContent("");
    };
    const updateMessage = async () => {
        const { error } = await supabase
            .from('contents')
            .update({ content: msgContent })
            .eq('id', editMsgId)
        setEditMsgId("");
        setMsgContent("");
        await getMessages();
    };
    const compareTimes = (a, b) => {
        const timeA = new Date(a.created_at);
        const timeB = new Date(b.created_at);
        return timeA - timeB;
    };
    const getMessages = async () => {
        let msgs = [];
        const { data: firstContent, error: firstError } = await supabase
            .from('contents')
            .select()
            .eq('from', fromUser?.id)
            .eq('to', toUser?.id)
        if (firstContent) msgs = (firstContent);
        const { data: secondContent, error: secondError } = await supabase
            .from('contents')
            .select()
            .eq('from', toUser?.id)
            .eq('to', fromUser?.id)
        if (secondContent) msgs = [...msgs, ...secondContent];

        msgs = msgs.sort(compareTimes);
        setMessages(msgs);
    };
    const timeCheck = (time) => {
        const now = new Date();
        const targetDate = new Date(time);

        const timeDiff = now.getTime() - targetDate.getTime();

        const milliseconds = Math.abs(timeDiff);
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        return hours;
    };
    const editMsg = async (message) => {
        setEditMsgId(message.id);
        setMsgContent(message.content);
    };
    const deleteMsg = async (message) => {
        const { error } = await supabase
            .from('contents')
            .delete()
            .eq('id', message.id)
        await getMessages();
    };

    return (
        <section className={styles.gradient}>
            <div className="container pt-5">
                <div className="row">
                    <UserList supabase={supabase} setToUser={setToUser} />

                    {
                        toUser
                            ?
                            <div className={`col-md-6 col-lg-7 col-xl-7 ${styles.chat}`}>
                                <div className={styles.card}>
                                    <div className={`${styles.cardHeader} ${styles.msgHead}`}>
                                        <div className='d-flex bd-highlight'>
                                            <div className={styles.imgCont}>
                                                <img src={toUser?.avatar} className={`rounded-circle ${styles.userImg}`} />
                                            </div>
                                            <div className={styles.userInfo}>
                                                <span>{toUser?.userName}</span>
                                                <p>{messages?.length} Messages</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.divide}></div>
                                    <div className={`card-body ${styles.msgCardBody}`}>
                                        {
                                            messages?.map((message, index) => (
                                                message.from === fromUser.id
                                                    ?
                                                    <div key={index} className="d-flex justify-content-end mb-4">
                                                        <div className={styles.btns}>
                                                            <i className='fas fa-edit' onClick={() => editMsg(message)}></i>
                                                            <i className='fa fa-trash' onClick={() => deleteMsg(message)}></i>
                                                        </div>
                                                        <div className={styles.msgCotainerSend}>
                                                            {message.content}
                                                            {
                                                                timeCheck(message.created_at) < 24
                                                                    ?
                                                                    <span className={styles.msgTimeSend}>
                                                                        {new Date(message.created_at).toLocaleString('en-us', { hour12: true, hour: "numeric", minute: "numeric", second: "numeric" })}
                                                                    </span>
                                                                    :
                                                                    <span className={styles.msgTimeSend}>
                                                                        {new Date(message.created_at).toLocaleDateString('en-us')}
                                                                    </span>
                                                            }
                                                        </div>
                                                        <div className={styles.imgContMsg}>
                                                            <img
                                                                src={fromUser.avatar}
                                                                className={`rounded-circle ${styles.userImgMsg}`}
                                                            />
                                                        </div>
                                                    </div>
                                                    :
                                                    <div key={index} className="d-flex justify-content-start mb-4">
                                                        <div className={styles.imgContMsg}>
                                                            <img
                                                                src={toUser.avatar}
                                                                className={`rounded-circle ${styles.userImgMsg}`}
                                                            />
                                                        </div>
                                                        <div className={styles.msgCotainer}>
                                                            {message.content}
                                                            {
                                                                timeCheck(message.created_at) < 24
                                                                    ?
                                                                    <span className={styles.msgTime}>
                                                                        {new Date(message.created_at).toLocaleString('en-us', { hour12: true, hour: "numeric", minute: "numeric", second: "numeric" })}
                                                                    </span>
                                                                    :
                                                                    <span className={styles.msgTime}>
                                                                        {new Date(message.created_at).toLocaleDateString('en-us')}
                                                                    </span>
                                                            }
                                                        </div>
                                                    </div>
                                            )
                                            )
                                        }
                                    </div>
                                </div>
                                <div className={styles.cardFooter}>
                                    <div className="input-group">
                                        <textarea
                                            name="text"
                                            id="MsgContent"
                                            value={msgContent}
                                            onChange={(e) => setMsgContent(e.target.value)}
                                            className={`form-control ${styles.typeMsg}`}
                                            placeholder="Type your message...">
                                        </textarea>
                                        <div className="input-group-append">
                                            {
                                                editMsgId 
                                                    ? 
                                                        <span onClick={() => updateMessage()} className={`input-group-text ${styles.sendBtn}`}>
                                                            Update
                                                        </span>
                                                    :
                                                        <span onClick={() => sendMessage()} className={`input-group-text ${styles.sendBtn}`}>
                                                            Send
                                                        </span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className={`col-md-6 col-lg-7 col-xl-7 ${styles.chat}`}>
                            </div>
                    }

                </div>
            </div>
        </section>
    );
}
export default Chat
