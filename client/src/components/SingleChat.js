import React, { useEffect } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import './styles.css'
import io from 'socket.io-client';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import Lottie from 'react-lottie';
import animationsData from '../animations/typing.json';

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [loading, setLoading] = React.useState(false);
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState();
    const [socketConnected, setSocketConnected] = React.useState(false);
    const [typing, setTyping] = React.useState(false);
    const [isTyping, setIsTyping] = React.useState(false);
    const { user, selectedChat, setSelectedChat , notifications, setNotifications} = ChatState();
    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationsData ,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, []);

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            console.log(messages);
            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast({
                title: 'An error occurred',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        };
    };

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if(!notifications.includes(newMessageReceived)){
                    setNotifications([newMessageReceived,...notifications]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    }
                };
                setNewMessage('');
                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);
                console.log('message', data);
                socket.emit('new message', data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: 'An error occurred',
                    description: error.response.data.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                });
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };
    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Raleway"
                            display="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat('')}
                            />
                            {!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />
                                </>
                            )}
                        </Text>
                        <Box
                            display="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#1f2833"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        
                        >
                            {loading ? (
                                <Spinner
                                    size='xl'
                                    w={20}
                                    h={20}
                                    alignSelf='center'
                                    margin='auto'
                                />
                            ) : (
                                <div className='messages'>
                                    <ScrollableChat messages={messages} />
                                </div>
                            )}
                            <FormControl
                                onKeyDown={sendMessage}
                                isRequired
                                mt={3}
                            >
                                {isTyping ? <div>
                                    <Lottie 
                                    options={defaultOptions}
                                    width={70}
                                    style={{marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div> : <></>}
                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder='Type a message'
                                    onChange={typingHandler}
                                    value={newMessage}
                                />
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Raleway">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}

export default SingleChat